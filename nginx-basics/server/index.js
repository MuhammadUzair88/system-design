import express from "express"
import dotenv from "dotenv"
import connectDb from "./lib/db.js"
import User from "./model/user.model.js"
import Redis from "ioredis"
import { rateLimiter } from "./middleware/ratelimit.js"
import sendEmail from "./lib/sendEmail.js"
import emailQueue from "./queue.js"
dotenv.config()

const Port=process.env.PORT || 5000

const app=express()

export const redis=new Redis(process.env.REDIS_URL)


app.use(express.json()) // req.body will return null if we wont include it

app.get("/",(req,res)=>{
    return res.status(200).json({message:`Hello from server ${process.env.SERVER_NAME}`})

})

app.post('/create',async(req,res)=>{
    const {name,email,password}=req.body;
    await redis.del("user:all")  // delete the users when new user is created
  const user=await User.create({
     name,
     email,
     password
  })
//   await sendEmail()

await emailQueue.add("send-email",{email})

  return res.json(user)
})
 
app.get('/get',rateLimiter,async(req,res)=>{
    const user=await User.find({}) 
    return res.json(user)
})

app.get('/get-with-redis',async(req,res)=>{
    const cached= await redis.get("user:all")
    if(cached){
        const data=JSON.parse(cached)
        return res.json(data)
    }
    const user=await User.find({})
     await redis.set("user:all",JSON.stringify(user))
     const data=JSON.parse(user)
    return res.json(data)
})

// storing otp on redis for some time


app.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP for 30 seconds using ioredis
  await redis.set(`otp:${email}`, otp, "EX", 120);

  return res.json({ message: "OTP generated successfully",otp });
});


//verify the otp
app.post("/verify-otp",async(req,res)=>{
    const {email,otp}=req.body
    const checkOtp=await redis.get(`otp:${email}`)
    if(!checkOtp){
        return res.json({"message":"otp not found or has been expired"})
    }
    if(checkOtp!==otp){
     return res.json({message:"you have entered incorrect otp"})
    }
    await redis.del(`otp:${email}`)
    return res.json(checkOtp)
})




app.listen(Port,()=>{
    connectDb()
    console.log(`server started ${Port}`)
})

//without redis -- 149ms 222ms etc
// we dont use redis for write operations
