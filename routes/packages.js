const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validatePackage } = require('../middleware/validation');
const googleSheets = require('../services/googleSheets');

// Get all packages
router.get('/', authenticateToken, async (req, res) => {
  try {
    const packages = await googleSheets.getPackages();
    res.json({
      success: true,
      data: packages
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch packages'
    });
  }
});

// Get package by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const package = await googleSheets.getPackageById(req.params.id);
    if (!package) {
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }
    res.json({
      success: true,
      data: package
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch package'
    });
  }
});

// Create new package
router.post('/', authenticateToken, validatePackage, async (req, res) => {
  try {
    const packageData = {
      name: req.body.name,
      speed: req.body.speed,
      price: req.body.price,
      description: req.body.description,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      createdAt: new Date().toISOString()
    };

    const newPackage = await googleSheets.createPackage(packageData);
    res.status(201).json({
      success: true,
      data: newPackage,
      message: 'Package created successfully'
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create package'
    });
  }
});

// Update package
router.put('/:id', authenticateToken, validatePackage, async (req, res) => {
  try {
    const packageData = {
      name: req.body.name,
      speed: req.body.speed,
      price: req.body.price,
      description: req.body.description,
      isActive: req.body.isActive,
      updatedAt: new Date().toISOString()
    };

    const updatedPackage = await googleSheets.updatePackage(req.params.id, packageData);
    if (!updatedPackage) {
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    res.json({
      success: true,
      data: updatedPackage,
      message: 'Package updated successfully'
    });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update package'
    });
  }
});

// Delete package
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await googleSheets.deletePackage(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Package not found'
      });
    }

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete package'
    });
  }
});

module.exports = router; 