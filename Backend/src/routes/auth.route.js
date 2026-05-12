import {Router} from 'express'

import jwt from 'jsonwebtoken'
import { User } from '../models/user.js';
import { signToken } from '../utils/token.js';
import { comparePassword } from '../utils/password.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register',async (req,res)=>{
    try{
        const {name, email , password} = req.body;
    if(!name || !email || !password) {
        return res.status(400).json({
            error:{
                message: "All fields are required!"
            }
        })
    }
    if(password.length<8){
        return res.status(400).json({
            error:{
                message:"password must be of 8 characters"
            }
        })
    }

    const existingUser = await User.findOne({email})
    if(existingUser){
        return res.status(400).json({
            error:{
                message:"User with this email is already exists!"
            }
        })
    }

    const user = await User.create({name,email,password})
    const token = signToken(user)
    return res.status(201).json({
        message:'Registration successful!',
        token
    })
    }catch(error){
        console.log(error);
        
        res.status(500).json({
            err:{
                message: "Server error"
            }
        })
    }
})


router.post('/login',async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({
                error:{
                    message:"user doesn't exist"
                }
            })
        }
        const hashedPass = user.password;
        const passwordCheck = comparePassword(password,hashedPass);
        if(!passwordCheck){
            res.status(400).json({
                error:{
                    message:"Invalid credentials"
                }
            })
        }
        const token = signToken(user)
        res.status(201).json({
            message:'Login successfull!',
            token
        })
    } catch (error) {
        res.status(500).json({
            err:{
                message:error.message
            }
        })
    }
})


router.get('/me',authMiddleware,async (req,res)=>{
    const user = await User.findById(req.user.id).select('-password')
    res.json({
        user
    })
})

export default router;