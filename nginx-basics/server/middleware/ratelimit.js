import { redis } from "../index.js"

export const rateLimiter=async(req,res,next)=>{
    const ip=req.ip
    const key=`rate_limit:${ip}`
    const requests=await redis.incr(key)

    if(requests==1){
        await redis.expire(key,60)  // after every 1 min it will expire the rate limiting
    }

    if(requests>5){
        return res.status(429).json({message:"too many requests"})
    }
    next()
}
