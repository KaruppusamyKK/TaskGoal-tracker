import axios from 'axios';
import { API_ENDPOINTS } from './ApiEndpoints';

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message;
    if (message?.toLowerCase() === "jwt token expired") {
      localStorage.removeItem("jwtToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const ApiService = {
  registerUser: (credentials) => api.post(API_ENDPOINTS.REGISTER, credentials),
  authenticateUser: (credentials) => api.post(API_ENDPOINTS.LOGIN, credentials),
  getEmployees: () => api.get(API_ENDPOINTS.GET_EMPLOYEES),
  saveTask: (task) => api.post(API_ENDPOINTS.SAVE_TASK, task),
  getTasks: () => api.get(API_ENDPOINTS.LIST_TASKS),
  listTasksByUser: (username) => api.get(`${API_ENDPOINTS.LIST_TASKS_BY_USER}?username=${username}`),
  updateTask: (task, taskId) => api.post(API_ENDPOINTS.UPDATE_TASK, task, { params: { taskId } }),
  deleteTask: (request) => api.post(API_ENDPOINTS.DELETE_TASK, request),
  fetchChats: (taskId) => api.get(`${API_ENDPOINTS.LIST_CHAT}?taskId=${taskId}`),
  uploadAttachment: (data) => api.post(API_ENDPOINTS.UPLOAD_ATTACHMENT, data),
  changeAssigneeStatus: (task) => api.post(API_ENDPOINTS.UPDATE_ASSIGNEE, task),
  fetchNotifications: (user) => api.get(`${API_ENDPOINTS.FETCH_NOTIFICATIONS}?user=${user}`),
  fetchNotificationsCount: (user) => api.get(`${API_ENDPOINTS.FETCH_NOTIFICATION_COUNT}?user=${user}`),
  saveNotificationsCount: (user) => api.get(`${API_ENDPOINTS.SAVE_NOTIFICATION_COUNT}?user=${user}`),
  clearNotificationsCount: (user) => api.post(`${API_ENDPOINTS.CLEAR_NOTIFICATION_COUNT}?user=${user}`, {}),
  deleteNotification: (notificationId) => api.post(`${API_ENDPOINTS.DELETE_NOTIFICATION}?notificationId=${notificationId}`, {}),
  createProject: (projectRequest) => api.post(API_ENDPOINTS.CREATE_PROJECT, projectRequest),
  getProjects: () => api.get(API_ENDPOINTS.GET_PROJECTS),
  updateProject: (project, projectId) => api.post(API_ENDPOINTS.UPDATE_PROJECT, project, { params: { projectId } }),
};
