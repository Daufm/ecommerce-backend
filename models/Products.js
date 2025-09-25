import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        name :{type:String,required:true},
        description :{type:String, required:true},
        price :{type:Number, required:true},
        image :{type:String, required:true},
        countInStock :{type:Number, required:true},
        category :{type:String, required:true},
        brand :{type:String, required:true},
        rating :{type:Number, required:true, default:0},
        numReviews :{type:Number, required:true, default:0},
    },
    {timestamps:true
    }
)

export default mongoose.model("Product", productSchema)