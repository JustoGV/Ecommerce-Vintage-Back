const express=require('express')
const crearProduct=require('../../controllers/Products/CrearProduct')
const router =express.Router()

router.post('/',crearProduct)

module.exports=router