const productModel = require('../../models/Product')


const getEdById = async (req, res) => {
    const {id}=req.params
    try {
        const edId=await productModel.findById({_id:id})
        res.status(200).json(edId)
    } catch (error) {
        console.log(error)
    }
}

module.exports = getEdById