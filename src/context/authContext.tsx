import {
  addDoc,
  collection,
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

const UserContext = createContext({});

export type NoticeType = {
  ref?: any;
  seen?: string[];
  delivered?: string[];
  message: string;
  type: "USER" | "POST";
  noticeFor?: string[];
  createdAt?: string;
  read?: boolean;
};

export type PostComment = {
  id?: number;
  username: string;
  createdAt?: string;
  content: string;
  likedBy?: string[];
  dislikedBy?: string[];
  liked?: boolean;
  unliked?: boolean;
};

export type PostType = {
  id?: number;
  ref?: any;
  username: string;
  createdAt?: string;
  content: string;
  createdBy: string;
  tagNames?: string[];
  following?: boolean;
  liked?: boolean;
  likedBy?: string[];
  dislikedBy?: string[];
  unliked?: boolean;
  markedFavourite?: boolean;
  comments?: PostComment[];
};

// export type PostCreate = {
//   post: string;
//   username: string;
//   email: string;
//   tags: string[];
// };

export type followRequest = { status: "ACCEPTED" | "PENDING"; email: string };

export type UserType = {
  username: string;
  role: string;
  email: string;
  password: string;
  followers?: followRequest[];
  favouritePosts?: number[];
  aboutUser?: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export type UserContextType = {
  //users functions
  currentUser: UserType | undefined;
  loginUser: (user: LoginType) => void;
  updateUser: (user: UserType) => void;
  signUpUser: (user: UserType) => void;
  allUsers: UserType[];
  getAllUsers: () => void;
  getUser: (email: string) => Promise<UserType>;
  followUser: (email: string) => void;
  unFollowUser: (email: string) => void;
  acceptFollowRequest: (email: string) => void;
  declinePendingRequest: (email: string) => void;
  cancelPendingRequest: (email: string) => void;

  //post functions
  createPost: (post: PostType) => void;
  getAPost: (postId: number) => Promise<PostType>;
  commentOnPost: (postref: any, comment: PostComment) => void;
  likePost: (postref: any) => void;
  dislikePost: (postref: any) => void;
  likeComment: (postref: any, commentId: number) => void;
  dislikeComment: (postref: any, commentId: number) => void;
  markPostFavourite: (postId: number) => void;
  posts: PostType[];
  latestPPost: PostType[];
  followers?: UserType[];
  pendingFollowers?: UserType[];
  following?: UserType[];
  notices: any[];
  unreadNotices: boolean;
  readNotice: (ref: any) => Promise<boolean>;
};

//like query
const like = (post: PostType | PostComment) => {
  let likedBy;
  let dislikedBy;

  if (post?.dislikedBy?.includes(auth.currentUser?.email as string)) {
    dislikedBy = post?.dislikedBy.filter(
      (a: any) => a !== auth.currentUser?.email
    );
  } else {
    dislikedBy = post.dislikedBy || [];
  }

  if (post.likedBy) {
    if (post.likedBy.includes(auth.currentUser?.email as string)) {
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
  const [latestPPost, setlatestPosts] = useState<PostType[]>([]);
  const [followers, setFollowers] = useState<UserType[]>();
  const [following, setFollowing] = useState<UserType[]>();
  const [pendingFollowers, setPendingFollowers] = useState<UserType[]>();
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [notices, setNotices] = useState<NoticeType[]>([]);
  const [unreadNotices, setUnreadNotices] = useState(false);
  const noticeRef = useRef<any>();

  const effectOnce = useRef(false);

  console.log(posts);

  //post funcs

  //create post
  const createPost = async (postCreate: PostType) => {
    try {
      if (!!!auth.currentUser) {
        toast.error("You must be logged in to create a post");
        return;
      }

      console.log(postCreate);

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

      await createNewNotice({
        message: `${auth.currentUser?.displayName} just created a new post`,
        type: "POST",
      });
      await getAllPosts();
      return true;
    } catch (error) {
      console.log(error);
    }
  };

  //get all post
  const getAllPosts = async () => {
    try {
      const allPosts = (await getDocs(collection(db, "posts"))).docs;

      const updatedAllPosts = await Promise.all(
        allPosts.map(async (a): Promise<PostType> => {
          //check if current user liked post is following createdby user and marks post as favourite

          const user = await getUser((a.data() as PostType).createdBy);
          return {
            ref: a.ref,
            ...a.data(),
            comments: (a.data() as PostType).comments?.map((a) => {
              return {
                ...a,
                liked: a.likedBy?.includes(auth.currentUser?.email!),
                unliked: a.dislikedBy?.includes(auth.currentUser?.email!),
              };
            }),
            following: !!user.followers?.find(
              (a) => a.email == auth.currentUser?.email
            ),
            liked: (a.data() as PostType).likedBy?.includes(
              auth.currentUser?.email as string
            ),
            unliked: (a.data() as PostType).dislikedBy?.includes(
              auth.currentUser?.email as string
            ),
            markedFavourite: currentUser?.favouritePosts?.includes(
              (a.data() as PostType).id as number
            ),
          } as PostType;
        })
      );

      setPosts(updatedAllPosts);
    } catch (error) {
      console.log(error);
    }
  };

  //get trending post
  const latestPost = async () => {
    const allPosts = (await getDocs(collection(db, "posts"))).docs;
    const updatedAllPosts = await Promise.all(
      allPosts.map(async (a): Promise<PostType> => {
        //check if current user liked post is following createdby user and marks post as favourite

        const user = await getUser((a.data() as PostType).createdBy);
        return {
          ref: a.ref,
          ...a.data(),
          comments: (a.data() as PostType).comments?.map((a) => {
            return {
              ...a,
              liked: a.likedBy?.includes(auth.currentUser?.email!),
              unliked: a.dislikedBy?.includes(auth.currentUser?.email!),
            };
          }),
          following: !!user.followers?.find(
            (a) => a.email == auth.currentUser?.email
          ),
          liked: (a.data() as PostType).likedBy?.includes(
            auth.currentUser?.email as string
          ),
          unliked: (a.data() as PostType).dislikedBy?.includes(
            auth.currentUser?.email as string
          ),
          markedFavourite: currentUser?.favouritePosts?.includes(
            (a.data() as PostType).id as number
          ),
        } as PostType;
      })
    );

    setlatestPosts(
      updatedAllPosts
        .sort((a, b) => (b.createdAt as any) - (a.createdAt as any))
        .slice(0, 10)
    );
  };

  //comment to post
  const commentOnPost = async (ref: any, comment: PostComment) => {
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
  const likePost = async (ref: any): Promise<boolean> => {
    try {
      const post: PostType = (await getDoc(ref)).data() as PostType;

      const liked = like(post);
      console.log(liked);

      await updateDoc(ref, {
        likedBy: liked.likedBy,
        dislikedBy: liked.dislikedBy,
      });

      const isLiked = liked.likedBy.includes(auth.currentUser?.email);

      toast.success(
        `You ${isLiked ? "liked" : "unliked"} ${post.createdBy} post`
      );

      await createNewNotice({
        message: `${auth.currentUser?.displayName} ${
          isLiked ? "liked" : "unliked"
        } your post`,
        type: "POST",
        noticeFor: [post.createdBy],
      });

      return isLiked;
    } catch (error: any) {
      console.log(error);
      throw Error(error);
    }
  };
  //dislike a post
  const dislikePost = async (ref: any): Promise<boolean> => {
    try {
      const post: any = (await getDoc(ref)).data();

      const disliked = dislike(post);
      await updateDoc(ref, {
        likedBy: disliked.likedBy,
        dislikedBy: disliked.dislikedBy,
      });

      const isdisLiked = disliked.dislikedBy.includes(auth.currentUser?.email);

      toast.success(
        `You ${isdisLiked ? "disliked" : "stopped to disliked"} ${
          post.createdBy
        } post`
      );

      await createNewNotice({
        message: `${auth.currentUser?.displayName} ${
          isdisLiked ? "disliked" : "stopped to disliked"
        } your ${post.createdBy} your post`,
        type: "POST",
        noticeFor: [post.data().email],
      });

      return isdisLiked;
    } catch (error: any) {
      console.log(error);
      throw Error(error);
    }
  };

  //like a comment
  const likeComment = async (
    postRef: any,
    commentId: any
  ): Promise<boolean> => {
    try {
      const post: PostType = (await getDoc(postRef)).data() as PostType;
      const comment = post.comments?.find((a: any) => a.id === commentId);

      const liked = like(comment!);

      await updateDoc(postRef, {
        comments: post.comments?.map((a: any) => {
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

      const couldLike = liked.likedBy.includes(auth.currentUser?.email);

      toast.success(
        `You ${couldLike ? "liked" : "unliked"} on ${
          post.createdBy
        } post comment`
      );

      return couldLike;
    } catch (error: any) {
      console.log(error);
      throw Error(error);
    }
  };

  //dislike a comment
  const dislikeComment = async (
    postRef: any,
    commentId: number
  ): Promise<boolean> => {
    try {
      const post: PostType = (await getDoc(postRef)).data() as PostType;
      const comment = post.comments?.find((a: any) => a.id === commentId);

      const disliked = dislike(comment);

      await updateDoc(postRef, {
        comments: post.comments?.map((a: any) => {
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

      const couldDislike = disliked.dislikedBy.includes(
        auth.currentUser?.email
      );

      toast.success(
        `You ${couldDislike ? "disliked" : "stopped disliking"} ${
          post.createdBy
        } post comment`
      );

      return couldDislike;
    } catch (error: any) {
      console.log(error);
      throw Error(error);
    }
  };

  //get post
  const getAPost = async (postId: number): Promise<PostType> => {
    console.log(postId);

    try {
      const postSnapshot = (
        await getDocs(query(collection(db, "posts"), where("id", "==", postId)))
      ).docs[0];

      const postDoc: PostType = postSnapshot.data() as PostType;
      const user = await getUser(postDoc.createdBy);
      return {
        ref: postSnapshot.ref,
        ...postDoc,
        comments: postDoc.comments?.map((a) => {
          return {
            ...a,
            liked: a.likedBy?.includes(auth.currentUser?.email!),
            unliked: a.dislikedBy?.includes(auth.currentUser?.email!),
          };
        }),
        following: !!user.followers?.find(
          (a) => a.email == auth.currentUser?.email
        ),
        liked: postDoc.likedBy?.includes(auth.currentUser?.email as string),
        unliked: postDoc.dislikedBy?.includes(
          auth.currentUser?.email as string
        ),
        markedFavourite: currentUser?.favouritePosts?.includes(
          postDoc.id as number
        ),
      } as PostType;
    } catch (error: any) {
      console.log(error);
      throw Error(error);
    }
  };

  //mark post as favourite
  const markPostFavourite = async (postId: number): Promise<boolean> => {
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

      if (favouritePosts?.includes(postId))
        newFavouritePosts = favouritePosts.filter((a) => a !== postId);
      else newFavouritePosts = [...(favouritePosts || []), postId];

      await updateDoc(user[0].ref, { favouritePosts: newFavouritePosts });

      const isFavourite = newFavouritePosts?.includes(postId);

      toast.success(
        `You ${isFavourite ? "marked" : "unmarked"} this post as favourite`
      );

      return isFavourite;
    } catch (error: any) {
      console.log(error);
      throw Error(error);
    }
  };

  //notifications func
  const createNewNotice = async (notice: NoticeType) => {
    const { message, type, noticeFor } = notice;
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
        delivered: [auth.currentUser?.email],
        type,
        message,
        createdAt: Date.now(),
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
        const notice: NoticeType = { ref: s.ref, ...s.data() } as NoticeType;

        if (!notice?.noticeFor?.includes(auth.currentUser?.email as string)) {
          return;
        }

        if (notice.delivered?.includes(auth.currentUser?.email as string))
          return;

        await updateDoc(s.ref, {
          delivered: [...(notice?.delivered || []), auth.currentUser?.email],
        });

        delete notice.seen;
        delete notice.noticeFor;

        setNotices((prev: any) => [
          ...prev,
          {
            ...notice,
            read: notice.seen?.includes(auth.currentUser?.email as string),
          },
        ]);

        if (notice.type == "USER") {
          await updateCurrentUser(auth.currentUser?.email as string);
          await getAllUsers();
        } else {
          await getAllPosts();
        }

        await unreadNotice();

        toast.success("Hi, incoming notification");

        noticeRef.current = setTimeout(getNotice, 200);
      });
    } catch (error) {
      console.log(error);
    }
  };

  //unread notifications
  const unreadNotice = async () => {
    const involvedNotices: NoticeType[] = (
      await getDocs(
        query(
          collection(db, "notifications"),
          where("noticeFor", "array-contains", auth.currentUser)
        )
      )
    ).docs.map((a) => ({ ref: a.ref, ...a.data() })) as NoticeType[];

    setUnreadNotices(
      !!involvedNotices.find((a) =>
        a.seen?.includes(auth.currentUser?.email as string)
      )
    );
  };

  //read notice
  const readNotice = async (ref: any): Promise<boolean> => {
    try {
      const notice: NoticeType = (await getDoc(ref)).data() as NoticeType;

      await updateDoc(ref, {
        seen: [...(notice?.seen || []), auth.currentUser?.email],
      });

      return true;
    } catch (error: any) {
      console.log(error);
      throw Error(error);
    }
  };

  //user funcs
  //create user
  const signUpUser = async (user: UserType) => {
    try {
      if (auth.currentUser?.email != user.email)
        await createUserWithEmailAndPassword(auth, user.email, user.password);
      const userExist = await getDocs(
        query(collection(db, "users"), where("email", "==", user.email))
      );
      if (userExist.empty) await addDoc(collection(db, "users"), user);
      await updateCurrentUser(user.email);
    } catch (error) {
      console.log(error);
    }
  };

  //update current user
  const updateCurrentUser = async (email?: string) => {
    if (!!!auth.currentUser) {
      toast.error("You are not logged in");
      return;
    }
    try {
      const snapshots = await getDocs(
        query(
          collection(db, "users"),
          where("email", "==", email || auth.currentUser.email)
        )
      );

      if (snapshots.empty) toast.error("No user exist with this email");

      let loginUser;
      snapshots.forEach((s) => {
        loginUser = s.data();
      });

      toast.success("Log in successfull");
      setCurrentUser(loginUser);
      await getAllFollowingUser();
      await followingUsers();
      await getPendingFollowRequest();
    } catch (error) {
      console.log(error);
    }
  };

  //update user
  const updateUser = async (updateData: UserType) => {
    try {
      const userRef = (
        await getDocs(
          query(
            collection(db, "users"),
            where("email", "==", auth.currentUser?.email)
          )
        )
      ).docs[0].ref;

      await updateDoc(userRef, updateData);

      toast.success("Your records has been updated successfully");
    } catch (error) {
      console.log(error);
    }
  };

  //login user
  const loginUser = async (user: LoginType) => {
    try {
      await signInWithEmailAndPassword(auth, user.email, user.password);
      await updateCurrentUser(user.email);
    } catch (error) {
      console.log(error);
    }
  };

  //follow user
  const followUser = async (email: string) => {
    try {
      if (!currentUser) {
        toast.error("You must be logged in to follow or unfollow user");
        return false;
      }

      const snapshots = (
        await getDocs(
          query(collection(db, "users"), where("email", "==", email))
        )
      ).docs;

      const currentFollowers = snapshots[0].data().followers as followRequest[];
      let status: boolean = false;
      let newFollowers: followRequest[];
      if (!!currentFollowers?.find((a) => a.email == auth.currentUser?.email)) {
        status = false;
        newFollowers = currentFollowers.filter(
          (a) => a.email !== auth.currentUser?.email
        );
      } else {
        status = true;
        newFollowers = [
          ...(currentFollowers || []),
          { status: "PENDING", email: auth.currentUser?.email as string },
        ];
      }

      await updateDoc(snapshots[0].ref, {
        followers: newFollowers,
      });

      await createNewNotice({
        message: status
          ? `${auth.currentUser?.email} sent you a follow request`
          : `${auth.currentUser?.email} unfollowed you. you will no longer be able to receive notifications if he make interacts on our forum`,
        type: "USER",
        noticeFor: [email],
      });
      toast.success(
        `${status ? "Follow request sent to" : "Unfollowed"} ${email}`
      );

      return status;
    } catch (error) {
      console.log(error);
    }
  };

  //get pending request
  const getPendingFollowRequest = async () => {
    try {
      const followers = (
        await getDocs(
          query(
            collection(db, "users"),
            where("email", "==", auth.currentUser?.email)
          )
        )
      ).docs[0]
        .data()
        .followers.filter((a: followRequest) => a.status === "PENDING");

      const pendingFollowers: UserType[] = await Promise.all(
        followers.map(async (a: followRequest) => {
          return (
            await getDocs(
              query(collection(db, "users"), where("email", "==", a.email))
            )
          ).docs[0].data();
        })
      );

      setPendingFollowers(pendingFollowers);
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
          // .filter((a: any) => a.status == "ACCEPTED")
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

  const followingUsers = async () => {
    try {
      setFollowing(
        (
          await getDocs(
            query(collection(db, "users"), where("followers", "!=", undefined))
          )
        ).docs
          .filter(
            (a) =>
              !!a
                .data()
                .followers?.find(
                  (a: followRequest) =>
                    a.email == auth.currentUser?.email &&
                    a.status === "ACCEPTED"
                )
          )
          .map((a) => a.data()) as UserType[]
      );
    } catch (error) {}
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

      await getAllUsers();
      await getPendingFollowRequest();
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

      await getAllUsers();
      await getPendingFollowRequest();
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
      const snapshots = (await getDocs(collection(db, "users"))).docs;

      setAllUsers(
        snapshots
          .map((a) => a.data())
          .filter((a) => a.email !== auth.currentUser?.email) as UserType[]
      );
    } catch (error) {
      console.log(error);
    }
  };

  //get one user
  const getUser = async (email: string): Promise<UserType> => {
    try {
      return (await getDocs(collection(db, "users"))).docs
        .find((a) => a.data().email.includes(email))
        ?.data() as UserType;
    } catch (error: any) {
      console.log(error);
      throw Error(error.message);
    }
  };

  //call use effect once
  useEffect(() => {
    if (effectOnce.current) {
      getAllUsers();
      getAllPosts();
      latestPost();
      getNotice();
      updateCurrentUser(auth.currentUser?.email as string);
    }
    return () => {
      effectOnce.current = true;
    };
  }, []);

  const contextProps: UserContextType = {
    currentUser,
    loginUser,
    signUpUser,
    allUsers,
    updateUser,
    getAllUsers,
    getUser,
    acceptFollowRequest,
    cancelPendingRequest,
    commentOnPost,
    createPost,
    getAPost,
    declinePendingRequest,
    dislikeComment,
    dislikePost,
    followUser,
    likeComment,
    likePost,
    markPostFavourite,
    unFollowUser,
    followers,
    pendingFollowers,
    following,
    notices,
    posts,
    latestPPost,
    unreadNotices,
    readNotice,
  };

  return (
    <UserContext.Provider value={contextProps}>{children}</UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);

export default AuthContext;
