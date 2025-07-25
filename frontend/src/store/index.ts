import apiService from "@/services/api";
import { Project, Task, TaskStatus, User } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  fetchProject: (id: string) => Promise<void>;
  createProject: (
    name: string,
    description?: string
  ) => Promise<Project | null>;
  updateProject: (
    id: string,
    name?: string,
    description?: string
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  clearError: () => void;
  setCurrentProject: (project: Project | null) => void;
}

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  availableUsers: User[];
  isLoading: boolean;
  error: string | null;
  statusFilter: TaskStatus | "ALL";
  sortByDueDate: "asc" | "desc" | null;
  fetchTasks: (projectId: string) => Promise<void>;
  createTask: (
    projectId: string,
    title: string,
    description?: string,
    dueDate?: string,
    assignedUserId?: string
  ) => Promise<Task | null>;
  updateTask: (
    projectId: string,
    taskId: string,
    data: Partial<Task>
  ) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
  updateTaskStatus: (
    projectId: string,
    taskId: string,
    status: TaskStatus
  ) => Promise<void>;
  fetchUsers: () => Promise<void>;
  setStatusFilter: (status: TaskStatus | "ALL") => void;
  setSortByDueDate: (sort: "asc" | "desc" | null) => void;
  clearError: () => void;
  applyFilters: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });
          try {
            const authResponse = await apiService.login({ email, password });

            // Después de obtener el token, obtener la información del usuario
            const user = await apiService.getCurrentUser();

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });

            return true;
          } catch (error: any) {
            set({
              error: error.message,
              isLoading: false,
              isAuthenticated: false,
            });
            return false;
          }
        },

        logout: () => {
          apiService.logout();
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        },

        getCurrentUser: async () => {
          if (!apiService.isAuthenticated()) {
            set({ isAuthenticated: false, user: null });
            return;
          }

          set({ isLoading: true });
          try {
            const user = await apiService.getCurrentUser();
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error: any) {
            set({
              error: error.message,
              isLoading: false,
              isAuthenticated: false,
              user: null,
            });
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);

export const useProjectStore = create<ProjectState>()(
  devtools((set, get) => ({
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null,

    fetchProjects: async () => {
      set({ isLoading: true, error: null });
      try {
        const projects = await apiService.getProjects();
        set({ projects, isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    fetchProject: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        const { projects } = get();

        // Si no hay proyectos cargados, cargarlos primero
        if (projects.length === 0) {
          await get().fetchProjects();
        }

        // Buscar el proyecto en la lista existente
        const updatedState = get();
        const project = updatedState.projects.find(
          p => p.id === id || p.idProject?.toString() === id
        );

        if (project) {
          set({ currentProject: project, isLoading: false });
        } else {
          set({
            error: 'Proyecto no encontrado',
            isLoading: false,
            currentProject: null
          });
        }
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    createProject: async (name: string, description?: string) => {
      set({ isLoading: true, error: null });
      try {
        const newProject = await apiService.createProject({
          name,
          description,
        });
        set((state) => ({
          projects: [...state.projects, newProject],
          isLoading: false,
        }));
        return newProject;
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        return null;
      }
    },

    updateProject: async (id: string, name?: string, description?: string) => {
      set({ isLoading: true, error: null });
      try {
        const updatedProject = await apiService.updateProject(id, {
          name,
          description,
        });
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? updatedProject : p
          ),
          currentProject:
            state.currentProject?.id === id
              ? updatedProject
              : state.currentProject,
          isLoading: false,
        }));
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    deleteProject: async (id: string) => {
      set({ isLoading: true, error: null });
      try {
        await apiService.deleteProject(id);
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProject:
            state.currentProject?.id === id ? null : state.currentProject,
          isLoading: false,
        }));
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    setCurrentProject: (project: Project | null) => {
      set({ currentProject: project });
    },

    clearError: () => set({ error: null }),
  }))
);

export const useTaskStore = create<TaskState>()(
  devtools((set, get) => ({
    tasks: [],
    filteredTasks: [],
    availableUsers: [],
    isLoading: false,
    error: null,
    statusFilter: "ALL",
    sortByDueDate: null,

    fetchTasks: async (projectId: string) => {
      set({ isLoading: true, error: null });
      try {
        const tasks = await apiService.getTasks(projectId);
        set({ tasks: tasks || [], isLoading: false });
        get().applyFilters();
      } catch (error: any) {
        set({ error: error.message, isLoading: false, tasks: [], filteredTasks: [] });
      }
    },

    createTask: async (
      projectId: string,
      title: string,
      description?: string,
      dueDate?: string,
      assignedUserId?: string
    ) => {
      set({ isLoading: true, error: null });
      try {
        const newTask = await apiService.createTask(projectId, {
          title,
          description,
          dueDate,
          assignedUserId,
          status: TaskStatus.PENDING,
        });
        set((state) => ({
          tasks: Array.isArray(state.tasks) ? [...state.tasks, newTask] : [newTask],
          isLoading: false,
        }));
        get().applyFilters();
        return newTask;
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        return null;
      }
    },

    updateTask: async (
      projectId: string,
      taskId: string,
      data: Partial<Task>
    ) => {
      set({ isLoading: true, error: null });
      try {
        const updatedTask = await apiService.updateTask(
          projectId,
          taskId,
          data
        );
        set((state) => ({
          tasks: Array.isArray(state.tasks)
            ? state.tasks.map((t) => {
              const tId = t.id || t.idTask?.toString() || '';
              return tId === taskId ? updatedTask : t;
            })
            : [updatedTask],
          isLoading: false,
        }));
        get().applyFilters();
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    deleteTask: async (projectId: string, taskId: string) => {
      set({ isLoading: true, error: null });
      try {
        await apiService.deleteTask(projectId, taskId);
        set((state) => ({
          tasks: Array.isArray(state.tasks)
            ? state.tasks.filter((t) => {
              const tId = t.id || t.idTask?.toString() || '';
              return tId !== taskId;
            })
            : [],
          isLoading: false,
        }));
        get().applyFilters();
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    updateTaskStatus: async (
      projectId: string,
      taskId: string,
      status: TaskStatus
    ) => {
      try {
        await get().updateTask(projectId, taskId, { status });
      } catch (error) {
        set({ error: (error as Error).message }); //Added recently, can be revomed before production
      }
    },

    fetchUsers: async () => {
      try {
        const users = await apiService.getUsers();
        set({ availableUsers: Array.isArray(users) ? users : [] });
      } catch (error: any) {
        // Si no hay endpoint de usuarios o falla, usar array vacío
        console.warn('No se pudieron cargar los usuarios:', error.message);
        set({ availableUsers: [] });
      }
    },

    setStatusFilter: (status: TaskStatus | "ALL") => {
      set({ statusFilter: status });
      get().applyFilters();
    },

    setSortByDueDate: (sort: "asc" | "desc" | null) => {
      set({ sortByDueDate: sort });
      get().applyFilters();
    },

    applyFilters: () => {
      const { tasks, statusFilter, sortByDueDate } = get();

      // Asegurar que tasks es un array
      if (!Array.isArray(tasks)) {
        set({ filteredTasks: [] });
        return;
      }

      let filtered = [...tasks];

      if (statusFilter !== "ALL") {
        filtered = filtered.filter((task) => task.status === statusFilter);
      }

      if (sortByDueDate) {
        filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;

          const dateA = new Date(a.dueDate).getTime();
          const dateB = new Date(b.dueDate).getTime();

          return sortByDueDate === "asc" ? dateA - dateB : dateB - dateA;
        });
      }

      set({ filteredTasks: filtered });
    },

    clearError: () => set({ error: null }),
  }))
);
