import {
  ApiError,
  AuthResponse,
  CreateProjectData,
  CreateTaskData,
  LoginCredentials,
  Project,
  ProjectResponse,
  ProjectsResponse,
  SingleTaskResponse,
  Task,
  TaskResponse,
  UpdateProjectData,
  UpdateTaskData,
  User,
} from "@/types";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.API_URL || "http://localhost:8080/kfullstack";

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const params = new URLSearchParams();
      params.append("email", credentials.email);
      params.append("password", credentials.password);

      const response: AxiosResponse<AuthResponse> = await this.api.post(
        "/auth/login",
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { token } = response.data.data;
      this.setToken(token);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async getCurrentUser(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found");
      }

      // Decodificar el JWT para obtener la información del usuario
      const payload = JSON.parse(atob(token.split('.')[1]));

      // Crear un objeto User con la información del token
      const user: User = {
        id: payload.id?.toString() || '1',
        idUser: payload.id || 1,
        email: payload.sub || '',
        username: payload.sub?.split('@')[0] || 'Usuario',
        name: payload.sub?.split('@')[0] || 'Usuario',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return user;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      Cookies.set("token", token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || Cookies.get("token") || null;
    }
    return null;
  }

  clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      Cookies.remove("token");
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  async getProjects(): Promise<Project[]> {
    try {
      const response: AxiosResponse<ProjectsResponse> = await this.api.get(
        "/projects",
        {
          headers: {
            "accept": "*/*",
          },
        }
      );

      // Normalizar los datos para que coincidan con la interfaz Project esperada
      const normalizedProjects = response.data.data.map(project => ({
        id: project.idProject?.toString() || project.id || '',
        name: project.name,
        description: project.description,
        userId: project.owner?.idUser?.toString() || project.userId || '',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt || project.createdAt,
        tasks: project.tasks || [],
        // Mantener también las propiedades originales
        idProject: project.idProject,
        status: project.status,
        owner: project.owner,
      }));

      return normalizedProjects;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async createProject(data: CreateProjectData): Promise<Project> {
    try {
      const requestBody = {
        name: data.name,
        description: data.description || "",
      };

      const response: AxiosResponse<ProjectResponse> = await this.api.post(
        "/projects",
        requestBody,
        {
          headers: {
            "accept": "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      const project = response.data.data;

      // Normalizar los datos para que coincidan con la interfaz Project esperada
      const normalizedProject: Project = {
        id: project.idProject?.toString() || project.id || '',
        name: project.name,
        description: project.description,
        userId: project.owner?.idUser?.toString() || project.userId || '',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt || project.createdAt,
        tasks: project.tasks || [],
        // Mantener también las propiedades originales
        idProject: project.idProject,
        status: project.status,
        owner: project.owner,
      };

      return normalizedProject;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    try {
      const requestBody: any = {};
      if (data.name) {
        requestBody.name = data.name;
      }
      if (data.description !== undefined) {
        requestBody.description = data.description;
      }

      const response: AxiosResponse<ProjectResponse> = await this.api.put(
        `/projects/${id}`,
        requestBody,
        {
          headers: {
            "accept": "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      const project = response.data.data;

      // Normalizar los datos para que coincidan con la interfaz Project esperada
      const normalizedProject: Project = {
        id: project.idProject?.toString() || project.id || '',
        name: project.name,
        description: project.description,
        userId: project.owner?.idUser?.toString() || project.userId || '',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt || project.createdAt,
        tasks: project.tasks || [],
        // Mantener también las propiedades originales
        idProject: project.idProject,
        status: project.status,
        owner: project.owner,
      };

      return normalizedProject;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteProject(id: string): Promise<void> {
    try {
      await this.api.delete(`/projects/${id}`, {
        headers: {
          "accept": "*/*",
        },
      });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getTasks(projectId?: string): Promise<Task[]> {
    try {
      const response: AxiosResponse<TaskResponse> = await this.api.get(
        `/tasks`,
        {
          headers: {
            "accept": "*/*",
          },
        }
      );

      // Asegurar que response.data.data es un array
      const taskData = response.data.data;
      if (!Array.isArray(taskData)) {
        console.warn('La respuesta de tareas no es un array:', taskData);
        return [];
      }

      // Obtener usuarios para mapear asignaciones
      let users: User[] = [];
      try {
        users = await this.getUsers();
      } catch (error) {
        console.warn('No se pudieron cargar usuarios para mapear asignaciones');
      }

      // Filtrar las tareas por projectId si se proporciona
      let tasks = taskData.map((task: any) => {
        // Buscar el usuario asignado
        const assignedUser = task.assignedTo
          ? users.find(u => (u.idUser || u.id) === task.assignedTo)
          : undefined;

        return {
          id: task.idTask?.toString() || '',
          idTask: task.idTask,
          title: task.title,
          description: task.description,
          status: task.status,
          projectId: task.projectId?.toString() || '',
          assignedTo: task.assignedTo,
          assignedUserId: task.assignedTo?.toString(),
          assignedUser: assignedUser,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Task;
      });

      // Si se proporciona projectId, filtrar las tareas
      if (projectId) {
        tasks = tasks.filter((task: Task) =>
          task.projectId === projectId ||
          task.projectId === parseInt(projectId).toString()
        );
      }

      return tasks;
    } catch (error: any) {
      console.error('Error al obtener tareas:', error);
      throw this.handleError(error);
    }
  }

  async createTask(projectId: string, data: CreateTaskData): Promise<Task> {
    try {
      const requestBody = {
        title: data.title,
        description: data.description || "",
        status: data.status || "PENDING",
        assignedTo: data.assignedUserId ? parseInt(data.assignedUserId) : undefined,
        projectId: parseInt(projectId)
      };

      const response: AxiosResponse<SingleTaskResponse> = await this.api.post(
        `/tasks`,
        requestBody,
        {
          headers: {
            "accept": "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      const task = response.data.data;

      // Obtener información del usuario asignado si existe
      let assignedUser: User | undefined;
      if (task.assignedTo) {
        try {
          const users = await this.getUsers();
          assignedUser = users.find(u => (u.idUser || u.id) === task.assignedTo);
        } catch (error) {
          console.warn('No se pudo obtener información del usuario asignado');
        }
      }

      // Normalizar los datos para que coincidan con la interfaz Task esperada
      const normalizedTask: Task = {
        id: task.idTask?.toString() || '',
        idTask: task.idTask,
        title: task.title,
        description: task.description,
        status: task.status,
        projectId: task.projectId?.toString() || '',
        assignedTo: task.assignedTo,
        assignedUserId: task.assignedTo?.toString(),
        assignedUser: assignedUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return normalizedTask;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updateTask(
    projectId: string,
    taskId: string,
    data: UpdateTaskData
  ): Promise<Task> {
    try {
      const requestBody = {
        title: data.title,
        description: data.description,
        status: data.status,
        assignedTo: data.assignedUserId ? parseInt(data.assignedUserId) : undefined,
        projectId: parseInt(projectId)
      };

      const response: AxiosResponse<SingleTaskResponse> = await this.api.put(
        `/tasks/${taskId}`,
        requestBody,
        {
          headers: {
            "accept": "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      const task = response.data.data;

      // Obtener información del usuario asignado si existe
      let assignedUser: User | undefined;
      if (task.assignedTo) {
        try {
          const users = await this.getUsers();
          assignedUser = users.find(u => (u.idUser || u.id) === task.assignedTo);
        } catch (error) {
          console.warn('No se pudo obtener información del usuario asignado');
        }
      }

      // Normalizar los datos para que coincidan con la interfaz Task esperada
      const normalizedTask: Task = {
        id: task.idTask?.toString() || '',
        idTask: task.idTask,
        title: task.title,
        description: task.description,
        status: task.status,
        projectId: task.projectId?.toString() || '',
        assignedTo: task.assignedTo,
        assignedUserId: task.assignedTo?.toString(),
        assignedUser: assignedUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return normalizedTask;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    try {
      await this.api.delete(`/tasks/${taskId}`, {
        headers: {
          "accept": "*/*",
        },
      });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const response: AxiosResponse<{
        statusCode: number;
        status: string;
        message: string;
        data: User[];
      }> = await this.api.get("/users", {
        headers: {
          "accept": "*/*",
        },
      });

      // Normalizar los datos de usuarios
      const users = response.data.data.map(user => ({
        id: user.idUser?.toString() || '',
        idUser: user.idUser,
        username: user.username,
        email: user.email,
        name: user.username || user.email?.split('@')[0] || 'Usuario',
        role: user.role,
        status: user.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      return Array.isArray(users) ? users : [];
    } catch (error: any) {
      console.warn('No se pudieron cargar los usuarios:', error.message);
      return []; // Devolver array vacío en caso de error
    }
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || "Error del servidor",
        status: error.response.status,
      };
    } else if (error.request) {
      return {
        message: "Error de conexión con el servidor",
        status: 0,
      };
    } else {
      return {
        message: error.message || "Error desconocido",
        status: 0,
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;
