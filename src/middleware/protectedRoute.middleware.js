import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectedRoute= async (req,res,next)=>{
        try {
            const token = req.cookies.whatsappToken
                console.log(token);
                
            if(!token){
                return res.status(401).send({message:"invalid token"})
            }

            const decode = jwt.verify(token,process.env.JWT_SECRET)

            if(!decode){
                return res.status(400).send({message:"token invalid"})
            }

            const user = await User.findById(decode.userId).select("-password")
            
            if(!user){
                return res.status(404).send({message:"not user found"})
            }

            req.user = user

            next()

        } catch (error) {
            res.status(500).send({message:"server Error"})
        }
}