import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import productRoute from './routes/productRoute.js'
import userRoute from './routes/userRoute.js'
import authRoute from './routes/authRoutes.js'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'


dotenv.config()

const app = express()
//
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// cors for cross origin requests
app.use(cors())
//data sanitization against DOS attacks

app.use(helmet())
app.use(mongoSanitize())

//rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

app.get('/' , (req, res)=>{
    res.send("API is running...")
})

// Routes
app.use('/api/products/', productRoute)
app.use('/api/users/', userRoute)
// app.use('/api/orders/', orderRoute)
// app.use('/api/categories/', categoryRoute)

//refresh token route
app.use('/api/auth/', authRoute);

//error handling middleware
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
})


mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("MongoDb connected")
    app.listen(3000,()=>{
        console.log("Server is Listing at port 3000")
    })
})