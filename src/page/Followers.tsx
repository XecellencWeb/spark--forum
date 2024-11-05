import { UserType } from "../context/authContext"
import { user_list, UserTemplate } from "./UserPage"


const Followers = () => {
  return (
    <div className="max-w-3xl my-4 mx-auto flex flex-col gap-3">
    {user_list.filter(a=>a?.followed?.includes('current'))?.map((user )=><UserTemplate user={user as unknown as UserType}/>)}
  </div>
  )
}

export default Followers
