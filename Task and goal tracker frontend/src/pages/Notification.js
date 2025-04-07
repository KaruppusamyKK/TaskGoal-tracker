import { useEffect, useState } from "react";
import {
  Bell,
  UserX,
  CheckCircle,
  AlertCircle,
  Info,
  MessageSquare,
  Calendar,
  Search,
  Trash2,
  User,
  ClipboardCheck,
} from "lucide-react";
import SideBar from "./Sidebar.js";
import { ApiService } from "../apiHandler/ApiService.js";
import { useOpenTask } from "../context/OpenTaskContext.js";
import { useNavigate } from "react-router-dom";
import ToastService from '../components/ToastService';



const getNotificationIcon = (type) => {
  switch (type) {
    case "alert":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "info":
      return <Info className="h-5 w-5 text-blue-500" />;
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "message":
      return <MessageSquare className="h-5 w-5 text-purple-500" />;
    case "calendar":
      return <Calendar className="h-5 w-5 text-amber-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getAssignmentMessage = (taskName, sender, message) => {
  let actionText = "";
  let icon = <User className="h-4 w-4 text-gray-500" />;

  if (message.includes("You have been assigned")) {
    actionText = "assigned this task to you";
  } else if (message.includes("You have been removed")) {
    actionText = "removed you from the task";
    icon = <UserX className="h-4 w-4 text-red-500" />;
  } else if (message.includes("status of the task have been changed")) {
    actionText = "updated the task status";
    icon = <ClipboardCheck className="h-4 w-4 text-gray-500" />;
  } else {
    actionText = message;
  }

  return (
    <div className="flex items-center space-x-2">
      {icon}
      <p className="text-sm">
        <span className="font-semibold">{sender}</span>{" "}
        <span className="text-blue-600 cursor-pointer hover:underline">{actionText}</span>
      </p>
    </div>
  );
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);

  const {
    openOpenNotificationTask,
    setSelectedTaskName
  } = useOpenTask();
  const navigate = useNavigate();


  const handleOpenTask = (taskName) => {
    setSelectedTaskName(taskName);
    openOpenNotificationTask(true);
    navigate("/home");
  };

  const deleteNotification = async (notificationId) => {
    const responseMessage = await ApiService.deleteNotification(notificationId);
    if (responseMessage.status === 200) {
      ToastService.success("Notification deleted successfully");
      setNotifications(prev =>
        prev.map(group => ({
          ...group,
          items: group.items.filter(item => item.notificationId !== notificationId),
        }))
      );
    } else {
      ToastService.error("Notification deletion failed");
    }
  };



  const getFilteredNotifications = () => {
    let filtered = [...notifications];

    if (searchQuery) {
      filtered = filtered
        .map((group) => ({
          ...group,
          items: group.items.filter(
            (item) =>
              item.taskName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.message.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((group) => group.items.length > 0);
    }

    if (activeTab !== "all") {
      filtered = filtered
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            if (activeTab === "unread") return !item.read;
            return item.type === activeTab;
          }),
        }))
        .filter((group) => group.items.length > 0);
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  const generateNotifications = async () => {
    try {
      const responseMessage = await ApiService.fetchNotifications(localStorage.getItem("user"));
      setNotifications([{ items: responseMessage.data.notificationResponse }]);
      setSelectedTask(responseMessage.data.userTaskDtoList);
    } catch (error) {
      console.error(error);
      setNotifications([{ items: [] }]);
    }
  };

  useEffect(() => {
    generateNotifications();
  }, []);

  return (
    <div className="flex h-screen bg-white">
      <SideBar />
      <div className="fixed inset-y-0 right-0 w-[calc(100vw-250px)] h-screen bg-white overflow-hidden z-50">
        <div className="w-full h-full flex flex-col">
          <div className="w-full rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <Bell className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Notification Center</h2>
              </div>
            </div>

            <div className="border-b p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="h-[calc(120vh-220px)] overflow-auto p-4 sm:p-6">
              {filteredNotifications.length === 0 ||
                filteredNotifications.every((group) => group.items.length === 0) ? (
                <div className="flex h-40 flex-col items-center justify-center text-center">
                  <Info className="mb-2 h-10 w-10 text-gray-400" />
                  <h3 className="text-lg font-medium">No notifications present</h3>
                  <p className="text-sm text-gray-500">
                    {searchQuery
                      ? "Try adjusting your search or filters"
                      : "You're all caught up!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredNotifications.map((group, index) => (
                    group.items.length > 0 && (
                      <div key={`group-${index}`} className="space-y-4">
                        <div className="flex items-center">
                          <div className="ml-4 h-px flex-1 bg-gray-200"></div>
                        </div>

                        <div className="space-y-3">
                          {group.items.map((item) => (
                            <div
                              key={item.id || `item-${index}`}
                              className="relative rounded-lg border p-4 transition-colors bg-white hover:bg-gray-50"
                            >
                              <div className="flex">
                                <div className="mr-4 mt-0.5">
                                  {getNotificationIcon(item.type)}
                                </div>

                                <div
                                  className="flex-1 space-y-1 cursor-pointer"
                                  onClick={() => handleOpenTask(item.taskName)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-1">
                                      <p className="font-bold">{item.taskName}</p>
                                      <p className="text-sm text-gray-500">
                                        ({item.description})
                                      </p>
                                    </div>
                                    <div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(item.notificationId);
                                        }}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition duration-150"
                                        title="Delete Notification"
                                      >
                                        <Trash2 className="w-5 h-5" />
                                      </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <div className="relative group">
                                        <div>{formatTime(item.timestamp)}</div>
                                      </div>
                                    </div>
                                  </div>
                                  {getAssignmentMessage(item.taskName, item.sender, item.message)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
