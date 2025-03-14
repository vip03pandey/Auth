import express from 'express'
import {register,login,logout} from '../controllers/authController.js'
import userAuth from '../middleware/userAuth.js'
import {verifyOtp,verifyEmail,isAunthenticated,resetOtp,resetPassword} from '../controllers/authController.js'
const authRouter=express.Router()
authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.post('/send-verify-otp',userAuth,verifyOtp)
authRouter.post('/send-verify-email',userAuth,verifyEmail)
authRouter.post('/is-authenticated',userAuth,isAunthenticated)
authRouter.post('/send-reset-otp',resetOtp)
authRouter.post('/reset-password',resetPassword)
export default authRouter