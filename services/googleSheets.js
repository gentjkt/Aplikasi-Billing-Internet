const { google } = require('googleapis');
const moment = require('moment');

class GoogleSheetsService {
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    this.spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  }

  // Helper method to get sheet data
  async getSheetData(sheetName) {
    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: sheetName,
      });
      return response.data.values || [];
    } catch (error) {
      console.error(`Error getting sheet data for ${sheetName}:`, error);
      throw error;
    }
  }

  // Helper method to update sheet data
  async updateSheetData(sheetName, values) {
    try {
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: sheetName,
        valueInputOption: 'RAW',
        resource: { values },
      });
    } catch (error) {
      console.error(`Error updating sheet data for ${sheetName}:`, error);
      throw error;
    }
  }

  // Helper method to append data to sheet
  async appendSheetData(sheetName, values) {
    try {
      await this.sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: sheetName,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: { values },
      });
    } catch (error) {
      console.error(`Error appending sheet data for ${sheetName}:`, error);
      throw error;
    }
  }

  // Helper method to clear sheet data
  async clearSheetData(sheetName) {
    try {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: sheetName,
      });
    } catch (error) {
      console.error(`Error clearing sheet data for ${sheetName}:`, error);
      throw error;
    }
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Users methods
  async getAllUsers() {
    const data = await this.getSheetData('Users');
    if (data.length === 0) return [];
    
    const headers = data[0];
    return data.slice(1).map(row => {
      const user = {};
      headers.forEach((header, index) => {
        user[header] = row[index] || '';
      });
      return user;
    });
  }

  async createUser(userData) {
    const users = await this.getAllUsers();
    const newUser = {
      ID: this.generateId(),
      Username: userData.username,
      Email: userData.email,
      Password: userData.password, // Should be hashed
      Role: userData.role || 'customer',
      Status: userData.status || 'active',
      Created_At: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    const values = [Object.values(newUser)];
    await this.appendSheetData('Users', values);
    return newUser;
  }

  async getUserByEmail(email) {
    const users = await this.getAllUsers();
    return users.find(user => user.Email === email);
  }

  async updateUser(userId, userData) {
    const users = await this.getAllUsers();
    const userIndex = users.findIndex(user => user.ID === userId);
    
    if (userIndex === -1) throw new Error('User not found');
    
    users[userIndex] = { ...users[userIndex], ...userData };
    
    const headers = ['ID', 'Username', 'Email', 'Password', 'Role', 'Status', 'Created_At'];
    const values = [headers, ...users.map(user => headers.map(header => user[header] || ''))];
    
    await this.updateSheetData('Users', values);
    return users[userIndex];
  }

  // Customers methods
  async getAllCustomers() {
    const data = await this.getSheetData('Customers');
    if (data.length === 0) return [];
    
    const headers = data[0];
    return data.slice(1).map(row => {
      const customer = {};
      headers.forEach((header, index) => {
        customer[header] = row[index] || '';
      });
      return customer;
    });
  }

  async createCustomer(customerData) {
    const customers = await this.getAllCustomers();
    const newCustomer = {
      ID: this.generateId(),
      Name: customerData.name,
      Address: customerData.address,
      Phone: customerData.phone,
      Email: customerData.email,
      Package_ID: customerData.packageId,
      Status: customerData.status || 'active',
      Join_Date: moment().format('YYYY-MM-DD')
    };

    const values = [Object.values(newCustomer)];
    await this.appendSheetData('Customers', values);
    return newCustomer;
  }

  async getCustomerById(customerId) {
    const customers = await this.getAllCustomers();
    return customers.find(customer => customer.ID === customerId);
  }

  async updateCustomer(customerId, customerData) {
    const customers = await this.getAllCustomers();
    const customerIndex = customers.findIndex(customer => customer.ID === customerId);
    
    if (customerIndex === -1) throw new Error('Customer not found');
    
    customers[customerIndex] = { ...customers[customerIndex], ...customerData };
    
    const headers = ['ID', 'Name', 'Address', 'Phone', 'Email', 'Package_ID', 'Status', 'Join_Date'];
    const values = [headers, ...customers.map(customer => headers.map(header => customer[header] || ''))];
    
    await this.updateSheetData('Customers', values);
    return customers[customerIndex];
  }

  // Packages methods
  async getAllPackages() {
    const data = await this.getSheetData('Packages');
    if (data.length === 0) return [];
    
    const headers = data[0];
    return data.slice(1).map(row => {
      const package = {};
      headers.forEach((header, index) => {
        package[header] = row[index] || '';
      });
      return package;
    });
  }

  async createPackage(packageData) {
    const packages = await this.getAllPackages();
    const newPackage = {
      ID: this.generateId(),
      Name: packageData.name,
      Speed: packageData.speed,
      Price: packageData.price,
      Status: packageData.status || 'active',
      Description: packageData.description || ''
    };

    const values = [Object.values(newPackage)];
    await this.appendSheetData('Packages', values);
    return newPackage;
  }

  // Bills methods
  async getAllBills() {
    const data = await this.getSheetData('Bills');
    if (data.length === 0) return [];
    
    const headers = data[0];
    return data.slice(1).map(row => {
      const bill = {};
      headers.forEach((header, index) => {
        bill[header] = row[index] || '';
      });
      return bill;
    });
  }

  async createBill(billData) {
    const bills = await this.getAllBills();
    const newBill = {
      ID: this.generateId(),
      Customer_ID: billData.customerId,
      Package_ID: billData.packageId,
      Month: billData.month,
      Year: billData.year,
      Amount: billData.amount,
      Status: billData.status || 'unpaid',
      Due_Date: billData.dueDate,
      Created_At: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    const values = [Object.values(newBill)];
    await this.appendSheetData('Bills', values);
    return newBill;
  }

  async getBillsByCustomer(customerId) {
    const bills = await this.getAllBills();
    return bills.filter(bill => bill.Customer_ID === customerId);
  }

  async updateBill(billId, billData) {
    const bills = await this.getAllBills();
    const billIndex = bills.findIndex(bill => bill.ID === billId);
    
    if (billIndex === -1) throw new Error('Bill not found');
    
    bills[billIndex] = { ...bills[billIndex], ...billData };
    
    const headers = ['ID', 'Customer_ID', 'Package_ID', 'Month', 'Year', 'Amount', 'Status', 'Due_Date', 'Created_At'];
    const values = [headers, ...bills.map(bill => headers.map(header => bill[header] || ''))];
    
    await this.updateSheetData('Bills', values);
    return bills[billIndex];
  }

  // Payments methods
  async getAllPayments() {
    const data = await this.getSheetData('Payments');
    if (data.length === 0) return [];
    
    const headers = data[0];
    return data.slice(1).map(row => {
      const payment = {};
      headers.forEach((header, index) => {
        payment[header] = row[index] || '';
      });
      return payment;
    });
  }

  async createPayment(paymentData) {
    const payments = await this.getAllPayments();
    const newPayment = {
      ID: this.generateId(),
      Bill_ID: paymentData.billId,
      Amount: paymentData.amount,
      Payment_Date: paymentData.paymentDate,
      Payment_Method: paymentData.paymentMethod,
      Receipt_File: paymentData.receiptFile || '',
      Notes: paymentData.notes || '',
      Created_By: paymentData.createdBy
    };

    const values = [Object.values(newPayment)];
    await this.appendSheetData('Payments', values);
    return newPayment;
  }

  async getPaymentsByBill(billId) {
    const payments = await this.getAllPayments();
    return payments.filter(payment => payment.Bill_ID === billId);
  }

  // Dashboard methods
  async getDashboardStats() {
    const customers = await this.getAllCustomers();
    const bills = await this.getAllBills();
    const payments = await this.getAllPayments();
    const packages = await this.getAllPackages();

    const activeCustomers = customers.filter(c => c.Status === 'active').length;
    const totalBills = bills.length;
    const unpaidBills = bills.filter(b => b.Status === 'unpaid').length;
    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.Amount || 0), 0);

    return {
      activeCustomers,
      totalBills,
      unpaidBills,
      totalRevenue,
      totalPackages: packages.length
    };
  }
}

module.exports = new GoogleSheetsService(); 