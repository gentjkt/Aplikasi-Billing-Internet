const express = require('express');
const router = express.Router();
const googleSheets = require('../services/googleSheets');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { validateCustomerCreation } = require('../middleware/validation');

// @route   GET /api/customers
// @desc    Get all customers
// @access  Private (Admin, Operator)
router.get('/', authenticateToken, authorizeRole('admin', 'operator', 'super_admin'), async (req, res) => {
  try {
    const customers = await googleSheets.getAllCustomers();
    const packages = await googleSheets.getAllPackages();

    // Enrich customer data with package information
    const enrichedCustomers = customers.map(customer => {
      const package = packages.find(p => p.ID === customer.Package_ID);
      return {
        id: customer.ID,
        name: customer.Name,
        address: customer.Address,
        phone: customer.Phone,
        email: customer.Email,
        packageId: customer.Package_ID,
        package: package ? {
          id: package.ID,
          name: package.Name,
          speed: package.Speed,
          price: package.Price
        } : null,
        status: customer.Status,
        joinDate: customer.Join_Date
      };
    });

    res.json({ customers: enrichedCustomers });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/customers/:id
// @desc    Get customer by ID
// @access  Private (Admin, Operator, or own data for customers)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Customers can only view their own data unless they're admin/operator
    if (req.user.Role === 'customer' && req.user.ID !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const customer = await googleSheets.getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const packages = await googleSheets.getAllPackages();
    const package = packages.find(p => p.ID === customer.Package_ID);

    const enrichedCustomer = {
      id: customer.ID,
      name: customer.Name,
      address: customer.Address,
      phone: customer.Phone,
      email: customer.Email,
      packageId: customer.Package_ID,
      package: package ? {
        id: package.ID,
        name: package.Name,
        speed: package.Speed,
        price: package.Price
      } : null,
      status: customer.Status,
      joinDate: customer.Join_Date
    };

    res.json({ customer: enrichedCustomer });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/customers
// @desc    Create new customer
// @access  Private (Admin, Operator)
router.post('/', authenticateToken, authorizeRole('admin', 'operator', 'super_admin'), validateCustomerCreation, async (req, res) => {
  try {
    const { name, address, phone, email, packageId } = req.body;

    // Check if package exists
    const packages = await googleSheets.getAllPackages();
    const package = packages.find(p => p.ID === packageId);
    if (!package) {
      return res.status(400).json({ error: 'Invalid package ID' });
    }

    // Check if customer with same email already exists
    const existingCustomers = await googleSheets.getAllCustomers();
    const existingCustomer = existingCustomers.find(c => c.Email === email);
    if (existingCustomer) {
      return res.status(400).json({ error: 'Customer with this email already exists' });
    }

    const customerData = {
      name,
      address,
      phone,
      email,
      packageId,
      status: 'active'
    };

    const newCustomer = await googleSheets.createCustomer(customerData);

    res.status(201).json({
      message: 'Customer created successfully',
      customer: {
        id: newCustomer.ID,
        name: newCustomer.Name,
        address: newCustomer.Address,
        phone: newCustomer.Phone,
        email: newCustomer.Email,
        packageId: newCustomer.Package_ID,
        status: newCustomer.Status,
        joinDate: newCustomer.Join_Date
      }
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private (Admin, Operator)
router.put('/:id', authenticateToken, authorizeRole('admin', 'operator', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if customer exists
    const existingCustomer = await googleSheets.getCustomerById(id);
    if (!existingCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Check if package exists if packageId is being updated
    if (updateData.packageId) {
      const packages = await googleSheets.getAllPackages();
      const package = packages.find(p => p.ID === updateData.packageId);
      if (!package) {
        return res.status(400).json({ error: 'Invalid package ID' });
      }
    }

    // Map field names to match Google Sheets
    const mappedData = {};
    if (updateData.name) mappedData.Name = updateData.name;
    if (updateData.address) mappedData.Address = updateData.address;
    if (updateData.phone) mappedData.Phone = updateData.phone;
    if (updateData.email) mappedData.Email = updateData.email;
    if (updateData.packageId) mappedData.Package_ID = updateData.packageId;
    if (updateData.status) mappedData.Status = updateData.status;

    const updatedCustomer = await googleSheets.updateCustomer(id, mappedData);

    res.json({
      message: 'Customer updated successfully',
      customer: {
        id: updatedCustomer.ID,
        name: updatedCustomer.Name,
        address: updatedCustomer.Address,
        phone: updatedCustomer.Phone,
        email: updatedCustomer.Email,
        packageId: updatedCustomer.Package_ID,
        status: updatedCustomer.Status,
        joinDate: updatedCustomer.Join_Date
      }
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete customer (soft delete)
// @access  Private (Admin, Operator)
router.delete('/:id', authenticateToken, authorizeRole('admin', 'operator', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const existingCustomer = await googleSheets.getCustomerById(id);
    if (!existingCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Soft delete by setting status to inactive
    await googleSheets.updateCustomer(id, { Status: 'inactive' });

    res.json({ message: 'Customer deactivated successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/customers/:id/activate
// @desc    Activate customer
// @access  Private (Admin, Operator)
router.post('/:id/activate', authenticateToken, authorizeRole('admin', 'operator', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;

    await googleSheets.updateCustomer(id, { Status: 'active' });

    res.json({ message: 'Customer activated successfully' });
  } catch (error) {
    console.error('Activate customer error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/customers/:id/bills
// @desc    Get customer bills
// @access  Private (Admin, Operator, or own bills for customers)
router.get('/:id/bills', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Customers can only view their own bills unless they're admin/operator
    if (req.user.Role === 'customer' && req.user.ID !== id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const bills = await googleSheets.getBillsByCustomer(id);
    const packages = await googleSheets.getAllPackages();

    // Enrich bill data with package information
    const enrichedBills = bills.map(bill => {
      const package = packages.find(p => p.ID === bill.Package_ID);
      return {
        id: bill.ID,
        customerId: bill.Customer_ID,
        packageId: bill.Package_ID,
        package: package ? {
          id: package.ID,
          name: package.Name,
          speed: package.Speed,
          price: package.Price
        } : null,
        month: bill.Month,
        year: bill.Year,
        amount: bill.Amount,
        status: bill.Status,
        dueDate: bill.Due_Date,
        createdAt: bill.Created_At
      };
    });

    res.json({ bills: enrichedBills });
  } catch (error) {
    console.error('Get customer bills error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/customers/stats
// @desc    Get customer statistics
// @access  Private (Admin, Operator)
router.get('/stats', authenticateToken, authorizeRole('admin', 'operator', 'super_admin'), async (req, res) => {
  try {
    const customers = await googleSheets.getAllCustomers();
    
    const stats = {
      total: customers.length,
      active: customers.filter(c => c.Status === 'active').length,
      inactive: customers.filter(c => c.Status === 'inactive').length,
      thisMonth: customers.filter(c => {
        const joinDate = new Date(c.Join_Date);
        const now = new Date();
        return joinDate.getMonth() === now.getMonth() && 
               joinDate.getFullYear() === now.getFullYear();
      }).length
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 