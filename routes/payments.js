const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validatePayment } = require('../middleware/validation');
const googleSheets = require('../services/googleSheets');

// Get all payments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, customerId, month, year } = req.query;
    const payments = await googleSheets.getPayments({
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      customerId,
      month,
      year
    });
    
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payments'
    });
  }
});

// Get payment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const payment = await googleSheets.getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment'
    });
  }
});

// Get payments by customer
router.get('/customer/:customerId', authenticateToken, async (req, res) => {
  try {
    const payments = await googleSheets.getPaymentsByCustomer(req.params.customerId);
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Error fetching customer payments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer payments'
    });
  }
});

// Create new payment
router.post('/', authenticateToken, validatePayment, async (req, res) => {
  try {
    const paymentData = {
      billId: req.body.billId,
      customerId: req.body.customerId,
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      paymentDate: req.body.paymentDate || new Date().toISOString(),
      status: req.body.status || 'completed',
      reference: req.body.reference,
      notes: req.body.notes,
      createdAt: new Date().toISOString()
    };

    const newPayment = await googleSheets.createPayment(paymentData);
    res.status(201).json({
      success: true,
      data: newPayment,
      message: 'Payment created successfully'
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment'
    });
  }
});

// Update payment
router.put('/:id', authenticateToken, validatePayment, async (req, res) => {
  try {
    const paymentData = {
      billId: req.body.billId,
      customerId: req.body.customerId,
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      paymentDate: req.body.paymentDate,
      status: req.body.status,
      reference: req.body.reference,
      notes: req.body.notes,
      updatedAt: new Date().toISOString()
    };

    const updatedPayment = await googleSheets.updatePayment(req.params.id, paymentData);
    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: updatedPayment,
      message: 'Payment updated successfully'
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payment'
    });
  }
});

// Update payment status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedPayment = await googleSheets.updatePaymentStatus(req.params.id, status);
    
    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: updatedPayment,
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payment status'
    });
  }
});

// Delete payment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await googleSheets.deletePayment(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete payment'
    });
  }
});

// Get payment statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const stats = await googleSheets.getPaymentStatistics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching payment statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment statistics'
    });
  }
});

// Get payment methods statistics
router.get('/stats/methods', authenticateToken, async (req, res) => {
  try {
    const stats = await googleSheets.getPaymentMethodsStatistics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching payment methods statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment methods statistics'
    });
  }
});

module.exports = router; 