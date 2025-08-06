const express = require('express');
const router = express.Router();
const googleSheets = require('../services/googleSheets');
const { authenticateToken, authorizeRole, hashPassword } = require('../middleware/auth');
const { validateUserUpdate } = require('../middleware/validation');

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin, Super Admin)
router.get('/', authenticateToken, authorizeRole('admin', 'super_admin'), async (req, res) => {
  try {
    const users = await googleSheets.getAllUsers();
    
    // Remove password from response
    const sanitizedUsers = users.map(user => ({
      id: user.ID,
      username: user.Username,
      email: user.Email,
      role: user.Role,
      status: user.Status,
      createdAt: user.Created_At
    }));

    res.json({ users: sanitizedUsers });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin, Super Admin, or own profile)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Users can only view their own profile unless they're admin
    if (req.user.Role !== 'admin' && req.user.Role !== 'super_admin' && req.user.ID !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const users = await googleSheets.getAllUsers();
    const user = users.find(u => u.ID === id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove password from response
    const sanitizedUser = {
      id: user.ID,
      username: user.Username,
      email: user.Email,
      role: user.Role,
      status: user.Status,
      createdAt: user.Created_At
    };

    res.json({ user: sanitizedUser });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin, Super Admin, or own profile)
router.put('/:id', authenticateToken, validateUserUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Users can only update their own profile unless they're admin
    if (req.user.Role !== 'admin' && req.user.Role !== 'super_admin' && req.user.ID !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Non-admin users can't change their role
    if (req.user.Role !== 'admin' && req.user.Role !== 'super_admin' && updateData.role) {
      return res.status(403).json({ error: 'Cannot change role' });
    }

    // Hash password if provided
    if (updateData.password) {
      updateData.Password = await hashPassword(updateData.password);
      delete updateData.password;
    }

    // Map field names to match Google Sheets
    const mappedData = {};
    if (updateData.username) mappedData.Username = updateData.username;
    if (updateData.email) mappedData.Email = updateData.email;
    if (updateData.role) mappedData.Role = updateData.role;
    if (updateData.status) mappedData.Status = updateData.status;
    if (updateData.Password) mappedData.Password = updateData.Password;

    const updatedUser = await googleSheets.updateUser(id, mappedData);

    res.json({
      message: 'User updated successfully',
      user: {
        id: updatedUser.ID,
        username: updatedUser.Username,
        email: updatedUser.Email,
        role: updatedUser.Role,
        status: updatedUser.Status,
        createdAt: updatedUser.Created_At
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin, Super Admin)
router.delete('/:id', authenticateToken, authorizeRole('admin', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (req.user.ID === id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const users = await googleSheets.getAllUsers();
    const userIndex = users.findIndex(u => u.ID === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Soft delete by setting status to inactive
    await googleSheets.updateUser(id, { Status: 'inactive' });

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/users/:id/activate
// @desc    Activate user (Admin only)
// @access  Private (Admin, Super Admin)
router.post('/:id/activate', authenticateToken, authorizeRole('admin', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;

    await googleSheets.updateUser(id, { Status: 'active' });

    res.json({ message: 'User activated successfully' });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics (Admin only)
// @access  Private (Admin, Super Admin)
router.get('/stats', authenticateToken, authorizeRole('admin', 'super_admin'), async (req, res) => {
  try {
    const users = await googleSheets.getAllUsers();
    
    const stats = {
      total: users.length,
      active: users.filter(u => u.Status === 'active').length,
      inactive: users.filter(u => u.Status === 'inactive').length,
      byRole: {
        super_admin: users.filter(u => u.Role === 'super_admin').length,
        admin: users.filter(u => u.Role === 'admin').length,
        operator: users.filter(u => u.Role === 'operator').length,
        customer: users.filter(u => u.Role === 'customer').length
      }
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 