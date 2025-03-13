import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

export const register=async(req,res)=>{
    const {name,email,password}=req.body
    if(!name || !email || !password){
        return res.status(400).json({message:'Please fill all the fields'})
    }
    try{
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            return res.status(400).json({message:'Email already exists'})
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const user=await userModel.create({name,email,password:hashedPassword})
        await user.save()
        const token=jwt.sign({_id:user.id,name:user.name},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:process.env.NODE_ENV==='production'?'none':'strict',maxAge:1000*60*60*24*7})
        res.status(201).json({message:'User registered successfully',token})

    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}
export const login=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){    
        return res.status(400).json({message:'Please fill all the fields'})
    }
    try{
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(400).json({message:'User not found'})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:'Invalid password'})
        }
        const token=jwt.sign({_id:user.id,name:user.name},process.env.JWT_SECRET,{expiresIn:'7d'})
        res.cookie('token',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:process.env.NODE_ENV==='production'?'none':'strict',maxAge:1000*60*60*24*7})
        res.status(201).json({message:'User logged in successfully',token})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}
export const logout=async(req,res)=>{
    try{
        res.clearCookie('token',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:process.env.NODE_ENV==='production'?'none':'strict'})
        res.status(200).json({message:'User logged out successfully'})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}