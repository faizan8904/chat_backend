import jwt from "jsonwebtoken"

export const generateToken=(userId,res)=>{

    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"1h"
    })

    console.log("token generation start")
        console.log(token);
        
    console.log("token generation end")

    
    
    res.cookie("whatsappToken",token,{
        maxAge: 3600*1000,
        httpOnly:true, // prevent XSS attacks cross-site scripting attack
        sameSite:"strict", // csrf attack
        secure:false,// secure: process.env.NODE_ENV === "production", //secure: process.env.NODE_ENV !== "development"
        path: "/",
    });

    return token;
}