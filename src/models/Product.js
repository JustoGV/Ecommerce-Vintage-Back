const mongoose = require("mongoose")
const { Schema } = mongoose

const Product = mongoose.Schema({
    tittle:{type: String, required: true, unique: true},
    description:{type: String, required: true},
    category:{type: String, required: true},
    price:{type: Number, required: true},
    imagenURL: { type: String, required: true },
})
const productModel = mongoose.model('Product', Product)

module.exports = productModel