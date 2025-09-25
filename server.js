import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRoute from './routes/productRoute.js'
dotenv.config()

const app = express()

app.use(express.json())

app.get('/' , (req, res)=>{
    res.send("API is running...")
})


app.use('/api/products', productRoute)


mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("MongoDb connected")
    app.listen(3000,()=>{
        console.log("Server is Listing at port 3000")
    })
})