import { useState } from "react";
import { useAuth, UserContextType } from "../context/authContext";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

const AddPage = () => {
  const navigate = useNavigate();
  const { currentUser, createPost }: Partial<UserContextType> = useAuth();
  const [postMessage, setPostMessage] = useState("");
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setCreating(true);
        const postCreated = await createPost?.({
          content: postMessage,
          tagNames: tagNames,
          createdBy: auth.currentUser?.email as string,
          username: currentUser?.username as string,
        });
        setCreating(false);

        if (!!postCreated) {
          navigate("/post");
        }
      }}
      className="max-w-4xl mt-8 mx-auto px-4"
      action=""
    >
      <label htmlFor="post">
        <h3 className="font-semibold">Enter your post here</h3>
        <textarea
          onChange={(e) => setPostMessage(e.target.value)}
          className="w-full border-2 rounded-lg p-4 mt-2 border-blue-200 focus:border-blue-950 outline-none"
          name="post"
          placeholder="Enter a productive tech idea, update or methodology..."
        ></textarea>
      </label>
      <label htmlFor="tag-name">
        <h3 className="font-bold mt-4">Tag name</h3>
        <input
          type="text"
          name=""
          onChange={(e) => setTagNames(e.target.value.split(", "))}
          id=""
          className="rounded-lg border-2 border-blue-200 focus:border-blue-950 outline-none w-full p-4 "
          placeholder="Enter tag name related to post..."
        />
      </label>
      <button className="w-full rounded-full bg-blue-600 mt-8 hover:bg-blue-800 py-2 text-white text-center">
        {creating ? "Creating Post..." : "Creat Post"}
      </button>
    </form>
  );
};

export default AddPage;
