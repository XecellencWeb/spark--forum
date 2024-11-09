import {
  HtmlHTMLAttributes,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  useEffect,
  useState,
} from "react";
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

export const UserTemplate = ({
  user,
  pendingFollower,
}: {
  user: UserType;
  pendingFollower?: boolean;
}) => {
  const {
    followUser,
    acceptFollowRequest,
    declinePendingRequest,
  }: Partial<UserContextType> = useAuth();
  const [following, setFollowing] = useState(
    !!auth.currentUser &&
      !!user.followers?.find((a) => a.email == auth.currentUser?.email)
  );

  const [acceptRequest, setAcceptedRequest] = useState(false);
  const [declineRequest, setDeclineedRequest] = useState(false);

  return (
    <div className="flex flex-wrap gap-2 items-center border-2 rounded-full p-4 border-blue-200">
      <FaUserCircle size={50} />
      <div className="flex flex-col gap-0 basis-[10rem] shrink">
        <h3 className="font-semibold">{user.username}</h3>
        <span className="text-gray-400">{user.role}</span>
      </div>
      <div className="flex min-w-40 ml-auto gap-5">
        {pendingFollower ? (
          <div className="flex gap-2 items-center">
            <button
              onClick={async () => {
                setAcceptedRequest(true);
                await acceptFollowRequest?.(user.email);
                setAcceptedRequest(false);
              }}
              className="text-green-600 font-bold "
            >
              {acceptRequest ? "..." : "Accept Request"}
            </button>
            <button
              onClick={async () => {
                setDeclineedRequest(true);
                await declinePendingRequest?.(user.email);
                setDeclineedRequest(false);
              }}
              className="text-red-600 font-bold"
            >
              {declineRequest ? "..." : "Decline Request"}
            </button>
          </div>
        ) : (
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
        )}

        <div className="flex gap-1 items-center text-gray-500 font-semibold">
          <FaUserCircle size={20} />
          <Link to={`/profile/${user.email.split("@")[0]}`}>Profile</Link>
        </div>
      </div>
    </div>
  );
};

const Searcher = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      type="search"
      placeholder="Search users..."
      className="px-4 py-2 rounded-full max-w-72 w-full border-2 border-gray-300"
      {...props}
    />
  );
};

const UserPage = () => {
  const { allUsers, getAllUsers }: Partial<UserContextType> = useAuth();

  const [users, setUsers] = useState(allUsers);

  useEffect(() => {
    getAllUsers && getAllUsers();
  }, []);

  const searchUsers = (word: string) => {
    setUsers(
      allUsers?.filter(
        (a) =>
          a.email.toLowerCase().includes(word.toLowerCase()) ||
          a.username.toLowerCase().includes(word.toLowerCase()) ||
          a.role.toLowerCase().includes(word.toLowerCase()) ||
          a.aboutUser?.toLowerCase()?.includes(word.toLowerCase())
      )
    );
  };

  return (
    <div className="max-w-3xl my-4 mx-auto flex flex-col gap-3">
      <Searcher
        onChange={(e) => {
          setTimeout(() => {
            searchUsers(e.target.value);
          }, 500);
        }}
      />
      {users?.map((user: UserType, i: number) => (
        <UserTemplate key={i} user={user} />
      ))}
    </div>
  );
};

export default UserPage;
