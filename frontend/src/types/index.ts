export interface User {
  idUser?: number;
  id?: string;
  username?: string;
  email: string;
  name?: string;
  role: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  idProject?: number;
  id?: string;
  name: string;
  description?: string;
  status?: string;
  userId?: string;
  owner?: User;
  createdAt: string;
  updatedAt?: string;
  tasks?: Task[];
}

export interface Task {
  idTask?: number;
  id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate?: string;
  projectId: string | number;
  assignedTo?: number;
  assignedUserId?: string;
  assignedUser?: User;
  createdAt?: string;
  updatedAt?: string;
}

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    token: string;
  };
}

export interface ProjectResponse {
  statusCode: number;
  status: string;
  message: string;
  data: Project;
}

export interface ProjectsResponse {
  statusCode: number;
  status: string;
  message: string;
  data: Project[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  assignedUserId?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string;
  assignedUserId?: string;
}

export interface TaskResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    idTask: number;
    title: string;
    description?: string;
    assignedTo?: number;
    projectId: number;
    status: TaskStatus;
  }[];
}

export interface SingleTaskResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    idTask: number;
    title: string;
    description?: string;
    assignedTo?: number;
    projectId: number;
    status: TaskStatus;
  };
}

export interface ApiError {
  message: string;
  status: number;
}
