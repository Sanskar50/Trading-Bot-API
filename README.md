# Trader Bot API

This API allows you to manage stocks, retrieve price histories, track transactions, and automate trading strategies using real-time stock data from a local JSON file. It integrates with MongoDB for persistent storage and offers basic trading functionalities.

## Installation

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```
   
3. Set up MongoDB and ensure the connection is configured properly in your project.
4. Insert initial stock data into MongoDB:

   ```bash
   node data/insertionScript.js
   ```

## API Endpoints

### 1. `GET /listAllStocks`
Retrieves a list of all stocks currently available in the database.

### 2. `GET /priceHistory`
Returns the price history of a specific stock over time, based on the symbol.

### 3. `GET /transactions`
Lists all the stock transactions (buy/sell) that have been executed.

### 4. `POST /addStock`
Adds a new stock to the database with its details like name, symbol, and initial price.

### 5. `POST /updateStock`
Updates the current price or other information for an existing stock in the database.

## Data Source

- A `dummy-data.json` file located in the `data` folder acts as a mock real-time stock price API. This file simulates live price updates, which are fetched and used in the trading strategy.
- **Note:** The dummy data provided is minimal and may not be sufficient to fully observe all features of the application. However, if a larger and more comprehensive dataset is used, all the features of the API, such as price history and transactions, can be fully explored and tested.

## Initial Stock Insertion

- The `insertionScript.js` in the `data` folder inserts initial stock data into MongoDB. Run this script once to populate the database before using the API.

## Transaction Logic

The `Transactions.js` file handles core trading logic. It includes the following key functions:

### 1. `fetchLatestPrices()`
Fetches the latest stock prices from the `dummy-data.json` file and updates the database with the current prices.

### 2. `calculateMovingAverages()`
Calculates moving averages of stock prices over a specified period, which is commonly used for trend analysis in trading.

### 3. `executeTradingStrategy()`
Executes predefined trading strategies (e.g., buy/sell) based on stock price movements and calculated indicators such as moving averages.

### 4. **Node Cron Scheduler**
A Node Cron Scheduler has been implemented in `Transactions.js` to update stock prices and perform transactions after a set interval.
