import userModel from "../models/userModel.js";

export const getUserData=async(req,res)=>{
    try{
        const {userId}=req.body;
        const user=await userModel.findOne({_id:userId})
        if(!user){
            return res.status(400).json({success:false,message:'User not found'})
        }
        res.status(200).json({success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }})
    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}