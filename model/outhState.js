const mongoose = require("mongoose");

const outhStateSchema = new mongoose.Schema({
    
}, { timestamps: true });

module.exports = mongoose.model('outhState', outhStateSchema);