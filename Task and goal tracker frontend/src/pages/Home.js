import { useState, useRef, useEffect } from "react";
import { ApiService } from "../apiHandler/ApiService.js";
import ToastService from "../components/ToastService.js";
import { AssigneeAvatar } from '../components/Constants.js';
import {
  Plus, Clock, ListTodo, MoreHorizontal, ChevronDown,
  CheckCircle, PauseCircle, XCircle, AlertTriangle, FlaskConical, Rocket, Bug, Upload,
  Flag, FlagTriangleLeft, FlagTriangleRight,
} from "lucide-react";
import CommentDialog from "./ChatWindow.js";
import TaskManagementApp from "./Sidebar.js";
import TaskDetails from "./TaskDetail.js";
import { useOpenTask } from "../context/OpenTaskContext.js";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";



export default function TaskTracker() {

  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatNotificationModal, setChatNotificationModal] = useState(false);
  const [chatNotificationTask, setChatNotificationTask] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [targetAssigneeForNotification, setTargetAssigneeForNotification] = useState([[]]);
  const { openNotificationTask, selectedTaskName, openOpenNotificationTask, setSelectedTaskName } = useOpenTask();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const tasksPerPage = 5;

  const offset = currentPage * tasksPerPage;
  const currentTasks = tasks.slice(offset, offset + tasksPerPage);
  const pageCount = Math.ceil(tasks.length / tasksPerPage);

  useEffect(() => {
    if (openNotificationTask && selectedTaskName && tasks.length > 0) {
      const foundTask = tasks.find(task => task.taskName === selectedTaskName);
      if (foundTask) {
        setChatNotificationModal(true);
        setChatNotificationTask(foundTask);
      } else {
        console.log("❌ Task not found for name:", selectedTaskName);
      }
      openOpenNotificationTask(false);
      setSelectedTaskName("");
    }
  }, [openNotificationTask, selectedTaskName, tasks]);


  const [currentTask, setCurrentTask] = useState({
    taskName: "", assignee: [], description: "", status: "Not Started",
    timeTracked: "", timeEstimate: "", priority: "Medium",
    startDate: "", dueDate: ""
  });



  const [isOpen, setIsOpen] = useState(false);




  const priorityIcons = {
    Low: <FlagTriangleLeft className="h-4 w-4 mr-2 text-green-500" />,
    Medium: <Flag className="h-4 w-4 mr-2 text-yellow-500" />,
    High: <FlagTriangleRight className="h-4 w-4 mr-2 text-red-500" />,
  };
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

  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const modalRef = useRef(null);




  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsDialogOpen(false);
        setEditingId(null);
      }
    }

    if (isDialogOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDialogOpen]);

  const fetchTasks = async () => {
    try {
      const responseMessage = await ApiService.getTasks();
      setTasks(responseMessage.data);
    } catch (error) {
      console.log(error);
    }
  };


  const fetchEmployees = async () => {
    try {
      const responseMessage = await ApiService.getEmployees();
      setEmployees(responseMessage.data);
    } catch (error) {
      console.log(error);
    }
  };


  const handleOpenTask = (task) => {
    setTaskId(task.taskId);
    setEditingId(null);
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleAddNewTask = () => {
    setSelectedTask(null);
    setEditingId("new");
    setCurrentTask({
      taskName: "",
      assignee: [],
      description: "",
      status: "",
      timeTracked: "",
      timeEstimate: "",
      priority: "",
      startDate: "",
      dueDate: "",
    });
    setIsDialogOpen(true);
  };

  const handleAddComment = () => {
    setIsChatOpen(true);
    setIsDialogOpen(false);
  }


  const handleEditTask = () => {
    if (!selectedTask || Object.keys(selectedTask).length === 0) {
      console.warn("No task selected for editing.");
      return;
    }
    console.log("Selected Task:", selectedTask);
    setEditingId("update");
    setCurrentTask({
      ...selectedTask,
      assignee: selectedTask.assignees || [],
    });
  };



  const formatDateTime = (dateTime) => {
    return dateTime ? (dateTime.includes("T") ? dateTime : `${dateTime}T00:00:00`) : "";
  };


  const formatDate = (dateString) => {
    if (!dateString) return "";
    const datePart = dateString.split(" ")[0];
    const date = new Date(datePart);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(date);
  };


  const formatPlaceHolderDate = (dateString) => {
    if (!dateString) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    if (/^\d{1,4}(-\d{0,2}){0,2}$/.test(dateString)) return dateString;
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return dateString;

    return parsedDate.toISOString().split("T")[0];
  };




  const handleSaveTask = async () => {
    const formattedTask = {
      description: currentTask.description || "",
      taskName: currentTask.taskName || "",
      priority: currentTask.priority || "",
      assignee: Array.isArray(currentTask.assignee) ? currentTask.assignee : [],
      assigner: localStorage.getItem('user') || "",
      status: currentTask.status || "",
      timeEstimate: currentTask.timeEstimate ? Number(currentTask.timeEstimate) : 0,
      timeTracked: currentTask.timeTracked ? Number(currentTask.timeTracked) : 0,
      startDate: currentTask.startDate ? formatDateTime(currentTask.startDate) : null,
      dueDate: currentTask.dueDate ? formatDateTime(currentTask.dueDate) : null,
    };

    if (editingId === "new") {
      const newTaskWithId = {
        id: Date.now().toString(),
        ...formattedTask,
      };

      await saveCurrentTask(formattedTask);
      setTasks((prevTasks) => [...prevTasks, newTaskWithId]);
    } else {

      const existingTask = tasks.find((task) => String(task.taskId) === String(selectedTask.taskId));
      if (!existingTask) {
        console.warn("Task not found for update! Task ID:", selectedTask.taskId);
        return;
      }

      const updatedFields = {};
      let hasChanges = false;

      Object.keys(formattedTask).forEach((key) => {
        console.log("key")
        const newValue = formattedTask[key];
        const oldValue = existingTask[key];

        if (
          (Array.isArray(oldValue) && Array.isArray(newValue) && JSON.stringify(oldValue) !== JSON.stringify(newValue)) ||
          (!Array.isArray(oldValue) && oldValue !== newValue)
        ) {
          updatedFields[key] = newValue;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        await UpdateCurrentTask(updatedFields, selectedTask.taskId);

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            String(task.id) === String(selectedTask.taskId) ? { ...task, ...updatedFields } : task
          )
        );

        setSelectedTask((prev) => ({ ...prev, ...updatedFields }));
        fetchTasks();
      }
    }

    setEditingId(null);
  };



  const saveCurrentTask = async (task) => {
    try {
      const saveTaskResp = await ApiService.saveTask(task);
      if (saveTaskResp.status === 200) {
        ToastService.success("Saved successfully");
      }
    } catch (errorMessage) {
      console.error("❌ Login Failed:", errorMessage);
      const errorText = errorMessage?.message || JSON.stringify(errorMessage);
      ToastService.error(errorText);
    }
  };


  const UpdateCurrentTask = async (task, taskId) => {
    try {
      await ApiService.updateTask(task, taskId);
      ToastService.success("Task detail has been updated");
    } catch (errorMessage) {
      console.error("❌ Login Failed:", errorMessage);
      const errorText = errorMessage?.message || JSON.stringify(errorMessage);
      ToastService.error(errorText);
    }
  };


  const handleDeleteTask = async (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
    try {
      await proceedDeleteTask(taskId);
      ToastService.success("Task deleted successfully");
    } catch (error) {
      console.error("❌ Task Deletion Failed:", error);
      ToastService.error(error?.message || "Failed to delete task");
    } finally {
      setIsDialogOpen(false);
    }
  };

  const proceedDeleteTask = async (taskId) => {
    try {
      const response = await ApiService.deleteTask({ taskId });
      return response;
    } catch (error) {
      throw error;
    }
  };

  // const handleMultiInputChange = (field, value) => {
  //   setCurrentTask((prev) => ({
  //     ...prev,
  //     [field]: prev[field].includes(value)
  //       ? prev[field].filter((a) => a !== value) 
  //       : [...prev[field], value],
  //   }));
  // };


  const handleMultiInputChange = (field, value) => {
    setCurrentTask((prev) => {
      const prevAssignees = prev[field] || [];
      const isAdded = !prevAssignees.includes(value);
      const newAssignees = isAdded
        ? [...prevAssignees, value]
        : prevAssignees.filter((a) => a !== value);


      setTasks((prevList) =>
        prevList.map((t) => (t.taskId === prev.taskId ? { ...t, assignees: newAssignees } : t))
      );

      if (editingId === "update") {
        const assigneeStatus = {
          taskId: prev.taskId,
          assigneeList: [value],
          action: isAdded ? "ADD_ASSIGNEE" : "REMOVE_ASSIGNEE",
          assigner: localStorage.getItem("user"),
          taskName: prev.taskName,
          description: prev.description,
        };

        changeAssigneeStatus(assigneeStatus);
        setTargetAssigneeForNotification((prevList) => [...prevList, [value]]);
      }

      setTimeout(() => {
        window.location.reload();
      }, 500);

      return { ...prev, [field]: newAssignees };
    });
  };


  const changeAssigneeStatus = async (assigneeStatus) => {
    try {
      const response = await ApiService.changeAssigneeStatus(assigneeStatus);
      if (response?.status === 200) {
        setNotificationCount((prevCount) => prevCount + 1);

        ToastService.success("Assignee status changed successfully!");
      } else {
        ToastService.error("Failed to update assignee status.");
      }
    } catch (error) {
      console.error("Error changing assignee status:", error);
      ToastService.error("An error occurred while updating assignee status.");
    }
  };


  const handleInputChange = (field, value) => {
    setCurrentTask({
      ...currentTask,
      [field]: value,
    });
  };

  const getTaskCountByStatus = (status) => {
    return tasks.filter((task) => task.status === status).length;
  };

  const getCompletionPercentage = () => {
    const completed = getTaskCountByStatus("Completed");
    const deployed = getTaskCountByStatus("Deployed");
    return tasks.length > 0 ? Math.round(((completed + deployed) / tasks.length) * 100) : 0;
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <TaskManagementApp count={notificationCount} assigneeList={targetAssigneeForNotification} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b px-6 py-3 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <button className="md:hidden p-2 rounded-md border border-gray-200">
              <ListTodo className="h-4 w-4" />
            </button>
            <div className="relative w-64">
              <h1 className="font-bold">
                <span className="text-[rgb(37_99_235)]">Task</span><span className="text-black" style={{ marginLeft: '0px' }}>Flow</span>
              </h1>

            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleAddNewTask}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </button>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid gap-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-1">Total Tasks</div>
                <div className="text-2xl font-bold">{tasks.length}</div>
                <p className="text-xs text-gray-500 mt-1">{getCompletionPercentage()}% complete</p>
                <div className="h-2 w-full bg-gray-100 rounded-full mt-2">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-1">In Progress</div>
                <div className="text-2xl font-bold">{getTaskCountByStatus("In Progress")}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((getTaskCountByStatus("In Progress") / tasks.length) * 100)}% of all tasks
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-1">Completed</div>
                <div className="text-2xl font-bold">{getTaskCountByStatus("Completed")}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((getTaskCountByStatus("Completed") / tasks.length) * 100)}% of all tasks
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-1">Deployed</div>
                <div className="text-2xl font-bold">{getTaskCountByStatus("Deployed")}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round((getTaskCountByStatus("Deployed") / tasks.length) * 100)}% of all tasks
                </p>
              </div>
            </div>


            <div>



              <div className="mt-4">
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Recent Tasks</h2>
                    <p className="text-sm text-gray-500">Click on a task to view and edit details</p>
                  </div>
                  <div className="overflow-x-auto">
                    {tasks.length > 0 ? (
                      <>
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 text-left">
                              <th className="px-4 py-3 text-sm font-medium text-gray-500">Task Name</th>
                              <th className="px-4 py-3 text-sm font-medium text-gray-500">Assignee</th>
                              <th className="px-4 py-3 text-sm font-medium text-gray-500">Assigner</th>
                              <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                              <th className="px-4 py-3 text-sm font-medium text-gray-500">Priority</th>
                              <th className="px-4 py-3 text-sm font-medium text-gray-500">Start Date</th>
                              <th className="px-4 py-3 text-sm font-medium text-gray-500">Due Date</th>
                              <th className="px-4 py-3 text-sm font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                          </thead>

                          <tbody>
                            {currentTasks.map((task) => (
                              <tr
                                key={task.id}
                                className="border-t cursor-pointer hover:bg-gray-50"
                                onClick={() => handleOpenTask(task)}
                              >
                                <td className="px-4 py-3 text-sm font-medium group relative">
                                  {task.taskName.length > 50 ? `${task.taskName.slice(0, 45)}...` : task.taskName}
                                  {task.taskName.length > 50 && (
                                    <span className="absolute left-0 -top-8 w-max p-2 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition">
                                      {task.taskName}
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {editingId === "update" ? (
                                    <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-yellow-200 rounded-md">
                                      Unassigned Task
                                    </span>
                                  ) : task.assignees && task.assignees.length > 0 ? (
                                    <div className="flex -space-x-2">
                                      {task.assignees.map((assignee, index) => (
                                        <AssigneeAvatar key={index} name={assignee} />
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-yellow-200 rounded-md">
                                      Unassigned Task
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm">{task.assigner}</td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center">
                                    {statusIcons[task.status]}
                                    <span className="ml-[1px]">{task.status}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center">
                                    {priorityIcons[task.priority]}
                                    <span className="ml-[1px]">{task.priority}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">{formatDate(task.dueDate)}</td>
                                <td className="px-4 py-3 text-sm">{formatDate(task.startDate)}</td>
                                <td className="px-4 py-3 text-sm text-right">
                                  <button
                                    className="p-1 rounded-full hover:bg-gray-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenTask(task);
                                    }}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>


                        <div className="mt-4 flex justify-end">
                          <ReactPaginate
                            previousLabel={"← Prev"}
                            nextLabel={"Next →"}
                            pageCount={pageCount}
                            onPageChange={({ selected }) => setCurrentPage(selected)}
                            containerClassName={"flex items-center space-x-2"}
                            pageClassName={"px-3 py-1 border rounded"}
                            activeClassName={"bg-blue-500 text-white"}
                            previousClassName={"px-3 py-1 border rounded"}
                            nextClassName={"px-3 py-1 border rounded"}
                            disabledClassName={"opacity-50 cursor-not-allowed"}
                          />
                        </div>

                      </>
                    ) : (
                      <div className="p-4 text-center text-gray-500">No tasks found</div>
                    )}

                  </div>
                </div>
              </div>



            </div>
          </div>
        </div>
      </div>

      {isDialogOpen && (editingId || selectedTask) && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[100vh] overflow-y-auto">
            <div className="p-4">
              {editingId ? (
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="taskName" className="text-right text-sm font-medium text-gray-500">
                      Task Name
                    </label>
                    <input
                      id="taskName"
                      value={currentTask.taskName}
                      onChange={(e) => handleInputChange("taskName", e.target.value)}
                      placeholder="Enter task name"
                      className="col-span-3 h-9 rounded-md border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4 relative">
                    <label htmlFor="assignee" className="text-right text-sm font-medium text-gray-500">
                      Assignee
                    </label>

                    <div className="col-span-3 relative">
                      <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full h-9 px-3 border border-gray-300 rounded-md text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                      >
                        <span>
                          {currentTask.assignee.length > 0
                            ? currentTask.assignee.join(", ")
                            : "Select assignees"}
                        </span>
                        <span className="text-gray-500">▼</span>
                      </button>

                      {isOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                          <ul className="max-h-40 overflow-auto">
                            {employees
                              .filter((employee) => employee.name !== localStorage.getItem('user'))
                              .map((employee) => {
                                const isSelected = currentTask.assignee.includes(employee.name);

                                return (
                                  <li
                                    key={employee.id}
                                    className={`flex items-center p-2 cursor-pointer ${isSelected
                                      ? "bg-gray-200 cursor-not-allowed"
                                      : "hover:bg-gray-100"
                                      }`}
                                    onClick={() => {
                                      if (!isSelected) {
                                        handleMultiInputChange("assignee", employee.name);
                                        setIsOpen(false);
                                      }
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      disabled={isSelected}
                                      onChange={() => handleMultiInputChange("assignee", employee.name)}
                                      className="mr-2"
                                    />
                                    <span className={`${isSelected ? "text-gray-500" : ""}`}>{employee.name}</span>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      )}

                    </div>

                    {currentTask.assignee.length > 0 && (
                      <div className="col-span-4 flex flex-wrap gap-2 mt-2">
                        {currentTask.assignee.map((name) => (
                          <span key={name} className="bg-gray-200 px-2 py-1 rounded-md text-sm flex items-center">
                            {name}
                            <button
                              onClick={() => handleMultiInputChange("assignee", name)}
                              className="ml-2 text-red-500 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="description" className="text-right text-sm font-medium text-gray-500">
                      Description
                    </label>
                    <input
                      id="description"
                      value={currentTask.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter description"
                      className="col-span-3 h-9 rounded-md border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="status" className="text-right text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <div className="col-span-3 relative">
                      <button
                        type="button"
                        className="flex items-center justify-between w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
                        onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                      >
                        <div className="flex items-center">
                          {currentTask.status ? statusIcons[currentTask.status] : null}
                          <span className={`${currentTask.status ? "" : "text-gray-400"} ml-0`}>
                            {currentTask.status || "Select Status"}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </button>

                      {statusDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                          <div className="py-1">
                            {[
                              "Not Started",
                              "In Progress",
                              "On Hold",
                              "Not Taken",
                              "Needs Rework",
                              "Testing",
                              "Completed",
                              "Live Testing",
                              "Deployed",
                            ].map((status) => (
                              <button
                                key={status}
                                className={`flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${currentTask.status === status ? "bg-gray-50" : ""
                                  }`}
                                onClick={() => {
                                  handleInputChange("status", status);
                                  setStatusDropdownOpen(false);
                                }}
                              >
                                {statusIcons[status]}
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="priority" className="text-right text-sm font-medium text-gray-500">
                      Priority
                    </label>
                    <div className="col-span-3 relative">
                      <button
                        type="button"
                        className="flex items-center justify-between w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
                        onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
                      >
                        <div className="flex items-center">
                          {currentTask.priority ? priorityIcons[currentTask.priority] : null}
                          <span className={`${currentTask.priority ? "" : "text-gray-400"} ml-0`}>
                            {currentTask.priority || "Select Priority"}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </button>

                      {priorityDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                          <div className="py-1">
                            {["Low", "Medium", "High"].map((priority) => (
                              <button
                                key={priority}
                                className={`flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${currentTask.priority === priority ? "bg-gray-50" : ""
                                  }`}
                                onClick={() => {
                                  handleInputChange("priority", priority);
                                  setPriorityDropdownOpen(false);
                                }}
                              >
                                {priorityIcons[priority]}
                                {priority}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="timeTracked" className="text-right text-sm font-medium text-gray-500">
                      Time Tracked(hrs)
                    </label>
                    <input
                      type="number"
                      id="timeTracked"
                      placeholder="Enter time tracked"
                      value={currentTask.timeTracked}
                      onChange={(e) => handleInputChange("timeTracked", e.target.value)}
                      className="col-span-3 h-9 rounded-md border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="timeEstimate" className="text-right text-sm font-medium text-gray-500">
                      Time Estimate(hrs)
                    </label>
                    <input
                      type="number"
                      id="timeEstimate"
                      value={currentTask.timeEstimate}
                      placeholder="Enter Estimated time"
                      onChange={(e) => handleInputChange("timeEstimate", e.target.value)}
                      className="col-span-3 h-9 rounded-md border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="startDate" className="text-right text-sm font-medium text-gray-500">
                      Start Date
                    </label>
                    <input
                      id="startDate"
                      type="text"
                      value={formatPlaceHolderDate(currentTask.startDate || "")}
                      placeholder="YYYY-MM-DD"
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, "");

                        if (val.length > 4) val = val.slice(0, 4) + "-" + val.slice(4);
                        if (val.length > 7) val = val.slice(0, 7) + "-" + val.slice(7);

                        if (val.length <= 10) handleInputChange("startDate", val);
                      }}
                      maxLength={10}
                      className="col-span-3 h-9 rounded-md border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>


                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="dueDate" className="text-right text-sm font-medium text-gray-500">
                      Due Date
                    </label>
                    <input
                      id="dueDate"
                      type="text"
                      value={formatPlaceHolderDate(currentTask.dueDate || "")}
                      placeholder="YYYY-MM-DD"
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9]/g, "");

                        if (val.length > 4) val = val.slice(0, 4) + "-" + val.slice(4);
                        if (val.length > 7) val = val.slice(0, 7) + "-" + val.slice(7);

                        if (val.length <= 10) handleInputChange("dueDate", val);
                      }}
                      maxLength={10}
                      className="col-span-3 h-9 rounded-md border border-gray-200 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>


                  <div className="flex justify-between mt-4 pt-4 border-t">
                    <button
                      className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      onClick={handleSaveTask}
                      disabled={
                        editingId === "new" && (
                          !currentTask.taskName ||
                          !currentTask.assignee ||
                          !currentTask.description ||
                          !currentTask.status ||
                          !currentTask.priority ||
                          !currentTask.timeEstimate ||
                          !currentTask.startDate ||
                          !currentTask.dueDate
                        )
                      }
                    >
                      {editingId === "new" ? "Save Changes" : "Update Changes"}
                    </button>


                  </div>
                </div>
              ) : selectedTask ?
                (
                  <div className="mt-6 p-4 border rounded-lg shadow-lg">
                    <TaskDetails
                      selectedTask={selectedTask}
                      handleAddComment={handleAddComment}
                      handleEditTask={handleEditTask}
                      handleDeleteTask={handleDeleteTask}
                      isMyTask={false}
                    />
                  </div>
                ) : null}
            </div>
          </div>

        </div>
      )}

      {/* {chatNotificationModal && (
        
        <TaskDetails
        selectedTask={chatNotificationTask}
        handleAddComment={handleAddComment}
        handleEditTask={handleEditTask}
        handleDeleteTask={handleDeleteTask}
        isMyTask={false}
      /> )} */}

      {chatNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => navigate("/notify")}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 font-bold text-lg"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold text-center mb-4 text-blue-600">
              🔔 Opened from Notification
            </h2>
            <TaskDetails
              selectedTask={chatNotificationTask}
              handleAddComment={handleAddComment}
              handleEditTask={handleEditTask}
              handleDeleteTask={handleDeleteTask}
              isMyTask={false}
            />
          </div>
        </div>
      )}

      {isChatOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px]">
            <CommentDialog isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} taskID={taskId} />
          </div>
        </div>
      )}
    </div>

  )
}







