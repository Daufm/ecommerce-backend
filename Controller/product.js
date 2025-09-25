import Product from '../models/Products.js'





// Create a new product
export const postProducts = async(req, res)=>{
    try{
         const newProduct = await Product.create(req.body)
        res.status(201).json(newProduct)
   } catch(error){
        res.status(500).json({message:error.message})
   }
}

// Get all products
export const getProducts = async(req, res)=>{
    try{
        const products = await Product.find({})

            res.status(200).json(products)
    } catch(error){
        res.status(500).json({message:error.message})
    }
}