import { FaUserCircle } from "react-icons/fa";
import { formatTime } from "../functions/methods";
import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa6";
import { GrLike } from "react-icons/gr";
import { GrDislike } from "react-icons/gr";
import { useState } from "react";




export const thread = [
  {
    id: 1,
    username: "Alice",
    timestamp: "2024-08-05T10:00:00Z",
    content:
      "Hey everyone, just started a new project and wanted to share some updates!",
    createdBy:'current',
    markedFavourite:['current'],
    comments: [
      {
        id: 1,
        username: "Bob",
        timestamp: "2024-08-05T10:15:00Z",
        content:
          "That sounds great, Alice! Can you tell us more about what you’re working on?",
      },
      {
        id: 2,
        username: "Carol",
        timestamp: "2024-08-05T10:45:00Z",
        content:
          "Sounds impressive! Do you have any screenshots or a demo that we could check out?",
      },
    ],
  },
  {
    id: 2,
    username: "Bob",
    timestamp: "2024-08-05T10:30:00Z",
    content:
      "I think it’s going to be a fantastic tool. Looking forward to seeing more updates!",
     createdBy:'',
     markedFavourite:[],
    comments: [], // No comments for this post
  },
  {
    id: 3,
    username: "Alice",
    timestamp: "2024-08-05T10:45:00Z",
    content:
      "Sure! It’s a web application designed to help people track their fitness goals. I’ve been working on the UI and backend integration.",
      markedFavourite:[],
      createdBy:'current',
    comments: [
      {
        id: 3,
        username: "Dave",
        timestamp: "2024-08-05T11:15:00Z",
        content:
          "I’d love to see it! If you need any help with testing or feedback, feel free to ask.",
      },
    ],
  },
  {
    id: 4,
    username: "Alice",
    timestamp: "2024-08-05T11:00:00Z",
    content:
      "Yes, I have a prototype ready. I’ll share the link with everyone once it’s polished a bit more.",
      createdBy:'',
      markedFavourite:['current'],
    comments: [], // No comments for this post
  },
  {
    id: 5,
    username: "Dave",
    timestamp: "2024-08-05T11:15:00Z",
    content: "Sounds exciting! Can’t wait to check it out.",
    createdBy:'',
    markedFavourite:['current'],
    comments: [], // No comments for this post
  },
];

type PostComment = {
  id:number,
  username: string,
  timestamp: string,
  content: string,
}

export type PostType = {
  id:number,
  username: string,
  timestamp: string,
  content: string,
  createdBy: string,
  markedFavourite: string[],
  comments: PostComment[]
}

export const PostTemplate = ({post}:{
  post:PostType
})=>{

  const [following,setFollowing] = useState(false)
 
 
 
 return <div className="mb-8">
  <div className="flex gap-2 items-center">
    <FaUserCircle size={50} />{" "}
    <div className="flex flex-col gap-0">
      <h3 className="font-semibold">{post.username} {following?<button onClick={()=>setFollowing(false)}className="ml-2 text-blue-600 font-bold ">Unfollow</button>:<button onClick={()=>setFollowing(true)}
      className="ml-2 text-blue-600 font-bold">Follow</button>}
      
      {post.comments.length > 1 && <button className="text-blue-600 font-bold ml-4 py-2 px-4 border-2 border-gray-200 rounded-full">View Conversation</button> }
      
      </h3>
      <span className="text-gray-400">
        {formatTime(post.timestamp)}
      </span>
    </div>
  </div>
  <div className="">
    <p className="">{post.content}</p>
    <div className="text-slate-500 flex gap-3 mt-2">
      <GrLike />
      <GrDislike />
      <FaRegCommentDots />
      <FaRegHeart />
    </div>
  </div>

  <div className="pl-4 mt-4">
    <details>
      <summary>
      {post.comments[0] && <div className="flex gap-2 items-start mb-4">
        <FaUserCircle size={50} />{" "}
    <div className="flex flex-col gap-0">
      <h3 className="font-semibold">{post.comments[0].username}</h3>
      <span className="text-gray-400">
        {formatTime(post.comments[0].timestamp)}
      </span>
      <p className="mt-1">
        {post.comments[0].content}
      </p>
      <div className="text-slate-500 flex gap-3 mt-2">
      <GrLike />
      <GrDislike />
    </div>
    {post.comments[1] && <div className="font-bold text-blue-700 ">...</div>}
    </div>
    </div>}
      </summary>
  {post.comments.slice(1)?.map((comment)=>(
    <div className="flex gap-2 items-start mb-4">
        <FaUserCircle size={50} />{" "}
    <div className="flex flex-col gap-0">
      <h3 className="font-semibold">{comment.username}</h3>
      <span className="text-gray-400">
        {formatTime(comment.timestamp)}
      </span>
      <p className="mt-1">
        {comment.content}
      </p>
      <div className="text-slate-500 flex gap-3 mt-2">
      <GrLike />
      <GrDislike />
    </div>
    </div>
    </div>
  ))}
  </details>
  </div>
</div>
}

const PostPage = () => {
  return (
    <div className="max-w-3xl my-4 mx-auto">
      {thread.map((post) => (
        <PostTemplate post={post}/>
      ))}
    </div>
  );
};

export default PostPage;
