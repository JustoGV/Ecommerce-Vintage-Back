const productModel = require('../../models/Product')


const crearProducto = async (req, res) => {
    
    const nuevoProducto = new productModel(req.body);
    await nuevoProducto.save();
    res.json(nuevoProducto);
}

module.exports = crearProducto