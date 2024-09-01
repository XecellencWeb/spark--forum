import { useState } from "react"
import { FaUserCircle } from "react-icons/fa"
import Select from 'react-select'
import { PostTemplate, thread } from "./PostPage"

export const role_data = [
  'Logistics Analyst or Manager',
  'Supply Chain Analyst or Manager',
  'Fleet Manager',
  'Warehouse Operations Manager',
  'Storage and Distribution Manager',
  'Global Logistics Manager',
  'Procurement Manager',
  'Facilities Manager'
]

const ProfilePage = () => {
  
    const [editing, setEditing] = useState(false)

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex gap-x-3 gap-y-1 items-center flex-wrap">
      <FaUserCircle size={100} /> <button className="bg-blue-500 hover:bg-blue-300 font-bold px-3 py-2 rounded-full text-white">Change Picture</button><button className="text-red-600 py-2 font-bold">Delete Picture</button>
      </div>
     
     {
      editing?<form action="" className="mt-8">
        <div className="mb-4">
          <h4 className="font-bold ml-4 mb-1">Full Name</h4>
          <input defaultValue='Mike Moris' type="text" className="w-full border-[1px] border-gray-300 px-4 py-2 rounded-lg" />
        </div>
        <div className="mb-4">
          <h4 className="font-bold ml-4 mb-1">Logistics Career Role</h4>
          <Select isMulti options={
            role_data.map(a=>({value:a,label:a}))
            } />
        </div>
        <button onClick={()=>setEditing(false)} className="bg-blue-500 hover:bg-blue-300 font-bold text-white w-fit block rounded-full px-3 py-2 ml-auto">Submit</button>
      </form>
      :<div>
        <div className="mt-8">
          <div className="mb-4">
          <h4 className="font-bold ml-4 mb-1">Full Name</h4>
          <div className="bg-gray-100 px-4 py-2 border-[1px] border-gray-300 rounded-full">Mike Moris</div>
          </div>
          <div className="mb-4">
          <h4 className="font-bold ml-4 mb-1">Logistics Career Role</h4>
          <div className="bg-gray-100 px-4 py-2 border-[1px] border-gray-300 rounded-full">Logistics Analyst or Manager
          </div>
          
          </div>
          <button onClick={()=>setEditing(true)} className="ml-auto w-fit block font-bold bg-blue-500 hover:bg-blue-300 text-white px-3 py-2 rounded-full">Edit Profile</button>
        </div>
        <div className=""></div>
      </div>
     }

     <hr className="mb-4 mt-8"/>
     <h3 className="font-bold text-2xl">Created Posts</h3>

     <div className=" mt-6 mx-4 mb-4 ">
      {thread.filter(a=>a.createdBy==='current').map(a=>({...a,comments:[]})).map((post) => (
        <PostTemplate post={post}/>
      ))}
    </div>

    </div>
  )
}

export default ProfilePage
