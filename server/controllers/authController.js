import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js'

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

        const mailOptions={
            from:"vipul03pandey@gmail.com",
            to:email,
            subject:'Welcome to Auth',
            text:`Welcome to Auth, ${name}!.Your account has been created successfully. `,
        }
        await transporter.sendMail(mailOptions)
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

export const verifyOtp=async(req,res)=>{
    const {userId}=req.body
    const user=await userModel.findOne({_id:userId})
    if(user.isAccountVerified){
        return res.status(400).json({message:'User already verified'})
    }
    const otp=String(Math.floor(100000+Math.random()*900000));
    user.verifyOtp=otp
    user.verifyOtpExpireAt=Date.now()+24*60*60*1000
    await user.save()
    const mailOptions = {  
        from:"vipul03pandey@gmail.com",
        to:user.email,
        subject:'Verify your account',  
        text:`Your Otp is ${otp}.Verify your account`
    }
        await transporter.sendMail(mailOptions)
        res.status(200).json({message:'OTP sent successfully'})
    }

    export const verifyEmail = async (req, res) => {
        const { userId, otp } = req.body;
        
        if (!userId || !otp) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
    
        try {
            const user = await userModel.findOne({ _id: userId });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
    
            if (String(user.verifyOtp).trim() !== String(otp).trim() || user.verifyOtp === '') {
                return res.status(400).json({ message: 'Invalid OTP' });
            }            
    
            if (new Date(user.verifyOtpExpireAt).getTime() < Date.now()) {
                return res.status(400).json({ message: 'OTP expired' });
            }
    
            user.isAccountVerified = true;
            user.verifyOtp = '';
            user.verifyOtpExpireAt = 0;
            await user.save();
    
            res.status(200).json({ message: 'Email verified successfully' });
        } catch (err) {
            console.error(err);  // Log for debugging
            res.status(500).json({ message: err.message });
        }
    };

    export const isAunthenticated = async (req, res) => {
        try{
            return res.json({success:true})
        }
        catch(err){
            res.status(500).json({message:err.message})
        }
    }

    // reset otp
    export const resetOtp = async (req, res) => {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
    
            const otp = String(Math.floor(100000 + Math.random() * 900000));
            user.resetOtp = otp;  // Changed to resetOtp for consistency
            user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
            await user.save();
    
            const mailOptions = {
                from: "vipul03pandey@gmail.com",
                to: email,
                subject: 'Reset Your Password',
                text: `Your OTP for password reset is ${otp}. It is valid for 24 hours.`
            };
            await transporter.sendMail(mailOptions);
    
            res.status(200).json({ message: 'OTP sent successfully' });
    
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    };    

    export const resetPassword = async (req, res) => {
        const { email, otp, newpassword } = req.body;
    
        if (!email || !otp || !newpassword) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
    
        try {
            const user = await userModel.findOne({email });
    
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
    
            // Debug logs for OTP comparison
    
            if (!user.resetOtp || String(user.resetOtp).trim() !== String(otp).trim()) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }
    
            if (user.resetOtpExpireAt < Date.now()) {
                return res.status(400).json({ message: 'OTP expired' });
            }
    
            const hashedPassword = await bcrypt.hash(newpassword, 10);
            user.password = hashedPassword;
            user.resetOtp = '';
            user.resetOtpExpireAt = 0;
            await user.save();
    
            res.status(200).json({ message: 'Password reset successfully' });
    
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    };
    