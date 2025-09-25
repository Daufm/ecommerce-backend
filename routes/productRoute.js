import express from 'express'
import Product from '../models/Products.js'

const router = express.Router()


//add product

router.post('/', async(req ,res)=>{

   try{
         const newProduct = await Product.create(req.body)
        res.status(201).json(newProduct)
   } catch(error){
        res.status(500).json({message:error.message})
   }
})

router.get('/' , async(req, res)=>{
    try{
        const products = await Product.find({})
        res.status(200).json(products)
    } catch(error){
        res.status(500).json({message:error.message})
    }
})


export default router