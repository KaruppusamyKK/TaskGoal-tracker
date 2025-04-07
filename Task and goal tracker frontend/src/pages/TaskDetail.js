

import React from "react";
import { MessageSquare, Edit, Trash, Clock, Calendar, ChevronRight, AlertCircle, CheckCircle, Clock3, ArrowUpCircle, Circle, Flag, User, AlignLeft, Timer } from 'lucide-react';

const AssigneeAvatar = ({ name }) => (
  <div className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-medium text-white ring-2 ring-white">
    {name.charAt(0).toUpperCase()}
    <span className="sr-only">{name}</span>
  </div>
);

export default function TaskDetails({ 
  selectedTask, 
  handleAddComment, 
  handleEditTask, 
  handleDeleteTask,
  isMyTask
}) {

  console.log(JSON.stringify(selectedTask));
  // Status icons mapping
  const statusIcons = {
    "To Do": <Circle className="h-4 w-4 text-gray-500" />,
    "In Progress": <Clock3 className="h-4 w-4 text-amber-500" />,
    "Done": <CheckCircle className="h-4 w-4 text-green-500" />,
    "Blocked": <AlertCircle className="h-4 w-4 text-red-500" />
  };

  // Priority icons mapping
  const priorityIcons = {
    "Low": <Flag className="h-4 w-4 text-blue-500" />,
    "Medium": <Flag className="h-4 w-4 text-amber-500" />,
    "High": <Flag className="h-4 w-4 text-red-500" />,
    "Urgent": <ArrowUpCircle className="h-4 w-4 text-red-600" />
  };

  // Calculate progress percentage based on time tracked vs estimate
  const progressPercentage = selectedTask.timeEstimate 
    ? Math.min(100, (selectedTask.timeTracked / selectedTask.timeEstimate) * 100) 
    : 0;

  // Format dates for better display
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!selectedTask.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(selectedTask.dueDate);
    return dueDate < today && selectedTask.status !== "Done";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md">
      {/* Header with status and actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            selectedTask.status === "Done" ? "bg-green-100 text-green-800" :
            selectedTask.status === "In Progress" ? "bg-amber-100 text-amber-800" :
            selectedTask.status === "Blocked" ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          }`}>
            {statusIcons[selectedTask.status]}
            <span className="ml-1.5">{selectedTask.status}</span>
          </div>

          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            selectedTask.priority === "High" || selectedTask.priority === "Urgent" 
              ? "bg-red-100 text-red-800" 
              : selectedTask.priority === "Medium" 
                ? "bg-amber-100 text-amber-800" 
                : "bg-blue-100 text-blue-800"
          }`}>
            {priorityIcons[selectedTask.priority]}
            <span className="ml-1.5">{selectedTask.priority} Priority</span>
          </div>
          
          {isOverdue() && (
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              <span>Overdue</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            onClick={handleAddComment}
          >
            <MessageSquare className="h-4 w-4 mr-1.5" /> Comment
          </button>
          <button
            className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-150"
            onClick={handleEditTask}
          >
            <Edit className="h-4 w-4 mr-1.5" /> Edit
          </button>
          <button
            className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors duration-150"
            onClick={() => handleDeleteTask(selectedTask.taskId)}
          >
            <Trash className="h-4 w-4 mr-1.5" /> Delete
          </button>
        </div>
      </div>

      {/* Task name - highlighted as the main element */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{selectedTask.taskName}</h2>
        
        {/* Assignees with improved avatar display */}
        <div className="flex items-center mt-3">
          <User className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm font-medium text-gray-500 mr-3">Assignees:</span>
          <div className="flex -space-x-2 overflow-hidden">
            {/* {selectedTask.assignees.map((assignee, index) => (
              <div key={index} className="relative z-0 hover:z-10 transition-transform hover:scale-110">
                <AssigneeAvatar name={assignee} />
              </div>
            ))} */}
            {(isMyTask ? [selectedTask.assignee] : selectedTask.assignees || [])
  .flat()
  .map((assignee, index) => (
    <div key={index} className="relative z-0 hover:z-10 transition-transform hover:scale-110">
      <AssigneeAvatar name={String(assignee)} />
    </div>
  ))}


          </div>
        </div>
      </div>

      {/* Task details in a card-like layout */}
      <div className="space-y-6">
        {/* Description */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <AlignLeft className="h-4 w-4 mr-2 text-gray-500" />
            Description
          </div>
          <p className="text-gray-700 whitespace-pre-line">{selectedTask.description || "No description provided."}</p>
        </div>

        {/* Time tracking with progress bar */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Timer className="h-4 w-4 mr-2 text-gray-500" />
            Time Tracking
          </div>
          
          <div className="mb-2 flex justify-between text-xs text-gray-500">
            <span>{selectedTask.timeTracked} hr spent</span>
            <span>{selectedTask.timeEstimate} hr estimated</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Dates in a grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              Start Date
            </div>
            <p className="text-gray-700">{formatDate(selectedTask.startDate)}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              Due Date
            </div>
            <p className={`${isOverdue() ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
              {formatDate(selectedTask.dueDate)}
              {isOverdue() && <span className="ml-2 text-xs">(overdue)</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
