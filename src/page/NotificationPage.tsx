import { formatTime } from "../functions/methods";
import { MdAnnouncement } from "react-icons/md";

export const notifications:NotificationType[] = [
  {
    id: 1,
    type: 'post-update',
    message: 'user123 has posted a new logistics update.',
    timestamp: '2024-08-14T10:00:00Z',
    postId: 456,
    userId: 123,
    isNew: true
  },
  {
    id: 2,
    type: 'post-edit',
    message: 'user456 has edited their logistics update in the "Shipping Delays" thread.',
    timestamp: '2024-08-14T11:30:00Z',
    postId: 789,
    userId: 456,
    isNew: true
  },
  {
    id: 3,
    type: 'post-approval',
    message: 'Your logistics update in the "Warehouse Relocation" thread has been approved.',
    timestamp: '2024-08-14T12:00:00Z',
    postId: 101,
    userId: 789,
    isNew: false
  },
  {
    id: 4,
    type: 'comment',
    message: 'user101 has added a comment to your logistics update.',
    timestamp: '2024-08-14T13:15:00Z',
    postId: 202,
    userId: 101,
    isNew: false
  },
  {
    id: 5,
    type: 'like',
    message: 'user202 liked your post in the "Inventory Management" thread.',
    timestamp: '2024-08-14T14:00:00Z',
    postId: 303,
    userId: 202,
    isNew: false
  }
];

export type NotificationType = {
  id:number,
  type: string,
  message: string,
  timestamp: string,
  postId:number,
  userId: number,
  isNew: boolean
}


const NotificationTemplate = ({notification}:{
  notification:NotificationType
})=>{
  return <div className=" items-center flex gap-2 mb-4">
    <MdAnnouncement size={50}/> <div className="flex flex-col gap-1">
    <h3 className="font-semibold">{notification.message}</h3>
              <span className="text-gray-400">
                {formatTime(notification.timestamp)}
              </span>
    </div>

    {notification.isNew && <div className="w-4 ml-auto h-4 rounded-full bg-red-500 shrink-0 grow-0"/>}
  </div>
}

const NotificationPage = () => {
  return (
    <div className = 'max-w-3xl mx-auto px-4 pt-8'>
      {
        notifications.map(notification=><NotificationTemplate notification={notification} />)
      }
    </div>
  )
}

export default NotificationPage
