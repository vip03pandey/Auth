import jwt from 'jsonwebtoken'
const userAuth=async(req,res,next)=>{
    const {token}=req.cookies
    if(!token){
        return res.status(401).json({message:'Unauthorized'})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        if (decoded._id) {
            req.body.userId = decoded._id;
        }        
        else{
            return res.status(401).json({message:'Unauthorized, Login Again'})
        }
        next()
    }
    catch(err){
        res.status(401).json({message:'Unauthorized'})
    }
}
export default userAuth