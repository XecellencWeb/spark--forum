import { useAuth, UserContextType, UserType } from "../context/authContext";
import { UserTemplate } from "./UserPage";

const Following = () => {
  const { following }: Partial<UserContextType> = useAuth();
  return (
    <div className="max-w-3xl my-4 mx-auto flex flex-col gap-3">
      {following?.map((user: UserType) => (
        <UserTemplate user={user} />
      ))}
    </div>
  );
};

export default Following;
