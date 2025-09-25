import express from 'express'
import Product from '../models/Products.js'

const router = express.Router()


// product
router.get('/' , getProducts)
router.post('/' , createProduct)




export default router