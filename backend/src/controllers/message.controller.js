import User from "../models/user.model.js"
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import {getReceiverSocketId, io} from "../lib/socket.js";

export const getUser = async(req, res) => {
  try{
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id : { $ne: loggedInUserId}}).select("-password");
    res.status(200).json(filteredUsers);

  }catch(error){
    console.error("Error in getUser : ", error.message);
    res.status(500).json({error:"Internal server Error"});
  }
};

export const getMessage = async(req, res) => {
  try{
    const { id:to_id } = req.params;
    const from_id = req.user._id;

    const message = await Message.find({
      $or: [
        {senderId: from_id, receiverId: to_id},
        {senderId: to_id, receiverId: from_id}
      ],
    });

    res.status(200).json(message);
  }catch(error){
    console.log("Error in getMessage: ", error.message);
    res.status(500).json({error: "Internal Server Error"});
  }
}

export const sendMessage = async(req, res) => {
  try{
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if(image){
      //Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId, receiverId, text, image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("get-Messages", newMessage); //emit sends to all online use to reduce to selecteduser
    }

    res.status(201).json(newMessage);

  }catch(error){
    console.error("Error in sendMessage", error.message);
    res.status(500).json({error: "Internal Server Error"});
  }
}

