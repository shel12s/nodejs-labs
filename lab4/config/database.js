const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/inventory_lab4';

// Singleton pattern: ensures only one DB connection instance exists
class Database {
  constructor() {
    if (Database._instance) {
      console.log('[Database] Returning existing instance (Singleton reused)');
      return Database._instance;
    }
    console.log('[Database] Creating new Singleton instance');
    this.connection = null;
    Database._instance = this;
  }

  static getInstance() {
    if (!Database._instance) {
      new Database();
    }
    return Database._instance;
  }

  async connect() {
    if (this.connection) {
      console.log('[Database] Already connected, reusing connection (Singleton)');
      return this.connection;
    }
    console.log('[Database] Connecting to MongoDB...');
    this.connection = await mongoose.connect(MONGO_URI);
    console.log(`[Database] Connected to MongoDB at ${MONGO_URI}`);
    return this.connection;
  }
}

Database._instance = null;

module.exports = Database;
