const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const googleSheets = require('../services/googleSheets');

// Get dashboard overview
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const overview = await googleSheets.getDashboardOverview();
    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard overview'
    });
  }
});

// Get revenue statistics
router.get('/revenue', authenticateToken, async (req, res) => {
  try {
    const { period = 'monthly', year } = req.query;
    const revenue = await googleSheets.getRevenueStatistics(period, year);
    res.json({
      success: true,
      data: revenue
    });
  } catch (error) {
    console.error('Error fetching revenue statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue statistics'
    });
  }
});

// Get customer statistics
router.get('/customers', authenticateToken, async (req, res) => {
  try {
    const stats = await googleSheets.getCustomerStatistics();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching customer statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer statistics'
    });
  }
});

// Get bill statistics
router.get('/bills', authenticateToken, async (req, res) => {
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

// Get payment statistics
router.get('/payments', authenticateToken, async (req, res) => {
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

// Get recent activities
router.get('/activities', authenticateToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const activities = await googleSheets.getRecentActivities(parseInt(limit));
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent activities'
    });
  }
});

// Get overdue bills
router.get('/overdue', authenticateToken, async (req, res) => {
  try {
    const overdueBills = await googleSheets.getOverdueBills();
    res.json({
      success: true,
      data: overdueBills
    });
  } catch (error) {
    console.error('Error fetching overdue bills:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overdue bills'
    });
  }
});

// Get top customers
router.get('/top-customers', authenticateToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const topCustomers = await googleSheets.getTopCustomers(parseInt(limit));
    res.json({
      success: true,
      data: topCustomers
    });
  } catch (error) {
    console.error('Error fetching top customers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top customers'
    });
  }
});

// Get monthly comparison
router.get('/monthly-comparison', authenticateToken, async (req, res) => {
  try {
    const { year } = req.query;
    const comparison = await googleSheets.getMonthlyComparison(year);
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Error fetching monthly comparison:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch monthly comparison'
    });
  }
});

// Get package performance
router.get('/package-performance', authenticateToken, async (req, res) => {
  try {
    const performance = await googleSheets.getPackagePerformance();
    res.json({
      success: true,
      data: performance
    });
  } catch (error) {
    console.error('Error fetching package performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch package performance'
    });
  }
});

// Get payment methods distribution
router.get('/payment-methods', authenticateToken, async (req, res) => {
  try {
    const distribution = await googleSheets.getPaymentMethodsDistribution();
    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error('Error fetching payment methods distribution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment methods distribution'
    });
  }
});

// Get customer growth
router.get('/customer-growth', authenticateToken, async (req, res) => {
  try {
    const { period = 'monthly', year } = req.query;
    const growth = await googleSheets.getCustomerGrowth(period, year);
    res.json({
      success: true,
      data: growth
    });
  } catch (error) {
    console.error('Error fetching customer growth:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer growth'
    });
  }
});

module.exports = router; 