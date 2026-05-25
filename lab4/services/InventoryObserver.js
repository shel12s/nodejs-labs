const EventEmitter = require('events');

// Observer pattern: emits inventory events that any subscriber can listen to
class InventoryObserver extends EventEmitter {
  constructor() {
    super();
    this._registerDefaultListeners();
  }

  _registerDefaultListeners() {
    this.on('transaction_made', (data) => {
      console.log(`[Observer] transaction_made — action: ${data.action}, item: "${data.itemName}", qty: ${data.quantity}, user: ${data.username}`);
    });

    this.on('low_stock_alert', (data) => {
      console.warn(`[Observer] LOW STOCK ALERT — item: "${data.itemName}", current qty: ${data.quantity}, min: ${data.minQuantity}`);
    });
  }

  notifyTransaction(action, itemName, quantity, username) {
    this.emit('transaction_made', { action, itemName, quantity, username });
  }

  notifyLowStock(itemName, quantity, minQuantity) {
    this.emit('low_stock_alert', { itemName, quantity, minQuantity });
  }
}

// Export a single shared instance
module.exports = new InventoryObserver();
