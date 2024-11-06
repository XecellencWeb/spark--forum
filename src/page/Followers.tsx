import { useAuth, UserContextType, UserType } from "../context/authContext";
import { UserTemplate } from "./UserPage";

const Followers = () => {
  const { followers, pendingFollowers }: Partial<UserContextType> = useAuth();
  return (
    <div className="max-w-3xl my-4 mx-auto flex flex-col gap-3">
      <h4>Accepted Follwers</h4>
      {followers?.map((user) => (
        <UserTemplate user={user as unknown as UserType} />
      ))}
      
      <h4>Pending Follwers</h4>
      {pendingFollowers?.map((user) => (
        <UserTemplate user={user as unknown as UserType} />
      ))}
    </div>
  );
};

export default Followers;
