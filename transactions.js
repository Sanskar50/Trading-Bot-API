const cron = require('node-cron');
const mongoose = require('mongoose');
const fs = require('fs').promises;
require('dotenv').config();

// Models
const Stock = require('./schemas/schemas').Stock;
const PriceHistory = require('./schemas/schemas').PriceHistory;
const Transaction = require('./schemas/schemas').Transaction;


mongoose.connect(process.env.MONGO_KEY, { useNewUrlParser: true, useUnifiedTopology: true });

async function fetchLatestPrices() {
    try {

        const data = await fs.readFile('./data/dummydata.json', 'utf-8');
        const updatedPrices = JSON.parse(data);

        // Fetch stocks from the database
        const stocks = await Stock.find();

        for (let stock of stocks) {
            try {
                // Find the corresponding stock data from the JSON file
                const stockData = updatedPrices.find(s => s.symbol === stock.symbol);

                if (stockData) {
                    const latestPrice = stockData.currentPrice;

                    // Update stock price
                    stock.currentPrice = latestPrice;
                    await stock.save();

                    // Add to price history
                    await PriceHistory.create({
                        stock: stock._id,
                        price: latestPrice,
                        date: new Date()
                    });

                    console.log(`Updated price for ${stock.symbol}: $${latestPrice}`);
                } else {
                    console.log(`No price found for ${stock.symbol} in the JSON file.`);
                }
            } catch (error) {
                console.error(`Error updating price for ${stock.symbol}:`, error);
            }
        }
    } catch (error) {
        console.error('Error reading the JSON file:', error);
    }
}


// Calculate moving averages
async function calculateMovingAverages(stockId, shortPeriod = 10, longPeriod = 20) {
    const prices = await PriceHistory.find({ stock: stockId })
        .sort({ date: -1 })
        .limit(longPeriod)
        .select('price');

    if (prices.length < longPeriod) return null;

    const shortMA = prices.slice(0, shortPeriod).reduce((sum, price) => sum + price.price, 0) / shortPeriod;
    const longMA = prices.reduce((sum, price) => sum + price.price, 0) / longPeriod;

    return { shortMA, longMA };
}

// Execute trading strategy
async function executeTradingStrategy() {
    const stocks = await Stock.find();

    for (let stock of stocks) {
        const mas = await calculateMovingAverages(stock._id);
        if (!mas) continue;

        const lastTransaction = await Transaction.findOne({ stock: stock._id }).sort({ date: -1 });

        if (mas.shortMA > mas.longMA && (!lastTransaction || lastTransaction.type === 'sell')) {
            // Buy signal
            await Transaction.create({
                stock: stock._id,
                type: 'buy',
                price: stock.currentPrice,
                quantity: 1
            });
            console.log(`Bought 1 share of ${stock.symbol} at $${stock.currentPrice}`);
        } else if (mas.shortMA < mas.longMA && lastTransaction && lastTransaction.type === 'buy') {
            // Sell signal
            const profit = stock.currentPrice - lastTransaction.price;
            await Transaction.create({
                stock: stock._id,
                type: 'sell',
                price: stock.currentPrice,
                quantity: 1,
                profit: profit
            });
            console.log(`Sold 1 share of ${stock.symbol} at $${stock.currentPrice}. Profit: $${profit}`);
        }
    }
}

//Schedule tasks
cron.schedule('*/1 * * * *', fetchLatestPrices);
cron.schedule('0 * * * *', executeTradingStrategy); 
