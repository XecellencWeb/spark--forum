import { PostType } from "../context/authContext"
import { PostTemplate, thread } from "./PostPage"


const FavoritePage = () => {
  return (
    <div className="max-w-3xl mt-6 mx-auto px-4 mb-4 ">
      {thread.filter(a=>a.markedFavourite.includes('current')).map(a=>({...a,comments:[]})).map((post) => (
        <PostTemplate post={post as unknown as PostType}/>
      ))}
    </div>
  )
}

export default FavoritePage
