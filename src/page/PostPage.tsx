import { FaUserCircle } from "react-icons/fa";
import { formatTime } from "../functions/methods";
import { FaRegHeart } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa6";
import { GrLike } from "react-icons/gr";
import { GrDislike } from "react-icons/gr";
import { useState } from "react";
import {
  PostComment,
  PostType,
  useAuth,
  UserContextType,
} from "../context/authContext";
import { Link } from "react-router-dom";

export const thread = [
  {
    id: 1,
    username: "Alice",
    timestamp: "2024-08-05T10:00:00Z",
    content:
      "Hey everyone, just started a new project and wanted to share some updates!",
    createdBy: "current",
    markedFavourite: ["current"],
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
    createdBy: "",
    markedFavourite: [],
    comments: [], // No comments for this post
  },
  {
    id: 3,
    username: "Alice",
    timestamp: "2024-08-05T10:45:00Z",
    content:
      "Sure! It’s a web application designed to help people track their fitness goals. I’ve been working on the UI and backend integration.",
    markedFavourite: [],
    createdBy: "current",
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
    createdBy: "",
    markedFavourite: ["current"],
    comments: [], // No comments for this post
  },
  {
    id: 5,
    username: "Dave",
    timestamp: "2024-08-05T11:15:00Z",
    content: "Sounds exciting! Can’t wait to check it out.",
    createdBy: "",
    markedFavourite: ["current"],
    comments: [], // No comments for this post
  },
];

export const CommentTemplate = ({
  postRef,
  comment,
  isMore,
}: {
  postRef: any;
  comment: PostComment;
  isMore?: boolean;
}) => {
  const { likeComment, dislikeComment }: Partial<UserContextType> = useAuth();
  const [likedComment, setLikedComment] = useState(comment.liked);
  const [dislikedComment, setDislikedComment] = useState(comment.unliked);

  return (
    <div className="flex gap-2 items-start mb-4">
      <FaUserCircle size={50} />{" "}
      <div className="flex flex-col gap-0">
        <h3 className="font-semibold">{comment.username}</h3>
        <span className="text-gray-400">{formatTime(comment.createdAt!)}</span>
        <p className="mt-1">{comment.content}</p>
        <div className="text-slate-500 flex gap-3 mt-2">
          <GrLike
            onClick={async () => {
              setDislikedComment(false);
              setLikedComment((prev) => !prev);
              setLikedComment(
                (await likeComment?.(
                  postRef,
                  comment.id as number
                )) as unknown as boolean
              );
            }}
            color={likedComment ? "#012dff" : "#aaa"}
          />
          <GrDislike
            onClick={async () => {
              setLikedComment(false);
              setDislikedComment((prev) => !prev);
              setDislikedComment(
                (await dislikeComment?.(
                  postRef,
                  comment.id as number
                )) as unknown as boolean
              );
            }}
            color={dislikedComment ? "#012dff" : "#aaa"}
          />
        </div>
        {isMore && <div className="font-bold text-blue-700 ">...</div>}
      </div>
    </div>
  );
};

export const PostTemplate = ({
  post,
  detailsOpened,
}: {
  post: PostType;
  detailsOpened?: boolean;
}) => {
  const {
    likePost,
    dislikePost,
    // likeComment,
    // dislikeComment,
    markPostFavourite,
    followUser,
  }: Partial<UserContextType> = useAuth();
  const [following, setFollowing] = useState(post.following);
  const [likedPost, setLikedPost] = useState(post.liked);
  const [dislikedPost, setdisLikedPost] = useState(post.unliked);
  const [markedFavourite, setMarkedFavourite] = useState(post.markedFavourite);

  const comments = post.comments?.sort(
    (a, b) => (b.id as number) - (a.id as number)
  );

  return (
    <div className="mb-8 max-w-lg mx-auto">
      <div className="flex gap-2 items-center">
        <FaUserCircle size={50} />{" "}
        <div className="flex flex-col gap-0">
          <h3 className="font-semibold">
            {post.username}{" "}
            <button
              onClick={async () => {
                setFollowing((prev) => !prev);
                setFollowing(
                  (await followUser?.(post.createdBy)) as unknown as boolean
                );
              }}
              className="text-blue-600 font-bold"
            >
              {following ? "unfollow" : "follow"}
            </button>
            {/* {post?.comments?.length! > 1 && (
              <button className="text-blue-600 font-bold ml-4 py-2 px-4 border-2 border-gray-200 rounded-full">
                View Conversation
              </button>
            )} */}
          </h3>
          <span className="text-gray-400">{formatTime(post?.createdAt!)}</span>
        </div>
      </div>
      <div className="">
        <p className="">{post.content}</p>
        <div className="text-slate-500 flex gap-3 mt-2">
          <GrLike
            onClick={async () => {
              setdisLikedPost(false);
              setLikedPost((prev) => !prev);
              setLikedPost((await likePost?.(post.ref)) as unknown as boolean);
            }}
            color={likedPost ? "#012dff" : "#aaa"}
          />
          <GrDislike
            onClick={async () => {
              setLikedPost(false);
              setdisLikedPost((prev) => !prev);
              setdisLikedPost(
                (await dislikePost?.(post.ref)) as unknown as boolean
              );
            }}
            color={dislikedPost ? "#012dff" : "#aaa"}
          />
          <Link to={'/post/'+post.id?.toString() as string}>
            {" "}
            <FaRegCommentDots color="#aaa" />
          </Link>
          <FaRegHeart
            color={markedFavourite ? "#012dff" : "#aaa"}
            onClick={async () => {
              setMarkedFavourite((prev) => !prev);
              setMarkedFavourite(
                (await markPostFavourite?.(
                  post.id as number
                )) as unknown as boolean
              );
            }}
          />
        </div>
      </div>

      <div className="pl-4 mt-4">
        <details open={detailsOpened}>
          <summary>
            {comments?.[0] && (
              <CommentTemplate
                postRef={post.ref}
                comment={comments[0]}
                isMore={!!comments[1]}
              />
            )}
          </summary>
          {comments?.slice(1)?.map((comment) => (
            <CommentTemplate postRef={post.ref} comment={comment} />
          ))}
        </details>
      </div>
    </div>
  );
};

const PostPage = () => {
  const { posts }: Partial<UserContextType> = useAuth();
  return (
    <div className="max-w-lg my-4 mx-auto">
      {posts?.map((post) => (
        <PostTemplate post={post} />
      ))}
    </div>
  );
};

export default PostPage;
