const mongoose = require('mongoose');
const Schema = mongoose.Schema

// Stock Schema
const stockSchema = new Schema({
    name: { type: String, required: true },
    symbol: { type: String, required: true, unique: true }, // Stock symbol field
    currentPrice: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now }
});

// PriceHistory Schema
const priceHistorySchema = new Schema({
    stock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Transaction Schema
const transactionSchema = new Schema({
    stock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    type: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    profit: {
        type: Number,
        default: null
    }
});

// Create indexes for better query performance
priceHistorySchema.index({ date: -1 });
transactionSchema.index({ stock: 1, date: -1 });
transactionSchema.index({ type: 1 });

const Stock = mongoose.model('Stock', stockSchema);
const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = { Stock, PriceHistory, Transaction }