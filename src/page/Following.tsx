import { user_list, UserTemplate, UserType } from "./UserPage"


const Following = () => {
  return (
   <div className="max-w-3xl my-4 mx-auto flex flex-col gap-3">
    {user_list.filter(a=>a.following)?.map((user:UserType)=><UserTemplate user={user}/>)}
  </div>
  )
}

export default Following
