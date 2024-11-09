import { useEffect, useRef } from "react";
import { NoticeType, useAuth, UserContextType } from "../context/authContext";
import { formatTime } from "../functions/methods";
import { MdAnnouncement } from "react-icons/md";

const NotificationTemplate = ({
  notification,
}: {
  notification: NoticeType;
}) => {
  const { readNotice }: Partial<UserContextType> = useAuth();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) {
      readNotice?.(notification.ref);
    }

    return () => {
      loaded.current = true;
    };
  }, []);

  return (
    <div className=" items-center flex gap-2 mb-4">
      <MdAnnouncement size={50} />{" "}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">{notification.message}</h3>
        <span className="text-gray-400">
          {formatTime(notification.createdAt!)}
        </span>
      </div>
      {notification.read && (
        <div className="w-4 ml-auto h-4 rounded-full bg-red-500 shrink-0 grow-0" />
      )}
    </div>
  );
};

const NotificationPage = () => {
  const { notices }: Partial<UserContextType> = useAuth();
  return (
    <div className="max-w-3xl mx-auto px-4 pt-8">
      {notices?.map((notification) => (
        <NotificationTemplate notification={notification} />
      ))}
    </div>
  );
};

export default NotificationPage;
