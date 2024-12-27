import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar=async(req,res)=>{
    console.log("getting users");
    try {
        
        
        const loggedInUserId = req.user._id;
        // find all users except loggedInUserId || .select() except password
        const filteredUsers= await User.find({_id:{$ne:loggedInUserId}}).select("-password")

        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log(error);
        
        res.status(500).json(error)
    }
}

export const getMessages=async(req,res)=>{
    try {
        const {id:freindId} = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {
                    senderId:myId,
                    receiverId:freindId
                },
                {
                    senderId:freindId,
                    receiverId:myId
                }
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({message:"Intenral error"})
    
    }
}

export const sendMessage=async(req,res)=>{
    console.log(req.body);
    
    try {
        const {text,image} = req.body
        const {id:freindId}= req.params;
        const myId = req.user._id;

        let imageUrl
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId:myId,
            receiverId:freindId,
            text:text,
            image:imageUrl
        })

        await newMessage.save()

        //todo:realtime functionality goes here => socketio

        res.status(201).json(newMessage)

    } catch (error) {
        res.status(500).json({message:"Intenral error"})
    
    }
}