import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup= async (req,res)=>{
    console.log(req.body)
    const {fullName,email,password} = req.body;
        try {
            if(password.length<6){
                return res.status(400).json({message:"Password must be at least 6 characters"})

            }

            const user = await User.findOne({email})

            if(user){
                return res.status(400).json({message:"Email already exists"})
            }

            const salt = await bcrypt.genSalt(10)

            const hashedPassword = await bcrypt.hash(password,salt)

            const newUser = new User({
                fullName,
                email,
                password:hashedPassword
            })

            if(newUser){
                //generating jwt token here
                generateToken(newUser._id,res)
                await newUser.save();

                res.status(201).json({
                    _id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    profilePic: newUser.profilePic,
                    password: newUser.password
                })
            }
            else{
                res.status(400).json({message:"Invalid data"})
            }
        } catch (error) {
            console.log("Error singup controller",error.message);
            res.status(500).send("Error server")
            
        }
}

export const login= async(req,res)=>{
    const {email,password} = req.body

    try {
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }

      const isPasswordCorrect=  await bcrypt.compare(password,user.password)

      if(!isPasswordCorrect){
        return res.status(400).json({message:"invalid credentials"})
      }

      generateToken(user._id,res)

      console.log("all done");
      
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        password: user.password
    })

    } catch (error) {
        res.status(500).send("Internal error")
    }
}

export const logout=(req,res)=>{
    try {
        res.cookie("whatsappToken","",{maxAge:0})
        res.status(200).json({message:"logged out succesfully"})
    } catch (error) {
        res.status(500).send("Internal error")
    }
}

export const updateProfile= async(req,res)=>{
    try {
        const {profilePic} = req.body
        const userId = req.user._id

        if(!profilePic){
            return res.status(400).json({message:"Profilee pic is required"})

        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updateUSer = await User.findByIdAndUpdate(userId,{
            profilePic:uploadResponse.secure_url
        },{
            new:true
        })

        res.status(200).json(updateUSer)
    } catch (error) {
        res.status(500).send("Internal error")
    }
}

export const checkAuth= (req,res)=>{
    console.log("check auth ");

    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller ",error.message);
        res.status(500).json({message:"Unauthroized No Token"})
        
    }
}

