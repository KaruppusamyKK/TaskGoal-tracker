const API_BASE_URL = "http://localhost:8080";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/authenticate`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  GET_EMPLOYEES: `${API_BASE_URL}/api/employee/getEmployees`,
  SAVE_TASK: `${API_BASE_URL}/api/task/createTask`,
  LIST_TASKS : `${API_BASE_URL}/api/task/listTasks`,
  LIST_TASKS_BY_USER : `${API_BASE_URL}/api/task/listTasksByUser`,
  UPDATE_TASK : `${API_BASE_URL}/api/task/updateTaskDetails`,
  DELETE_TASK : `${API_BASE_URL}/api/task/deleteTaskById`,
  LIST_CHAT : `${API_BASE_URL}/api/chat/getChatsByTaskId`,
  UPLOAD_ATTACHMENT : `${API_BASE_URL}/upload/attachment`,
  UPDATE_ASSIGNEE: `${API_BASE_URL}/api/task/updateAssignee`,
  FETCH_NOTIFICATIONS : `${API_BASE_URL}/api/notify/getNotifications`,
  FETCH_NOTIFICATION_COUNT : `${API_BASE_URL}/api/notify/getNotificationCount`,
  SAVE_NOTIFICATION_COUNT : `${API_BASE_URL}/api/notify/saveNotificationCount`,
  CLEAR_NOTIFICATION_COUNT : `${API_BASE_URL}/api/notify/clearNotificationCount`,
  DELETE_NOTIFICATION : `${API_BASE_URL}/api/notify/deleteNotification`,
  CREATE_PROJECT : `${API_BASE_URL}/api/project/createProject`,
  GET_PROJECTS : `${API_BASE_URL}/api/project/listAllProjects`,
  UPDATE_PROJECT : `${API_BASE_URL}/api/project/updateProjectDetails`,


};
