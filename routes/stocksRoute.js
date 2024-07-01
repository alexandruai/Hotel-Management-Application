const express = require("express");
const router = express.Router();
const Stock = require('../models/stock');

// Get all stocks
router.get("/getallstocks", async (req, res) => {
    try {
        const stocks = await Stock.find({});
        res.send(stocks);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Add a new stock or update quantity if the product name exists
router.post("/addstock", async (req, res) => {
    const { productName, quantity, measureUnit, description } = req.body;

    try {
        let stock = await Stock.findOne({ productName });
        if (stock) {
            stock.quantity += parseInt(quantity);
            stock.history.push({
                action: 'ADAUGAT',
                quantity: quantity
            });
        } else {
            stock = new Stock({
                productName,
                quantity,
                measureUnit,
                description,
                history: [{
                    action: 'ADAUGAT',
                    quantity: quantity
                }]
            });
        }

        await stock.save();
        res.send('Stock added/updated successfully');
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Update stock quantity
router.post("/updatestock", async (req, res) => {
    const { stockId, quantity, action } = req.body;

    try {
        const stock = await Stock.findById(stockId);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        const newQuantity = action === 'ADAUGA' ? stock.quantity + quantity : stock.quantity - quantity;

        stock.quantity = newQuantity;
        stock.history.push({
            action: action === 'ADAUGA' ? 'ADAUGAT' : 'STERS',
            quantity: quantity
        });

        await stock.save();
        res.send("Stock updated successfully");
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Delete a stock
router.delete("/deletestock/:stockId", async (req, res) => {
    const stockId = req.params.stockId;
    try {
        const deletedStock = await Stock.findByIdAndDelete(stockId);
        if (!deletedStock) {
            return res.status(404).json({ message: "Stock not found" });
        }
        res.send("Stock deleted successfully");
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

module.exports = router;
