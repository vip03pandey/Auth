import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import EmailVerify from './pages/EmailVerify'
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
        <Route path="/email-verify" element={<EmailVerify/>} />
        </Routes>
    </div>
  )
}

export default App
