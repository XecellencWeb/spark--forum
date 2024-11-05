import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { PostType, useAuth, UserContextType } from "../context/authContext";
import { PostTemplate } from "./PostPage";

const SinglePagePostPage = () => {
  const { getAPost, commentOnPost, currentUser }: Partial<UserContextType> =
    useAuth();
  const { pathname } = useLocation();
  const [post, setPost] = useState<PostType>();
  const searchOnce = useRef(false);
  const [comment, setComment] = useState("");
  const [commentting, setCommentting] = useState(false);

  console.log(post);

  const getPost = async () => {
    setPost((await getAPost?.(+pathname.split("/")[2])) as unknown as PostType);
  };

  useEffect(() => {
    if (searchOnce.current) {
      getPost();
    }

    return () => {
      searchOnce.current = true;
    };
  }, []);

  return (
    post && (
      <div className="max-w-2xl my-4 mx-auto">
        <div className="h-96 mb-8 overflow-y-auto">
          <PostTemplate post={post as PostType} detailsOpened />
        </div>
        <div className="flex max-w-[35rem] mx-auto flex-wrap items-start gap-2">
          <textarea
            onChange={(e) => setComment(e.target.value)}
            name=""
            id=""
            className="border-2 border-gray-300 max-w-96 w-full h-32 rounded-md p-4"
          ></textarea>
          <button
            onClick={async () => {
              setCommentting(true);
              await commentOnPost?.(post.ref, {
                content: comment,
                username: currentUser?.username as string,
                createdAt: Date.now() as unknown as string,
              });
              await getPost();
              setCommentting(false);
            }}
            className="bg-blue-600 p-4 rounded-lg text-white hover:bg-blue-700"
          >
            {commentting ? "Commentting" : "Comment"}
          </button>
        </div>
      </div>
    )
  );
};

export default SinglePagePostPage;
