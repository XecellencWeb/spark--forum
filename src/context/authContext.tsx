import {
  addDoc,
  collection,
  DocumentData,
  getDoc,
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

export type PostType = {
  name: string;
  message: string;
  // comments:
};

export type PostCreate = {
  post: string;
  username: string;
  email: string;
  tags: string[];
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
  //users functions
  currentUser: UserType | undefined;
  loginUser: (user: LoginType) => void;
  signUpUser: (user: UserType) => void;
  allUsers: UserType[];
  getAllUsers: () => void;
  followUser: (email: string) => void;
  unFollowUser: (email: string) => void;
  acceptFollowRequest: (email: string) => void;
  declinePendingRequest: (email: string) => void;
  cancelPendingRequest: (email: string) => void;

  //post functions
  createPost: (post: PostCreate) => void;
  commentOnPost: (postref: any, comment: any) => void;
  likePost: (postref: any) => void;
  dislikePost: (postref: any) => void;
  likeComment: (postref: any, commentId: number) => void;
  dislikeComment: (postref: any, commentId: number) => void;
  markPostFavourite: (postId: number) => void;
  posts: PostType[];
  followers: UserType[];
  notices: any[];
};

//like query
const like = (post: any) => {
  let likedBy;
  let dislikedBy;

  if (post.dislikedBy) {
    if (post.dislikedBy.includes(auth.currentUser?.email)) {
      dislikedBy = post.dislikedBy.filter(
        (a: any) => a !== auth.currentUser?.email
      );
    } else {
      dislikedBy = post.dislikedBy;
    }
  }

  if (post.likedBy) {
    if (post.likedBy.includes(auth.currentUser?.email)) {
      likedBy = post.likedBy.filter((a: any) => a !== auth.currentUser?.email);
    } else {
      likedBy = [...post.likedBy, auth.currentUser?.email];
    }
  } else {
    likedBy = [auth.currentUser?.email];
  }

  return { likedBy, dislikedBy };
};

const dislike = (post: any) => {
  let likedBy;
  let dislikedBy;
  if (post.likedBy) {
    if (post.likedBy.includes(auth.currentUser?.email)) {
      likedBy = post.likedBy.filter((a: any) => a !== auth.currentUser?.email);
    } else {
      likedBy = post.likedBy;
    }
  }

  if (post.dislikedBy) {
    if (post.dislikedBy.includes(auth.currentUser?.email)) {
      dislikedBy = post.dislikedBy.filter(
        (a: any) => a !== auth.currentUser?.email
      );
    } else {
      dislikedBy = [...post.dislikedBy, auth.currentUser?.email];
    }
  } else {
    dislikedBy = [auth.currentUser?.email];
  }

  return { likedBy, dislikedBy };
};

const AuthContext = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserType>();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [followers, setFollowers] = useState<any>();
  const [allUsers, setAllUsers] = useState<any>([]);
  const [notices, setNotices] = useState<NoticeType[]>([]);
  const noticeRef = useRef<any>();

  //post funcs

  //create post
  const createPost = async (postCreate: PostCreate) => {
    try {
      const posts = (await getDocs(collection(db, "posts"))).docs.map((a) =>
        a.data()
      );
      let id;
      if (posts.length) {
        const sorted = posts.sort((a, b) => b.id - a.id);
        id = sorted[0].id + 1;
      } else {
        id = 1;
      }

      await addDoc(collection(db, "posts"), {
        id,
        ...postCreate,
        createdAt: Date.now(),
      });

      createNewNotice({
        message: `${auth.currentUser?.displayName} just created a new post`,
        type: "POST",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //get all post
  const getAllPosts = async () => {
    try {
      const allPosts = await getDocs(collection(db, "posts"));

      allPosts.forEach((s) => {
        setPosts((prev: any) => [
          ...prev,
          { id: s.id, ref: s.ref, ...s.data() },
        ]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //comment to post
  const commentOnPost = async (
    ref: any,
    comment: { message: string; name: string }
  ) => {
    try {
      const post: any = (await getDoc(ref)).data();
      const existingComments = post.comments;
      let comments;
      if (!existingComments) {
        comments = [{ id: 1, ...comment }];
      } else {
        const sortedComments = existingComments.sort(
          (a: any, b: any) => b.id - a.id
        );

        comments = [
          ...existingComments,
          {
            id: sortedComments[0].id + 1,
            ...comment,
          },
        ];
      }

      await updateDoc(ref, {
        comments: comments,
      });

      await createNewNotice({
        message: `${auth.currentUser?.displayName} commented on your post`,
        type: "POST",
        noticeFor: [post.data().email],
      });
    } catch (error) {
      console.log(error);
    }
  };

  //like a post
  const likePost = async (ref: any) => {
    try {
      const post: any = await getDoc(ref);

      const liked = like(post);

      await updateDoc(ref, {
        likedBy: liked.likedBy,
        dislikedBy: liked.dislikedBy,
      });

      await createNewNotice({
        message: `${auth.currentUser?.displayName} liked on your post`,
        type: "POST",
        noticeFor: [post.data().email],
      });
    } catch (error) {
      console.log(error);
    }
  };
  //dislike a post
  const dislikePost = async (ref: any) => {
    try {
      const post: any = (await getDoc(ref)).data();

      const disliked = dislike(post);
      await updateDoc(ref, {
        likedBy: disliked.likedBy,
        dislikedBy: disliked.dislikedBy,
      });

      await createNewNotice({
        message: `${auth.currentUser?.displayName} liked on your post`,
        type: "POST",
        noticeFor: [post.data().email],
      });
    } catch (error) {
      console.log(error);
    }
  };

  //like a comment
  const likeComment = async (postRef: any, commentId: any) => {
    try {
      const post: any = (await getDoc(postRef)).data();
      const comment = post.comments.find((a: any) => a.id === commentId);

      const liked = like(comment);

      await updateDoc(postRef, {
        comments: post.comments.map((a: any) => {
          if (a.id === commentId) {
            return {
              ...a,
              likedBy: liked.likedBy,
              dislikedBy: liked.dislikedBy,
            };
          }

          return a;
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  //dislike a comment
  const dislikeComment = async (postRef: any, commentId: any) => {
    try {
      const post: any = (await getDoc(postRef)).data();
      const comment = post.comments.find((a: any) => a.id === commentId);

      const disliked = dislike(comment);

      await updateDoc(postRef, {
        comments: post.comments.map((a: any) => {
          if (a.id === commentId) {
            return {
              ...a,
              likedBy: disliked.likedBy,
              dislikedBy: disliked.dislikedBy,
            };
          }

          return a;
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  //mark post as favourite
  const markPostFavourite = async (postId: number) => {
    try {
      const user = (
        await getDocs(
          query(
            collection(db, "users"),
            where("email", "==", auth.currentUser?.email)
          )
        )
      ).docs;

      const favouritePosts = user[0].data().favouritePosts as
        | number[]
        | undefined;

      let newFavouritePosts;

      if (favouritePosts)
        if (favouritePosts?.includes(postId))
          newFavouritePosts = favouritePosts.filter((a) => a !== postId);
        else newFavouritePosts = [...favouritePosts, postId];
      else newFavouritePosts = [postId];

      await updateDoc(user[0].ref, { favouritePosts: newFavouritePosts });
    } catch (error) {
      console.log(error);
    }
  };

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
      const user = (
        await getDocs(
          query(
            collection(db, "users"),
            where("email", "==", auth.currentUser?.email)
          )
        )
      ).docs;
      await addDoc(collection(db, "notifications"), {
        seen: [auth.currentUser?.email],
        type,
        message,
        noticeFor: noticeFor || user[0].data().followers || [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  //get notification
  const getNotice = async () => {
    if (!auth.currentUser) return;
    clearTimeout(noticeRef.current);
    try {
      const ss = await getDocs(collection(db, "notifications"));

      ss.forEach(async (s) => {
        const notice = s.data();
        if (notice.seen?.includes(auth.currentUser?.email as string)) return;

        if (!notice.noticeFor.includes(auth.currentUser?.email as string)) {
          return;
        }

        await updateDoc(s.ref, {
          seen: [...notice.seen, auth.currentUser?.email],
        });

        delete notice.seen;
        delete notice.noticeFor;

        setNotices((prev: any) => [...prev, notice]);

        if (notice.type == "USER") {
          await updateCurrentUser(auth.currentUser?.email as string);
          await getAllUsers();
        } else {
          await getAllPosts();
        }

        toast.success("Hi, incoming notification");

        noticeRef.current = setTimeout(getNotice, 200);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //user funcs

  //create user
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

  //update current user
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

  //login user
  const loginUser = async (user: LoginType) => {
    try {
      await signInWithEmailAndPassword(auth, user.email, user.password);
      updateCurrentUser(user.email);
    } catch (error) {
      console.log(error);
    }
  };

  //follow user
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

  //get all  following users
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

  //unfollow a user
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
  const acceptFollowRequest = async (email: string) => {
    try {
      const accepterProfile = await getDocs(
        query(
          collection(db, "users"),
          where("email", "==", auth.currentUser?.email)
        )
      );

      accepterProfile.forEach(async (s) => {
        const acceptRequest = s.data().followers.map((a: any) => {
          if (a.email == email) {
            a.status == "ACCEPTED";
          }

          return a;
        });

        await updateDoc(s.ref, {
          followers: acceptRequest,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  //decline pending request

  const declinePendingRequest = async (email: string) => {
    try {
      const currentUser = await getDocs(
        query(
          collection(db, "users"),
          where("email", "==", auth.currentUser?.email)
        )
      );

      currentUser.forEach(async (s) => {
        const newFollowers = s
          .data()
          .followers.filter((a: any) => a.email !== email);

        await updateDoc(s.ref, {
          followers: newFollowers,
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  //cancel pending request

  const cancelPendingRequest = async (email: string) => {
    try {
      const currentUser = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );

      currentUser.forEach(async (s) => {
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

  //getAllUsers
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
    getAllPosts();
    getNotice();
  }, []);

  const contextProps: UserContextType = {
    currentUser,
    loginUser,
    signUpUser,
    allUsers,
    getAllUsers,
    acceptFollowRequest,
    cancelPendingRequest,
    commentOnPost,
    createPost,
    declinePendingRequest,
    dislikeComment,
    dislikePost,
    followUser,
    likeComment,
    likePost,
    markPostFavourite,
    unFollowUser,
    followers,
    notices,
    posts,
  };

  return (
    <UserContext.Provider value={contextProps}>{children}</UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);

export default AuthContext;
