import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"

dotenv.config()

const Port=process.env.PORT || 5000

const app=express()

app.use(express.json()) // req.body will return null if we wont include it

app.get("/",(req,res)=>{
    return res.status(200).json({message:`Hello from backend or gateway ${process.env.SERVER_NAME}`})

})


app.use("/auth",proxy("http://auth-service:8001"))
app.use("/order",proxy("http://order-service:8002"))
app.use("/product",proxy("http://product-service:8003"))

app.listen(Port,()=>{
    console.log(`server started ${Port}`)
})

//without redis -- 149ms 222ms etc
// we dont use redis for write operations
