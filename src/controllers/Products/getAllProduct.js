const productModel = require('../../models/Product')


const getAllProduct = async (req, res) => {
    try {
        const productos=await productModel.find()
        res.status(200).json(productos)
    } catch (error) {
        console.log(error)
    }
}

module.exports = getAllProduct