import { FaUserCircle } from "react-icons/fa"


const ProfilePage = () => {
  
    

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex gap-x-3 gap-y-1 items-center flex-wrap">
      <FaUserCircle size={100} /> <button className="bg-blue-500 hover:bg-blue-300 font-bold px-3 py-2 rounded-full text-white">Change Picture</button><button className="text-red-600 py-2 font-bold">Delete Picture</button>
      </div>


    </div>
  )
}

export default ProfilePage
