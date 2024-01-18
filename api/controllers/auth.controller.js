import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'
export const signup = async (req,res) => {
    const {username,email,password} = req.body;
    
    if(!username || !password || !email || username ==='' || email ==='' || password ==='')
    {
        return res.status(400).json({message : "All fields are required"})
    }
    const hashedPassword = bcryptjs.hashSync(password,12);
    const newUser = new User({
        username,
        email,
        password:hashedPassword,
    })
    try {
        await newUser.save();
        res.json({message:"Signup Successful"})
    } catch (error) {
        res.status(501).json({message: error.message})
    }

}