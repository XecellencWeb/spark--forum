import { user_list, UserTemplate, UserType } from "./UserPage"


const Followers = () => {
  return (
    <div className="max-w-3xl my-4 mx-auto flex flex-col gap-3">
    {user_list.filter(a=>a?.followed?.includes('current'))?.map((user:UserType)=><UserTemplate user={user}/>)}
  </div>
  )
}

export default Followers
