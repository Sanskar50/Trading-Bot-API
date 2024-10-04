const express=require('express')
const StockController=require('../controllers/features')
const router=express.Router()

router.get('/listAllStocks',StockController.listAllStocks)

router.get('/priceHistory',StockController.priceHistory)

router.get('/transactions',StockController.transactions)

router.post('/addStock',StockController.addStock)

router.post('/updateStock',StockController.updateStock)

module.exports = router