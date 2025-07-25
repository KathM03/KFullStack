"use client";

import { ClientAuthGuard } from "@/components/ClientAuthGuard";
import { Layout } from "@/components/Layout";
import { TaskList } from "@/components/tasks/TaskList";
import { Alert, Button } from "@/components/ui";
import { useProjectStore, useTaskStore } from "@/store";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    currentProject,
    isLoading,
    error,
    fetchProject,
    deleteProject,
    clearError,
  } = useProjectStore();

  const { tasks } = useTaskStore();

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading && !currentProject) {
    return (
      <ClientAuthGuard>
        <Layout>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse" />
              <div className="h-8 bg-gray-300 rounded w-64 animate-pulse" />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-2/3" />
              </div>
            </div>
          </div>
        </Layout>
      </ClientAuthGuard>
    );
  }

  if (error) {
    return (
      <ClientAuthGuard>
        <Layout>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>
            <Alert
              type="error"
              title="Error al cargar el proyecto"
              message={error}
              onClose={clearError}
            />
          </div>
        </Layout>
      </ClientAuthGuard>
    );
  }

  if (!currentProject) {
    return (
      <ClientAuthGuard>
        <Layout>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>
            <Alert
              type="error"
              title="Proyecto no encontrado"
              message="El proyecto que buscas no existe o no tienes permisos para verlo."
            />
          </div>
        </Layout>
      </ClientAuthGuard>
    );
  }

  return (
    <ClientAuthGuard>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentProject.name}
              </h1>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información del Proyecto
                </h3>

                {currentProject.description ? (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </h4>
                    <p className="text-gray-600">{currentProject.description}</p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-gray-500 italic">Sin descripción</p>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Creado: {formatDate(currentProject.createdAt)}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      Última actualización: {formatDate(currentProject.updatedAt || currentProject.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>ID del proyecto: {currentProject.id}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Estadísticas
                </h3>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {tasks.length}
                    </div>
                    <div className="text-sm text-gray-600">Tareas totales</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-lg font-semibold text-green-600">
                        {tasks.filter(
                          (task) => task.status === "DONE"
                        ).length}
                      </div>
                      <div className="text-xs text-green-700">Completadas</div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-3">
                      <div className="text-lg font-semibold text-yellow-600">
                        {tasks.filter(
                          (task) => task.status === "PENDING"
                        ).length}
                      </div>
                      <div className="text-xs text-yellow-700">Pendientes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TaskList projectId={projectId} />
        </div>
      </Layout>
    </ClientAuthGuard>
  );
}
