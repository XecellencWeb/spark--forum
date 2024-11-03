import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth, UserContextType, UserType } from "../context/authContext";
import { auth } from "../firebase/config";

export const user_list = [
  {
    name: "Alice Johnson",
    role: "Project Manager",
    following: true,
    followed: ["current"],
  },
  {
    name: "Bob Smith",
    role: "Software Engineer",
    following: false,
  },
  {
    name: "Charlie Brown",
    role: "UX Designer",
    following: true,
  },
  {
    name: "Diana Greene",
    role: "Marketing Specialist",
    following: false,
  },
  {
    name: "Edward White",
    role: "Data Analyst",
    following: true,
    followed: ["current"],
  },
];

// export type UserType = {
//   name: string;
//   role: string;
//   following: boolean;
//   followed?: string[];
// };

export const UserTemplate = ({ user }: { user: UserType }) => {
  const { followUser }: Partial<UserContextType> = useAuth();
  const [following, setFollowing] = useState(
    !!auth.currentUser &&
      !!user.followers?.find((a) => a.email == auth.currentUser?.email)
  );

  return (
    <div className="flex flex-wrap gap-2 items-center border-2 rounded-full p-4 border-blue-200">
      <FaUserCircle size={50} />
      <div className="flex flex-col gap-0 basis-[10rem] shrink">
        <h3 className="font-semibold">{user.username}</h3>
        <span className="text-gray-400">{user.role}</span>
      </div>
      <div className="flex min-w-40 ml-auto gap-5">
        <button
          onClick={async () => {
            setFollowing((prev) => !prev);
            setFollowing(
              (await followUser?.(user.email)) as unknown as boolean
            );
          }}
          className="text-blue-600 font-bold"
        >
          {following ? "unfollow" : "follow"}
        </button>

        <div className="flex gap-1 items-center text-gray-500 font-semibold">
          <FaUserCircle size={20} />
          <Link to="/profile">Profile</Link>
        </div>
      </div>
    </div>
  );
};

const UserPage = () => {
  const { allUsers, getAllUsers }: Partial<UserContextType> = useAuth();

  useEffect(() => {
    getAllUsers && getAllUsers();
  }, []);

  return (
    <div className="max-w-3xl my-4 mx-auto flex flex-col gap-3">
      {allUsers?.map((user: UserType, i: number) => (
        <UserTemplate key={i} user={user} />
      ))}
    </div>
  );
};

export default UserPage;
