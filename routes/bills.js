const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateBill } = require('../middleware/validation');
const googleSheets = require('../services/googleSheets');

// Get all bills
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customerId, month, year } = req.query;
    const bills = await googleSheets.getBills({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      customerId,
      month,
      year
    });
    
    res.json({
      success: true,
      data: bills
    });
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bills'
    });
  }
});

// Get bill by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const bill = await googleSheets.getBillById(req.params.id);
    if (!bill) {
      return res.status(404).json({
        success: false,
        error: 'Bill not found'
      });
    }
    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bill'
    });
  }
});

// Get bills by customer
router.get('/customer/:customerId', authenticateToken, async (req, res) => {
  try {
    const bills = await googleSheets.getBillsByCustomer(req.params.customerId);
    res.json({
      success: true,
      data: bills
    });
  } catch (error) {
    console.error('Error fetching customer bills:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer bills'
    });
  }
});

// Create new bill
router.post('/', authenticateToken, validateBill, async (req, res) => {
  try {
    const billData = {
      customerId: req.body.customerId,
      packageId: req.body.packageId,
      month: req.body.month,
      year: req.body.year,
      amount: req.body.amount,
      dueDate: req.body.dueDate,
      status: req.body.status || 'pending',
      notes: req.body.notes,
      createdAt: new Date().toISOString()
    };

    const newBill = await googleSheets.createBill(billData);
    res.status(201).json({
      success: true,
      data: newBill,
      message: 'Bill created successfully'
    });
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create bill'
    });
  }
});

// Generate bills for all customers
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { month, year } = req.body;
    const generatedBills = await googleSheets.generateMonthlyBills(month, year);
    
    res.status(201).json({
      success: true,
      data: generatedBills,
      message: `${generatedBills.length} bills generated successfully`
    });
  } catch (error) {
    console.error('Error generating bills:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate bills'
    });
  }
});

// Update bill
router.put('/:id', authenticateToken, validateBill, async (req, res) => {
  try {
    const billData = {
      customerId: req.body.customerId,
      packageId: req.body.packageId,
      month: req.body.month,
      year: req.body.year,
      amount: req.body.amount,
      dueDate: req.body.dueDate,
      status: req.body.status,
      notes: req.body.notes,
      updatedAt: new Date().toISOString()
    };

    const updatedBill = await googleSheets.updateBill(req.params.id, billData);
    if (!updatedBill) {
      return res.status(404).json({
        success: false,
        error: 'Bill not found'
      });
    }

    res.json({
      success: true,
      data: updatedBill,
      message: 'Bill updated successfully'
    });
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update bill'
    });
  }
});

// Update bill status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedBill = await googleSheets.updateBillStatus(req.params.id, status);
    
    if (!updatedBill) {
      return res.status(404).json({
        success: false,
        error: 'Bill not found'
      });
    }

    res.json({
      success: true,
      data: updatedBill,
      message: 'Bill status updated successfully'
    });
  } catch (error) {
    console.error('Error updating bill status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update bill status'
    });
  }
});

// Delete bill
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await googleSheets.deleteBill(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Bill not found'
      });
    }

    res.json({
      success: true,
      message: 'Bill deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete bill'
    });
  }
});

// Get bill statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await googleSheets.getBillStatistics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching bill statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bill statistics'
    });
  }
});

module.exports = router; 