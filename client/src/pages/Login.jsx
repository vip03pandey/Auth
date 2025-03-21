import React from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
function Login() {
  const [state,setState]=useState('SignUp')
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const Navigate=useNavigate()
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
     <img onClick={()=>Navigate('/')} src={assets.logo} alt="" srcset="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' />
     <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
      <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state==='SignUp'?'Create Account':'Login '}</h2>
      <p className='text-small  text-center mb-3'>{state==='SignUp'?'Create Your Account':'Login to your account'}</p>
      <form >
        {state==='SignUp' && ( <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
          <img src={assets.person_icon} alt="" />
          <input onChange={(e)=>setName(e.target.value)} value={name} className='bg-transparent outline-none text-white' type="text" name="" id="" placeholder='Full Name' required/>
        </div>)}
       
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
          <img src={assets.mail_icon} alt="" />
          <input onChange={(e)=>setEmail(e.target.value)} value={email} className='bg-transparent outline-none text-white' type="email" name="" id="" placeholder='Email' required/>
        </div>
        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] '>
          <img src={assets.lock_icon} alt="" />
          <input onChange={(e)=>setPassword(e.target.value)} value={password} className='bg-transparent outline-none text-white' type="password" name="" id="" placeholder='Password' required/>
        </div>
        <p onClick={()=>Navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>
        <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium cursor-pointer'>{state==='SignUp'?'Sign Up':'Login'}</button>
      </form>
      {state==='SignUp' ? (      <p className='text-gray-400 text-senter text-xs mt-4 text-center'>Already have an account ? {' '} <span onClick={()=>setState('Login')} className='text-blue-400 cursor-pointer underline'>Login Here</span></p>
 ): (      <p className='text-gray-400 text-senter text-xs mt-4 text-center'>Dont Have an acccount ? {' '} <span  onClick={()=>setState('SignUp')} className='text-blue-400 cursor-pointer underline'>SignUp</span></p>
 )}
     </div>
    </div>
  )
}

export default Login
