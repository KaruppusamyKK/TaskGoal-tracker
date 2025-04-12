import { useState, useRef, useEffect } from "react";
import { Tooltip } from 'react-tooltip';
import { ApiService } from '../apiHandler/ApiService.js';
import CommentDialog from "./ChatWindow.js";
import {
    Plus,
    Edit,
    Trash,
    Clock,
    MoreHorizontal,
    ChevronDown,
    MessageSquare,
    Inbox,
} from "lucide-react";
import SideBar from './Sidebar.js';
import { CheckCircle, PauseCircle, XCircle, CalendarX2, AlertTriangle, FlaskConical, Rocket, Bug, Upload } from "lucide-react";
import { Flag, FlagTriangleLeft, FlagTriangleRight } from "lucide-react";
import ToastService from '../components/ToastService.js';
import { AssigneeAvatar } from "../components/Constants.js";
import TaskDetails from "./TaskDetail.js";

export default function TaskTracker() {

    const [tasks, setTasks] = useState([]);
    const [taskId, setTaskId] = useState('');

    const [isOpen, setIsOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [currentTask, setCurrentTask] = useState({
        taskName: "",
        assignee: [],
        description: "",
        status: "Not Started",
        timeTracked: "",
        timeEstimate: "",
        priority: "Medium",
        startDate: "",
        dueDate: "",
    });
    const [isChatOpen, setIsChatOpen] = useState(false);


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
            const responseMessage = await ApiService.listTasksByUser(localStorage.getItem("user"));
            if (Array.isArray(responseMessage) && responseMessage.length > 0) {
                setTasks(responseMessage);
            } else {
                setTasks([]);
            }
        } catch (error) {
            console.log(error);
            setTasks([]);
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
            assignee: selectedTask.assignee || [],
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
            assigner: currentTask.assigner || "",
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





    const handleMultiInputChange = (field, value) => {
        setCurrentTask((prev) => {
            const prevAssignees = prev[field] || [];
            const isAdded = !prevAssignees.includes(value);
            const newAssignees = isAdded
                ? [...prevAssignees, value]
                : prevAssignees.filter((a) => a !== value);



            const assigneeStatus = {
                taskId: prev.taskId,
                assigneeList: [value],
                action: isAdded ? "ADD_ASSIGNEE" : "REMOVE_ASSIGNEE"
            };

            changeAssigneeStatus(assigneeStatus);
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
                ToastService.success("Assignee status changed successfully!");
            } else {
                ToastService.error("Failed to update assignee status.");
            }
        } catch (error) {
            console.error("Error changing assignee status:", error);
            ToastService.error("An error occurred while updating assignee status.");
        }
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



    const handleInputChange = (field, value) => {
        setCurrentTask({
            ...currentTask,
            [field]: value,
        });
    };

    const overdueTasks = tasks.filter(
        t =>
            t.dueDate &&
            new Date(t.dueDate) < new Date() &&
            ["In Progress", "Not Started", "Needs Rework", "Testing"].includes(t.status) // Only these statuses
    ).length;



    return (
        <div className="flex h-screen bg-white">

            <SideBar />


            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto p-6">
                    <div className="grid gap-6">
                        <div>
                            <div className="flex justify-between items-center p-4 bg-white border-b shadow-sm">
                                <h1 className="text-2xl font-extrabold">Your Task Details</h1>
                                <button
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    onClick={handleAddNewTask}
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Add New Task</span>
                                </button>
                            </div>

                            <div className="mt-4">
                                <div className="p-4 border-b bg-gray-100 relative cursor-pointer" data-tooltip-id="task-tooltip">
                                    <h2 className="text-lg font-semibold mb-2">Task Progress</h2>

                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${tasks?.length
                                                    ? (tasks.filter(t => ["Completed", "Deployed"].includes(t.status)).length / tasks.length) * 100
                                                    : 0}%`
                                            }}
                                        ></div>
                                    </div>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {tasks?.filter(t => ["Completed", "Deployed"].includes(t.status)).length} of {tasks?.length || 0} tasks completed
                                    </p>

                                    {/* Tooltip Component */}
                                    <Tooltip id="task-tooltip" place="top" effect="solid" float>
                                        <div className="text-sm">
                                            <p className="flex items-center">
                                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                                <strong>Completed/Deployed:</strong> {tasks.filter(t => ["Completed", "Deployed"].includes(t.status)).length} tasks
                                            </p>
                                            <p className="flex items-center">
                                                {priorityIcons["High"]} <strong>High Priority:</strong> {tasks.filter(t => t.priority === "High").length} tasks
                                            </p>
                                            <p className="flex items-center">
                                                {priorityIcons["Medium"]} <strong>Medium Priority:</strong> {tasks.filter(t => t.priority === "Medium").length} tasks
                                            </p>
                                            <p className="flex items-center">
                                                {priorityIcons["Low"]} <strong>Low Priority:</strong> {tasks.filter(t => t.priority === "Low").length} tasks
                                            </p>
                                            <p className="flex items-center">
                                                <Rocket className="h-4 w-4 mr-2 text-blue-500" />
                                                <strong>In Progress:</strong> {tasks.filter(t => t.status === "In Progress").length} tasks
                                            </p>
                                            <p className="flex items-center">
                                                <Bug className="h-4 w-4 mr-2 text-red-500" />
                                                <strong>Live Testing:</strong> {tasks.filter(t => t.status === "Live Testing").length} tasks
                                            </p>
                                            <p className="flex items-center">
                                                <strong>Total Tasks:</strong> {tasks.length}
                                            </p>
                                            <p className="flex items-center">
                                                <CalendarX2 className="h-4 w-4 mr-2 text-red-600" />
                                                <strong>Overdue Tasks:</strong> {overdueTasks} tasks
                                            </p>
                                        </div>
                                    </Tooltip>
                                </div>



                                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                                    <div className="p-4 border-b">
                                        <h2 className="text-lg font-semibold">Tasks of yours</h2>
                                        <p className="text-sm text-gray-500">Click on a task to view and edit details</p>
                                    </div>
                                    <div className="overflow-x-auto">
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
                                                {tasks.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="8" className="px-4 py-6 text-center text-sm text-gray-500">
                                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                                <Inbox className="h-6 w-6 text-gray-400" />
                                                                <span>No tasks found.</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    tasks.map((task, index) => (
                                                        <tr
                                                            key={task.id || index}
                                                            className="border-t cursor-pointer hover:bg-gray-50"
                                                            onClick={() => handleOpenTask(task)}
                                                        >
                                                            <td className="px-4 py-3 text-sm font-medium group relative">
                                                                {task.taskName.length > 50
                                                                    ? `${task.taskName.slice(0, 45)}...`
                                                                    : task.taskName}

                                                                {task.taskName.length > 50 && (
                                                                    <span className="absolute left-0 -top-8 w-max p-2 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition">
                                                                        {task.taskName}
                                                                    </span>
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-3 text-sm">
                                                                <div className="flex -space-x-2">
                                                                    {task.assignee.map((assignee, index) => (
                                                                        <AssigneeAvatar key={index} name={assignee} />
                                                                    ))}
                                                                </div>
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

                                                            <td className="px-4 py-3 text-sm">{formatDate(task.startDate)}</td>
                                                            <td className="px-4 py-3 text-sm">{formatDate(task.dueDate)}</td>
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
                                                    ))
                                                )}
                                            </tbody>

                                        </table>
                                    </div>

                                </div>
                            </div>



                        </div>
                    </div>
                </div>
            </div>

            {/* Task Detail Dialog */}
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
                                                        {employees.map((employee) => (
                                                            <li
                                                                key={employee.id}
                                                                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                                                                onClick={() => {
                                                                    handleMultiInputChange("assignee", employee.name);
                                                                    setIsOpen(false);
                                                                }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={currentTask.assignee.includes(employee.name)}
                                                                    onChange={() => handleMultiInputChange("assignee", employee.name)}
                                                                    className="mr-2"
                                                                />
                                                                <span>{employee.name}</span>
                                                            </li>
                                                        ))}
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
                                            isMyTask={true}
                                        />
                                    </div>
                                ) : null}
                        </div>
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






