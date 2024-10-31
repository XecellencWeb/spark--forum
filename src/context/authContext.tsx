import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { auth, db } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import toast from "react-hot-toast";
import Following from "../page/Following";

const UserContext = createContext({});

export type NoticeType = {
  seen?: string[];
  message: string;
  type: "USER" | "POST";
  noticeFor?: string[];
};

export type UserType = {
  email: string;
  password: string;
  followers: { status: "ACCEPTED" | "PENDING"; email: string }[];
};

export type LoginType = {
  email: string;
  password: string;
};

export type UserContextType = {
  currentUser: UserType | undefined;
  loginUser: (user: LoginType) => void;
  signUpUser: (user: UserType) => void;
  allUsers: UserType[];
  getAllUsers: () => void;
};

const AuthContext = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserType>();
  const [followers, setFollowers] = useState<any>();
  const [allUsers, setAllUsers] = useState<any>([]);
  const [notices, setNotices] = useState<NoticeType[]>([]);
  const noticeRef = useRef<any>();

  //post funcs

  //notifications func
  const createNewNotice = async ({
    message,
    type,
    noticeFor,
  }: {
    message: string;
    type: "USER" | "POST";
    noticeFor?: string[];
  }) => {
    try {
      await addDoc(collection(db, "notifications"), {
        seen: [auth.currentUser?.email],
        type,
        message,
        noticeFor,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getNotice = async () => {
    clearTimeout(noticeRef.current);
    try {
      const ss = await getDocs(collection(db, "notifications"));

      ss.forEach(async (s) => {
        const notice = s.data();
        if (notice.seen?.includes(auth.currentUser?.email as string)) return;
        if (notice.noticeFor) {
          if (!notice.noticeFor.includes(auth.currentUser?.email as string)) {
            return;
          }
        }

        await updateDoc(s.ref, {
          seen: [...notice.seen, auth.currentUser?.email],
        });

        delete notice.seen;
        delete notice.noticeFor;

        toast.success("Hi, incoming notification");
        setNotices((prev: any) => [...prev, notice]);

        if (notice.type == "USER") {
          updateCurrentUser(auth.currentUser?.email as string);
          getAllUsers();
        }

        noticeRef.current = setTimeout(getNotice, 200);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //user funcs

  const signUpUser = async (user: UserType) => {
    try {
      if (!auth.currentUser)
        await createUserWithEmailAndPassword(auth, user.email, user.password);
      const userExist = await getDocs(
        query(collection(db, "users"), where("email", "==", user.email))
      );
      if (!userExist.empty) await addDoc(collection(db, "users"), user);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCurrentUser = async (email: string) => {
    try {
      const snapshots = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );

      if (snapshots.empty) toast.error("No user exist with this email");

      let loginUser;
      snapshots.forEach((s) => {
        loginUser = s.data();
      });

      toast.success("Log in successfull");
      setCurrentUser(loginUser);
      await getAllFollowingUser();
    } catch (error) {
      console.log(error);
    }
  };

  const loginUser = async (user: LoginType) => {
    try {
      await signInWithEmailAndPassword(auth, user.email, user.password);
      updateCurrentUser(user.email);
    } catch (error) {
      console.log(error);
    }
  };

  const followUser = async (email: string) => {
    try {
      if (!auth.currentUser)
        return toast.error("You must be logged in to follow user");

      const snapshots = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );

      snapshots.forEach(async (s) => {
        await updateDoc(s.ref, {
          followers: s.data().following
            ? [
                ...s.data().following,
                { status: "PENDING", email: auth.currentUser?.email },
              ]
            : [{ status: "PENDING", email: auth.currentUser?.email }],
        });

        await createNewNotice({
          message: `${auth.currentUser?.email} sent you a follow request`,
          type: "USER",
          noticeFor: [email],
        });
        toast.success(`Now following ${email}`);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllFollowingUser = async () => {
    try {
      const currentUserSnapshot = await getDocs(
        query(
          collection(db, "users"),
          where("email", "==", auth.currentUser?.email)
        )
      );

      currentUserSnapshot.forEach(async (s) => {
        const followers = s.data().followers;
        const acceptedfollowers: string[] = followers
          .filter((a: any) => a.status == "ACCEPTED")
          .map((a: any) => a.email);

        const followersSnapshot = await getDocs(
          query(
            collection(db, "users"),
            where("email", "in", acceptedfollowers)
          )
        );

        followersSnapshot.forEach((f) =>
          setFollowers((prev: any) => [...prev, f.data()])
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  const unFollowUser = async (email: string) => {
    try {
      const userToUnfollow = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );

      userToUnfollow.forEach(async (s) => {
        const newFollowers = s
          .data()
          .followers.filter((a: any) => a.email !== auth.currentUser?.email);

        await updateDoc(s.ref, {
          followers: newFollowers,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  //accept follow request
  const acceptFollowRequest = async (email: string)=>{
    try {
      const accepterProfile = await getDocs(query(collection(db, 'users')))
    } catch (error) {
      console.log(error);
      
    }
  }

  //decline pending request

  //cancel pending request

  const getAllUsers = async () => {
    try {
      const snapshots = await getDocs(collection(db, "users"));
      const allUsers: any[] = [];

      snapshots.forEach((s) => allUsers.push(s.data()));
      setAllUsers(allUsers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const contextProps: UserContextType = {
    currentUser,
    loginUser,
    signUpUser,
    allUsers,
    getAllUsers,
  };

  return (
    <UserContext.Provider value={contextProps}>{children}</UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);

export default AuthContext;
