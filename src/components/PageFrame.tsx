import React from "react";

const PageFrame = ({ heading, Page }: { heading: string; Page: React.FC }) => {
  return (
    <div className="page-frame p-4">
      <h2 className="font-bold lg:text-3xl text-2xl border-b-2 border-gray-200 pl-2 py-4">{heading}</h2>
      <div className="mx-2 py-4">
      <Page/>
      </div>
    </div>
  );
};

export default PageFrame;
