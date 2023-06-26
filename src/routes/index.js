const express=require("express")
const crearProduct = require("./ProductsRoutes/crearProduct")
const getAllProduct = require("./ProductsRoutes/getAllProduct")
const getById = require("./ProductsRoutes/getById")
const checkout = require("./Checkout/checkoutRoute")


const router=express.Router()

//DEPARTAMENTOS
router.use('/producto',crearProduct)
router.use('/producto',getAllProduct)
router.use('/producto',getById)


router.use('/checkout',checkout)



module.exports=(router)