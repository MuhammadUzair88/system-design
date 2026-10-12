import mongoose from "mongoose"


const connectDb=async()=>{
    try{
     await mongoose.connect(process.env.MONGODB_URI)
     console.log("db Connected")
    }
    catch(err){
     console.log(error)
    }
}

export default connectDb