const mongoose = require('mongoose')
const fs = require('fs')
const cron = require('node-cron')
require('dotenv').config()
const Stock = require('../schemas/schemas').Stock

mongoose.connect(process.env.MONGO_KEY)

async function addData() {
    try {
        // Read the JSON file
        const jsonData = fs.readFileSync('dummydata.json', 'utf-8')
        const stocks = JSON.parse(jsonData)

        for (const stock of stocks) {
            await Stock.findOneAndUpdate(
                { name: stock.name },
                { $set: { currentPrice: stock.currentPrice } },
                { new: true, upsert: true }
            )
        }

        // await Stock.insertMany(stocks);

        console.log('Data imported/updated successfully')
    } catch (err) {
        console.error('Error importing/updating data:', err)
    } finally {
        mongoose.connection.close()
    }
}


cron.schedule('*/1 * * * *', () => {
    console.log('Running stock price update')
    addData().then(() => console.log('addData executed')).catch((err) => console.error(err))
})






