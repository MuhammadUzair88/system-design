import express from "express"
import dotenv from "dotenv"

dotenv.config()

const Port=process.env.PORT || 5000

const app=express()

app.use(express.json()) // req.body will return null if we wont include it

app.get("/",(req,res)=>{
    return res.status(200).json({message:`Hello from auth `})

})

app.listen(Port,()=>{
    console.log(`server started ${Port}`)
})

//without redis -- 149ms 222ms etc
// we dont use redis for write operations
