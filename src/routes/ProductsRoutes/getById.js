const express=require('express')

const getById=require('../../controllers/Products/getProductById')

const router =express.Router()

router.get('/:id',getById)

module.exports=router