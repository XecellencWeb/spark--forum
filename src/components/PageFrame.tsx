import React from "react";
import { PostTemplate } from "../page/PostPage";
import {  useAuth, UserContextType } from "../context/authContext";

const TrendingPost = () => {
  const { latestPPost }: Partial<UserContextType> = useAuth();
  return (
    <div className=" mt-6 mx-4 mb-4 ">
      {latestPPost
        ?.map((a) => ({ ...a, comments: [] }))
        .map((post) => (
          <PostTemplate post={post} />
        ))}
    </div>
  );
};



const PageFrame = ({ heading, Page }: { heading: string; Page: React.FC }) => {
  return (
    <div className="flex flex-wrap gap-12  p-8 page-frame">
      <div className="basis-[50rem] grow">
        <div className="flex justify-between flex-wrap border-b-2 border-blue-100 pb-4 px-4">
          <h2 className="font-bold lg:text-3xl text-2xl max-w-2xl w-full mx-auto flex">
            {heading}
          </h2>
          
        </div>
        <div className="mx-2 py-4 page-content">
          <Page />
        </div>
      </div>
      <div className="shrink basis-[20rem] grow">
        <div className="sticky top-8">
          <div className="rounded-[2rem] border-2 border-blue-50 shadow-lg shadow-blue-950/20 p-4 bg-blue-50 page-content">
            <h3 className=" text-2xl lg:text-3xl">Latest News</h3>
            <TrendingPost />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageFrame;
