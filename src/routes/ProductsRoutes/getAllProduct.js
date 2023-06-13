const express=require('express')

const getAllProduct=require('../../controllers/Products/getAllProduct')

const router =express.Router()

router.get('/',getAllProduct)

module.exports=router