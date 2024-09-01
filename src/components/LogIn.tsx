import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { auth } from '../firebase/config'

const LogIn = () => {
  const [loginData,setLoginData] = useState({
    email:'',
    password: ''
  })
  return (
    <form className="flex flex-col gap-2" onSubmit={async(e)=>{
        e.preventDefault()

        if(!loginData.email || !loginData.password)return alert("Please fill all fields")

        try {
          await signInWithEmailAndPassword(auth,loginData.email,loginData.password)
        } catch (error) {
          
        }

      }}
      
      >
        <h2 className="text-3xl max-sm:text-2xl font-bold text-center mb-4">Log in to your account</h2>
        <label htmlFor="email">
          <h3 className="font-semibold">Email</h3>
          <input onChange={(e)=>setLoginData(prev=>({...prev,email:e.target.value}))} type="text" className="border-[1px] rounded-lg border-gray-700 w-full p-2 focus:border-blue-950 focus:border-2 outline-none" />
        </label>
        <label htmlFor="password">
          <h3 className="font-semibold">Password</h3>
          <input onChange={(e)=>setLoginData(prev=>({...prev,password:e.target.value}))} type="text" className="border-[1px] rounded-lg border-gray-700 w-full p-2 focus:border-blue-950 focus:border-2 outline-none" />
        </label>
        <button className="bg-blue-950 w-full py-2 rounded-xl text-white font-bold hover:bg-blue-700">Log In</button>
      </form>
  )
}

export default LogIn
