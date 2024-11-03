import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { PostType, useAuth, UserContextType } from "../context/authContext";
import { PostTemplate } from "./PostPage";

const SinglePagePostPage = () => {
  const { getAPost }: Partial<UserContextType> = useAuth();
  const { pathname } = useLocation();
  const [post, setPost] = useState<PostType>();
  const searchOnce = useRef(false);

  console.log(post);

  useEffect(() => {
    if (searchOnce.current) {
      (async () => {
        setPost(
          (await getAPost?.(+pathname.split("/")[2])) as unknown as PostType
        );
      })();
    }

    return () => {
      searchOnce.current = true;
    };
  }, []);

  return (
    post && (
      <div className="max-w-lg my-4 mx-auto">
        <PostTemplate post={post as PostType} />
      </div>
    )
  );
};

export default SinglePagePostPage;
