import {
  Alert,
  Button,
  EmptyState,
  Input,
  LoadingSpinner,
  Modal,
  Select,
  Textarea,
} from "@/components/ui";
import { useAuthStore, useTaskStore } from "@/store";
import { Task, TaskStatus, User } from "@/types";
import {
  Calendar,
  Edit,
  Filter,
  Plus,
  SortAsc,
  SortDesc,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case TaskStatus.DONE:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== TaskStatus.DONE;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${isOverdue ? "border-red-300" : "border-gray-200"
        }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex-1">{task.title}</h3>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id || task.idTask?.toString() || '')}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-3">
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task.id || task.idTask?.toString() || '', e.target.value as TaskStatus)
          }
          className={`text-xs px-2 py-1 rounded-full border-0 ${getStatusColor(
            task.status
          )}`}
        >
          <option value={TaskStatus.PENDING}>Pendiente</option>
          <option value={TaskStatus.IN_PROGRESS}>En Progreso</option>
          <option value={TaskStatus.DONE}>Completada</option>
        </select>

        {task.dueDate && (
          <div
            className={`flex items-center text-xs ${isOverdue ? "text-red-600" : "text-gray-500"
              }`}
          >
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(task.dueDate)}
            {isOverdue && <span className="ml-1 font-medium">(Vencida)</span>}
          </div>
        )}
      </div>

      {task.assignedUser && (
        <div className="flex items-center text-xs text-gray-500">
          <UserIcon className="w-3 h-3 mr-1" />
          Asignada a: {task.assignedUser.name || task.assignedUser.email}
        </div>
      )}
    </div>
  );
};

interface TaskFormProps {
  task?: Task;
  projectId: string;
  availableUsers: User[];
  onSubmit: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    assignedUserId?: string;
  }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  availableUsers,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const { user } = useAuthStore();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );
  const [assignedUserId, setAssignedUserId] = useState(
    task?.assignedUserId || ""
  );
  const [errors, setErrors] = useState<{ title?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = "El título de la tarea es requerido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Si no se seleccionó ningún usuario, asignar al usuario actual
    const finalAssignedUserId = assignedUserId || (user?.id || user?.idUser?.toString()) || undefined;

    setErrors({});
    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      assignedUserId: finalAssignedUserId,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Título de la tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
        placeholder="Ingresa el título de la tarea"
        required
      />

      <Textarea
        label="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe la tarea..."
        rows={3}
      />

      <Input
        label="Fecha de vencimiento (opcional)"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <Select
        label="Asignar a usuario (opcional)"
        value={assignedUserId}
        onChange={(e) => setAssignedUserId(e.target.value)}
        options={[
          {
            value: "",
            label: user
              ? `Sin asignar (se asignará a ${user.name || user.username || user.email})`
              : "Sin asignar"
          },
          ...((availableUsers && Array.isArray(availableUsers) ? availableUsers : []).map((availableUser) => ({
            value: availableUser.id || availableUser.idUser?.toString() || '',
            label: availableUser.name || availableUser.username || availableUser.email,
          }))),
        ]}
      />

      <div className="flex justify-end space-x-3 mt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" loading={isLoading} disabled={isLoading}>
          {task ? "Actualizar" : "Crear"} Tarea
        </Button>
      </div>
    </form>
  );
};

interface TaskFiltersProps {
  statusFilter: TaskStatus | "ALL";
  sortByDueDate: "asc" | "desc" | null;
  onStatusFilterChange: (filter: TaskStatus | "ALL") => void;
  onSortChange: (sort: "asc" | "desc" | null) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  statusFilter,
  sortByDueDate,
  onStatusFilterChange,
  onSortChange,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filtros:</span>
        </div>

        <Select
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as TaskStatus | "ALL")
          }
          options={[
            { value: "ALL", label: "Todos los estados" },
            { value: TaskStatus.PENDING, label: "Pendientes" },
            { value: TaskStatus.IN_PROGRESS, label: "En Progreso" },
            { value: TaskStatus.DONE, label: "Completadas" },
          ]}
          className="w-auto min-w-[150px]"
        />

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Ordenar por fecha:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onSortChange(sortByDueDate === "asc" ? "desc" : "asc")
            }
            className={sortByDueDate ? "text-blue-600" : "text-gray-400"}
          >
            {sortByDueDate === "asc" ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>
          {sortByDueDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSortChange(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

interface TaskListProps {
  projectId: string;
}

export const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  const {
    filteredTasks,
    availableUsers,
    isLoading,
    error,
    statusFilter,
    sortByDueDate,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    fetchUsers,
    setStatusFilter,
    setSortByDueDate,
    clearError,
  } = useTaskStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar tareas del proyecto
        await fetchTasks(projectId);

        // Cargar usuarios de forma opcional
        try {
          await fetchUsers();
        } catch (err) {
          console.warn('No se pudieron cargar usuarios:', err);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    loadData();
  }, [projectId, fetchTasks, fetchUsers]);

  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    dueDate?: string;
    assignedUserId?: string;
  }) => {
    const newTask = await createTask(
      projectId,
      data.title,
      data.description,
      data.dueDate,
      data.assignedUserId
    );
    if (newTask) {
      setShowCreateModal(false);
    }
  };

  const handleEditTask = async (data: {
    title: string;
    description?: string;
    dueDate?: string;
    assignedUserId?: string;
  }) => {
    if (editingTask) {
      await updateTask(projectId, editingTask.id || editingTask.idTask?.toString() || '', data);
      setEditingTask(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      setDeletingTaskId(taskId);
      await deleteTask(projectId, taskId);
      setDeletingTaskId(null);
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    await updateTaskStatus(projectId, taskId, status);
  };

  if (isLoading && (!filteredTasks || filteredTasks.length === 0)) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Tareas</h2>
          <div className="w-32 h-10 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-300 rounded w-full mb-2" />
                <div className="h-3 bg-gray-300 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Tareas del Proyecto
        </h2>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={clearError} />}

      <TaskFilters
        statusFilter={statusFilter}
        sortByDueDate={sortByDueDate}
        onStatusFilterChange={setStatusFilter}
        onSortChange={setSortByDueDate}
      />

      {(!filteredTasks || filteredTasks.length === 0) && !isLoading ? (
        <EmptyState
          icon={<Plus className="w-16 h-16" />}
          title="No hay tareas"
          description="Crea tu primera tarea para este proyecto"
          action={
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear primera tarea
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(filteredTasks || []).map((task) => (
            <div key={task.id || task.idTask?.toString() || Math.random()} className="relative">
              {deletingTaskId === (task.id || task.idTask?.toString()) && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                  <LoadingSpinner />
                </div>
              )}
              <TaskCard
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nueva Tarea"
        maxWidth="md"
      >
        <TaskForm
          projectId={projectId}
          availableUsers={availableUsers}
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateModal(false)}
          isLoading={isLoading}
        />
      </Modal>

      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Editar Tarea"
        maxWidth="md"
      >
        {editingTask && (
          <TaskForm
            task={editingTask}
            projectId={projectId}
            availableUsers={availableUsers}
            onSubmit={handleEditTask}
            onCancel={() => setEditingTask(null)}
            isLoading={isLoading}
          />
        )}
      </Modal>
    </div>
  );
};
