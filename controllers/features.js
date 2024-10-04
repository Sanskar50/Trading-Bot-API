const Stock = require('../schemas/schemas.js').Stock
const PriceHistory=require('../schemas/schemas').PriceHistory
const Transactions=require('../schemas/schemas').Transaction

// controller to list all stocks
exports.listAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.find().sort({ name: 1 })

        res.status(200).json({
            success: true,
            count: stocks.length,
            data: stocks,
            message: 'Stocks retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving stocks',
            error: error.message
        })
    }
}

//controller to list priceHistory of transactons
exports.priceHistory = async (req, res) => {
    try {
        const stocks = await PriceHistory.find().sort({ name: 1 })

        res.status(200).json({
            success: true,
            data:stocks,
            message: 'Price History retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving Prices',
            error: error.message
        })
    }
}

exports.transactions = async (req, res) => {
    try {
        const transactions = await Transactions.find().sort({ name: 1 })

        res.status(200).json({
            success: true,
            data:transactions,
            message: 'Transactions retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving Transactions',
            error: error.message
        })
    }
}

// Controller to add a new stock
exports.addStock = async (req, res) => {
    try {
        const { name, currentPrice } = req.query

        const newStock = new Stock({
            name,
            currentPrice
        })

        const savedStock = await newStock.save()

        res.status(201).json({
            success: true,
            data: savedStock,
            message: 'Stock added successfully'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error adding stock',
            error: error.message
        })
    }
}

// Controller to update an existing stock
exports.updateStock = async (req, res) => {
    try {
        const { name, currentPrice } = req.query

        const updatedStock = await Stock.findByIdAndUpdate(
            id,
            {
                currentPrice,
                lastUpdated: Date.now()
            },
            { new: true, runValidators: true }
        )

        if (!updatedStock) {
            return res.status(404).json({
                success: false,
                message: 'Stock not found'
            })
        }

        res.status(200).json({
            success: true,
            data: updatedStock,
            message: 'Stock updated successfully'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating stock',
            error: error.message
        })
    }
}