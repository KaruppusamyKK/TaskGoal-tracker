import React, { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { ApiService } from '../apiHandler/ApiService.js';
import {
  Clock, CheckCircle, PauseCircle, XCircle, AlertTriangle, FlaskConical, Rocket, Bug, Upload,
} from "lucide-react";
import ToastService from "../components/ToastService.js";


const SidebarLink = ({ icon: Icon, children, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
  >
    <Icon className="h-5 w-5" />
    <span>{children}</span>
  </button>
);

export default function TaskManagementApp({ count, assigneeList }) {
  const [client, setClient] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const navigate = useNavigate();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [projects, setProjects] = useState([]);
  const [notificationCount, setNotificationCount] = useState(
    () => parseInt(localStorage.getItem("notificationCount")) || 0
  );


  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/websocket");
    const stompClient = Stomp.over(socket);

    stompClient.debug = () => { };
    stompClient.connect(
      {},
      () => {
        setClient(stompClient);
        stompClient.subscribe("/messageTo/send", (message) => {
          try {
            const parsedMessage = JSON.parse(message.body);
            const currentUser = localStorage.getItem("user");

            if (currentUser && parsedMessage.body && parsedMessage.body[currentUser]) {
              const newCount = parsedMessage.body[currentUser];
              setNotificationCount(newCount);
              localStorage.setItem("notificationCount", newCount);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        });
      },
      (error) => console.error("WebSocket Connection Error:", error)
    );

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []);

  const sendRef = useRef(null);

  useEffect(() => {
    if (!client || !client.connected) return;
    if (sendRef.current === count) return;

    if (count > 0 && Array.isArray(assigneeList) && assigneeList.length > 0) {
      sendRef.current = count;
      const flatAssigneeList = assigneeList.flat();
      client.send("/app/message", {}, JSON.stringify({ users: flatAssigneeList }));
    }
  }, [count]);

  const handleNotificationsClick = async () => {
    setNotificationCount(0);
    await clearCount();
    localStorage.setItem("notificationCount", 0);
    navigate("/notify");
  };

  const clearCount = async () => {
    await ApiService.clearNotificationsCount(localStorage.getItem('user'));
  }



  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleCreateProject = () => {
    setShowProjectModal(true);
  }



  const statusIcons = {
    "Not Started": <Clock className="h-4 w-4 mr-2 text-gray-500" />,
    "In Progress": <Rocket className="h-4 w-4 mr-2 text-blue-500" />,
    "On Hold": <PauseCircle className="h-4 w-4 mr-2 text-yellow-500" />,
    "Not Taken": <XCircle className="h-4 w-4 mr-2 text-gray-400" />,
    "Needs Rework": <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />,
    "Testing": <FlaskConical className="h-4 w-4 mr-2 text-purple-500" />,
    "Completed": <CheckCircle className="h-4 w-4 mr-2 text-green-500" />,
    "Live Testing": <Bug className="h-4 w-4 mr-2 text-red-500" />,
    "Deployed": <Upload className="h-4 w-4 mr-2 text-green-700" />,
  };

  const getCurrentDateTimeWithMicroseconds = (dateStr) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
    const microseconds = `${milliseconds}000`; // add 3 zeros to get 6 digits

    return `${dateStr}T${hours}:${minutes}:${seconds}.${microseconds}`;
  };

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    creator: localStorage.getItem('user'),
    startDate: "",
    endDate: "",
    priority: "LOW",
    status: "PENDING",
  });


  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleDateInput = (field) => (e) => {
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 4) val = val.slice(0, 4) + "-" + val.slice(4);
    if (val.length > 7) val = val.slice(0, 7) + "-" + val.slice(7);
    setFormData({ ...formData, [field]: val.slice(0, 10) });
  };

  const handleSubmit = async (e) => {
    const formattedData = {
      ...formData,
      startDate: getCurrentDateTimeWithMicroseconds(formData.startDate),
      endDate: getCurrentDateTimeWithMicroseconds(formData.endDate),
    };
    e.preventDefault();
    console.log("Submitted Project Data:", formattedData);
    await saveProject(formattedData);
    setShowProjectModal(false);
  };

  const saveProject = async (formattedData) => {

    const resMessage = await ApiService.createProject(formattedData);
    if (resMessage.status === 200) {
      ToastService.success("Project saved successfully");
    }
  }


  useEffect(() => {
    getProjects();
  }, []);


  const getProjects = async () => {
    try {
      const responseMessage = await ApiService.getProjects();
      setProjects(responseMessage.data);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className="h-screen bg-gray-50 flex">
      <div className="w-64 flex flex-col border-r bg-white p-4">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
            <Icons.Star className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">TaskFlow</h1>
        </div>

        <nav className="space-y-1">
          <SidebarLink icon={Icons.Home} onClick={() => navigate("/home")}>Dashboard</SidebarLink>
          <SidebarLink icon={Icons.CheckCircle2} onClick={() => navigate("/my-tasks")}>My Tasks</SidebarLink>
          <SidebarLink icon={Icons.Bell} onClick={handleNotificationsClick}>
            Notification
            {notificationCount > 0 && (
              <span className="ml-auto relative">
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {notificationCount}
                </span>
              </span>
            )}
          </SidebarLink>
          <SidebarLink icon={Icons.MessageSquare}>Messages</SidebarLink>
          <SidebarLink icon={Icons.Users}>Team</SidebarLink>
          <SidebarLink icon={Icons.PlusCircle} onClick={handleCreateProject}>Add Project</SidebarLink>
        </nav>

        <div className="mt-4 px-2">
          <h2 className="text-xs font-semibold text-gray-500 mb-1">Projects</h2>
          <div className="flex flex-wrap gap-2">
            {projects.map((project) => (
              <div
                key={project.projectId}
                className="flex items-center space-x-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full border border-[rgb(37,99,235)] shadow-sm hover:bg-gray-200 cursor-pointer transition duration-150"
              >
                <div className="w-4 h-4 rounded-full bg-[rgb(37,99,235)] flex items-center justify-center text-white text-[10px] font-semibold">
                  {project.projectName
                    .split(" ")
                    .map(word => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <span className="text-xs font-medium">{project.projectName}</span>
              </div>
            ))}
          </div>
        </div>


        <div className="mt-auto space-y-1">
          <div className="flex items-center gap-3 p-3 border-t border-gray-200">
            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              {localStorage.getItem("user")?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="text-lg font-medium">
              {(() => {
                const user = localStorage.getItem("user") || "";
                const firstPart = user.slice(0, 4);
                const secondPart = user.slice(4);
                return (
                  <>
                    <span style={{ color: "rgb(37, 99, 235)", fontWeight: '600' }}>{firstPart}</span>
                    <span className="text-black font-bold">{secondPart}</span>
                  </>
                );
              })()}
            </div>

          </div>
          <SidebarLink icon={Icons.Settings}>Settings</SidebarLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
          >
            <Icons.LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Icons.PlusCircle className="w-5 h-5 text-blue-600" />
              Create New Project
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="text-gray-700">Project Name</label>
                <input
                  value={formData.projectName}
                  onChange={handleChange("projectName")}
                  className="mt-1 w-full border px-3 py-2 rounded"
                  placeholder="Project Name"
                />
              </div>

              <div>
                <label className="text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={handleChange("description")}
                  className="mt-1 w-full border px-3 py-2 rounded"
                  placeholder="Description"
                />
              </div>

              <div className="relative">
                <label className="text-gray-700">Status</label>
                <button
                  type="button"
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="mt-1 w-full border px-3 py-2 rounded bg-white flex items-center justify-between"
                >
                  <span className="flex items-center">
                    {statusIcons[formData.status]}
                    {formData.status}
                  </span>
                  <Icons.ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {showStatusDropdown && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {Object.keys(statusIcons).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, status: key });
                            setShowStatusDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {statusIcons[key]}
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-gray-700">Creator</label>
                <input
                  value={localStorage.getItem('user')}
                  onChange={handleChange("creator")}
                  className="mt-1 w-full border px-3 py-2 rounded"
                  placeholder="Creator"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-700">Start Date</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    maxLength={10}
                    value={formData.startDate}
                    onChange={handleDateInput("startDate")}
                    className="mt-1 w-full border px-3 py-2 rounded"
                  />
                </div>

                <div>
                  <label className="text-gray-700">End Date</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    maxLength={10}
                    value={formData.endDate}
                    onChange={handleDateInput("endDate")}
                    className="mt-1 w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700">Priority</label>
                <select
                  value={formData.priority}
                  onChange={handleChange("priority")}
                  className="mt-1 w-full border px-3 py-2 rounded bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>

            <button
              onClick={() => setShowProjectModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <Icons.X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
