import {
  Alert,
  Button,
  EmptyState,
  Input,
  LoadingSpinner,
  Modal,
  Textarea,
} from "@/components/ui";
import { useProjectStore } from "@/store";
import { Project } from "@/types";
import { Calendar, Edit, FolderOpen, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link
            href={`/projects/${project.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {project.name}
          </Link>
          {project.description && (
            <p className="text-gray-600 mt-2 line-clamp-2">
              {project.description}
            </p>
          )}
          <div className="flex items-center text-sm text-gray-500 mt-4">
            <Calendar className="w-4 h-4 mr-1" />
            Creado el {formatDate(project.createdAt)}
          </div>
          {project.tasks && (
            <div className="text-sm text-gray-500 mt-1">
              {project.tasks.length} tarea
              {project.tasks.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(project)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(project.id || project.idProject?.toString() || '')}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface ProjectFormProps {
  project?: Project;
  onSubmit: (name: string, description?: string) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string } = {};
    if (!name.trim()) {
      newErrors.name = "El nombre del proyecto es requerido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmit(name.trim(), description.trim() || undefined);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Nombre del proyecto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        placeholder="Ingresa el nombre del proyecto"
        required
      />

      <Textarea
        label="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe tu proyecto..."
        rows={3}
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
          {project ? "Actualizar" : "Crear"} Proyecto
        </Button>
      </div>
    </form>
  );
};

export const ProjectList: React.FC = () => {
  const {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    clearError,
  } = useProjectStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null
  );

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (name: string, description?: string) => {
    try {
      const newProject = await createProject(name, description);
      if (newProject) {
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleEditProject = async (name: string, description?: string) => {
    if (editingProject) {
      await updateProject(editingProject.id || editingProject.idProject?.toString() || '', name, description);
      setEditingProject(null);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer."
      )
    ) {
      setDeletingProjectId(id);
      await deleteProject(id);
      setDeletingProjectId(null);
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mis Proyectos</h1>
          <div className="w-32 h-10 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
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
        <h1 className="text-2xl font-bold text-gray-900">Mis Proyectos</h1>
        <Button onClick={() => {
          setShowCreateModal(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={clearError} />}

      {projects.length === 0 && !isLoading ? (
        <EmptyState
          icon={<FolderOpen className="w-16 h-16" />}
          title="No tienes proyectos aún"
          description="Crea tu primer proyecto para comenzar a organizar tus tareas"
          action={
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear mi primer proyecto
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="relative">
              {deletingProjectId === project.id && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <LoadingSpinner />
                </div>
              )}
              <ProjectCard
                project={project}
                onEdit={setEditingProject}
                onDelete={handleDeleteProject}
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
        }}
        title="Crear Nuevo Proyecto"
      >
        <ProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => {
            setShowCreateModal(false);
          }}
          isLoading={isLoading}
        />
      </Modal>

      <Modal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title="Editar Proyecto"
      >
        {editingProject && (
          <ProjectForm
            project={editingProject}
            onSubmit={handleEditProject}
            onCancel={() => setEditingProject(null)}
            isLoading={isLoading}
          />
        )}
      </Modal>
    </div>
  );
};
