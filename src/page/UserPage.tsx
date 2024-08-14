import { useState } from "react"
import { FaUserCircle } from "react-icons/fa"
import { Link } from "react-router-dom"

export const user_list = [
  {
      "name": "Alice Johnson",
      "role": "Project Manager",
      following: true,
      followed: ['current']
  },
  {
      "name": "Bob Smith",
      "role": "Software Engineer",
      following: false
  },
  {
      "name": "Charlie Brown",
      "role": "UX Designer",
      following: true
  },
  {
      "name": "Diana Greene",
      "role": "Marketing Specialist",
      following: false
  },
  {
      "name": "Edward White",
      "role": "Data Analyst",
      following: true,
      followed: ['current']
  }
]

export type UserType = {
  name: string,
  role: string,
  following: boolean,
  followed?: string[]
}

export const UserTemplate = ({user}:{user:UserType})=>{

  const [following,setFollowing] =  useState(user.following)

return <div className="flex gap-2 items-center border-2 rounded-full p-4 border-blue-200">
    <FaUserCircle size={50} />
    <div className="flex flex-col gap-0 basis-[30rem]">
              <h3 className="font-semibold">{user.name}</h3>
              <span className="text-gray-400">
                {user.role}
              </span>
        </div>
        <div className="flex gap-5">
          {following?<button onClick={()=>setFollowing(false)}className="text-blue-600 font-bold">Unfollow</button>:<button onClick={()=>setFollowing(true)} className="text-blue-600 font-bold">Follow</button>}
          <div className="flex gap-1 items-center text-gray-500 font-semibold">
          <FaUserCircle size={20}/>
          <Link to='/profile'>Profile</Link>
          </div>
        </div>
   </div>
}

const UserPage = () => {
  return (
    <div className="max-w-3xl my-4 mx-auto flex flex-col gap-3">
      {user_list?.map((user:UserType)=><UserTemplate user={user}/>)}
    </div>
  )
}

export default UserPage
