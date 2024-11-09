import React, { useEffect, useRef, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth, UserContextType, UserType } from "../context/authContext";
import { PostTemplate } from "./PostPage";
import { useLocation } from "react-router-dom";

const FriendProfile = () => {
  const { getUser, posts }: Partial<UserContextType> = useAuth();

  const [friend, setFriend] = useState<UserType>();
  const callOnce = useRef(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (callOnce.current) {
      (async () => {
        setFriend(
          (await getUser?.(pathname.split("/")[2] + "@")) as unknown as UserType
        );
      })();
    }

    return () => {
      callOnce.current = true;
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex gap-x-3 gap-y-1 items-center flex-wrap">
        <FaUserCircle size={100} />{" "}
      </div>

      <div>
        <div className="mt-8">
          <div className="mb-4">
            <h4 className="font-bold ml-4 mb-1">Full Name</h4>
            <div className="bg-gray-100 px-4 py-2 border-[1px] border-gray-300 rounded-full">
              {friend?.username}
            </div>
          </div>
          <div className="mb-4">
            <h4 className="font-bold ml-4 mb-1">Logistics Career Role</h4>
            <div className="bg-gray-100 px-4 py-2 border-[1px] border-gray-300 rounded-full">
              {friend?.role}
            </div>
          </div>
          {!!friend?.aboutUser && (
            <div className="mb-4">
              <h4 className="font-bold ml-4 mb-1">About You</h4>
              <div className="bg-gray-100 px-4 py-2 border-[1px] border-gray-300 rounded-full">
                {friend?.aboutUser}
              </div>
            </div>
          )}
        </div>
        <div className=""></div>
      </div>

      <hr className="mb-4 mt-8" />
      <h3 className="font-bold text-2xl">Created Posts</h3>

      <div className=" mt-6 mx-4 mb-4 ">
        {!posts?.length && (
          <p className="text-gray-600">User has not created any post yet</p>
        )}
        {posts
          ?.filter((a) => a.createdBy === friend?.email)
          .map((a) => ({ ...a, comments: [] }))
          .map((post) => (
            <PostTemplate post={post} />
          ))}
      </div>
    </div>
  );
};

export default FriendProfile;
