const express=require("express")
const crearProduct = require("./ProductsRoutes/crearProduct")
const getAllProduct = require("./ProductsRoutes/getAllProduct")
const getById = require("./ProductsRoutes/getById")


const router=express.Router()

//DEPARTAMENTOS
router.use('/producto',crearProduct)
router.use('/producto',getAllProduct)
router.use('/producto',getById)



module.exports=(router)