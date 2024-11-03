import React from "react";
import { PostTemplate, thread } from "../page/PostPage";


const TrendingPost = ()=>{
  return <div className=" mt-6 mx-4 mb-4 ">
  {thread.filter(a=>a.createdBy==='current').map(a=>({...a,comments:[]})).map((post) => (
    <PostTemplate post={post}/>
  ))}
</div>
}

const Searcher = ()=>{
  return <input type="search" placeholder="Search users..." className="px-4 py-2 rounded-full max-w-72 w-full border-2 border-gray-300" />
}

const PageFrame = ({ heading, Page }: { heading: string; Page: React.FC }) => {
  return (
    <div className="flex flex-wrap gap-12  p-8 page-frame">
      <div className="basis-[50rem] grow">
        <div className="flex justify-between flex-wrap border-b-2 border-blue-100 pb-4 px-4">
      <h2 className="font-bold lg:text-3xl text-2xl max-w-2xl w-full mx-auto flex">
        {heading}
      </h2>
      {heading.toLowerCase() === 'users' && <Searcher/>}
      </div>
      <div className="mx-2 py-4 page-content">
        <Page />
      </div>
      </div>
      <div className="shrink basis-[20rem] grow">
        <div className="sticky top-8">
          <div className="rounded-[2rem] border-2 border-blue-50 shadow-lg shadow-blue-950/20 p-4 bg-blue-50 page-content">
        <h3 className=" text-2xl lg:text-3xl">Trending Posts</h3>
        <TrendingPost/>
        </div>
        </div>     
      </div>
    </div>
  );
};

export default PageFrame;
