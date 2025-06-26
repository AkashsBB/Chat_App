import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

import { generateToken } from "../lib/utils.js";

export const signUp = async(req, res) => {
  const { userName, password, email} = req.body;
  try{
    if(password.length < 6) {
      return res.status(400).json({message: "Passwor must be at least 6 charecters"});
    }

    const user = await User.findOne({email});
    
    if (user) return res.status(400).json({message: "Email already exist"});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      email,
      password:hashedPassword
    })

    const savedUser = await newUser.save();

    if(newUser) {
      //generate jwt token
      generateToken(newUser._id, res);

      if (savedUser) {  
        generateToken(savedUser._id, res);
  
        return res.status(201).json({
          _id: savedUser._id,
          userName: savedUser.userName,
          email: savedUser.email,
          profilePic: savedUser.profilePic,
        });
      } else {
        console.log("User not saved!");
        return res.status(400).json({ message: "Invalid user data" });
      }
    }else{
      res.status(400).json({message: "Invalid user data"});
    }
  }catch(error){
    console.log("Error in SignUp controller", error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const login = async(req, res) => {
  const {email, password} = req.body;
  try{
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message: "Invalid credentials"});

    const pass = await bcrypt.compare(password, user.password);
    if(!pass) return res.status(400).json({message: "Invalid Credentials"});

    generateToken(user._id, res);
    // console.log(` From login Backend :\n
    //   _id: ${user._id},
    //   userName: ${user.userName},
    //   email: ${user.email},
    //   profilePic: ${user.profilePic}
    // }`);

    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profilePic: user.profilePic
    });
  }catch(error){
    console.log("Error in login controller", error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const logout = (req, res) => {
  try{
    res.cookie("jwt", "", {maxAge:0});
    res.status(200).json({message:"Logged out Successfully"});
  }catch(error){
    console.log("Error in logout controller", error.message);
    res.status(500).json({message:"Internal server error"});
  }
};

export const updateProfile = async(req, res) => {
  try{
    const { profilePic } = req.body;
    const userId = req.user._id;

    if(!profilePic){
      return res.status(400).json({message: "Profile pic is required"});
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url},
      {new: true}
    );

    res.status(200).json(updateUser);
  }catch(error){
    console.log("Error in update profile : ", error.message);
    res.status(500).json({message: "Internal server Error"});
  }
}

export const checkAuth = (req, res) => {
  try{
    console.log("User from check auth: ", req.user);
    res.status(200).json(req.user);
  }catch(error){
    console.log("Error in checkauth Controller", error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
}


