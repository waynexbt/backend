const Custom_Data = require("../models/custom_data.model");

exports.get_custom_data = async (req, res) => {
    try {
        const candlesticks = await Custom_Data.find();
        res.json(candlesticks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

}