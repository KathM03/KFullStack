"use client";

import { ClientAuthGuard } from "@/components/ClientAuthGuard";
import { Layout } from "@/components/Layout";
import { EmptyState } from "@/components/ui";
import { useProjectStore } from "@/store";
import { AlertCircle, BarChart3, CheckCircle, FolderOpen } from "lucide-react";
import React from "react";

const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

const RecentProjects: React.FC = () => {
  const { projects, isLoading } = useProjectStore();

  const recentProjects = projects
    .slice()
    .sort(
      (a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt).getTime();
        return dateB - dateA;
      }
    )
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Proyectos Recientes
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-300 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Proyectos Recientes
      </h3>
      {recentProjects.length === 0 ? (
        <EmptyState
          title="No hay proyectos"
          description="Crea tu primer proyecto para comenzar"
          icon={<FolderOpen className="w-12 h-12" />}
        />
      ) : (
        <div className="space-y-3">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="font-medium text-gray-900">{project.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(project.updatedAt || project.createdAt).toLocaleDateString("es-ES")}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                {project.tasks?.length || 0} tareas
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function DashboardPage() {
  const {
    projects,
    fetchProjects,
    isLoading: projectsLoading,
  } = useProjectStore();

  React.useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const totalProjects = projects.length;
  const totalTasks = projects.reduce(
    (sum, project) => sum + (project.tasks?.length || 0),
    0
  );
  const completedTasks = projects.reduce(
    (sum, project) =>
      sum +
      (project.tasks?.filter((task) => task.status === "DONE").length || 0),
    0
  );
  const overdueTasks = projects.reduce(
    (sum, project) =>
      sum +
      (project.tasks?.filter(
        (task) =>
          task.dueDate &&
          new Date(task.dueDate) < new Date() &&
          task.status !== "DONE"
      ).length || 0),
    0
  );

  return (
    <ClientAuthGuard>
      <Layout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Resumen de tus proyectos y tareas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Proyectos Totales"
              value={totalProjects}
              icon={<FolderOpen className="w-6 h-6 text-blue-600" />}
              color="bg-blue-100"
            />
            <StatCard
              title="Tareas Totales"
              value={totalTasks}
              icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
              color="bg-purple-100"
            />
            <StatCard
              title="Tareas Completadas"
              value={completedTasks}
              icon={<CheckCircle className="w-6 h-6 text-green-600" />}
              color="bg-green-100"
            />
            <StatCard
              title="Tareas Vencidas"
              value={overdueTasks}
              icon={<AlertCircle className="w-6 h-6 text-red-600" />}
              color="bg-red-100"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <RecentProjects />
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Todos los Proyectos
                </h3>
                {projectsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-300 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <EmptyState
                    title="No tienes proyectos"
                    description="Crea tu primer proyecto para comenzar a gestionar tus tareas"
                    icon={<FolderOpen className="w-12 h-12" />}
                  />
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {project.name}
                          </h4>
                          {project.description && (
                            <p className="text-sm text-gray-500 line-clamp-1">
                              {project.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {project.tasks?.length || 0} tareas
                          </div>
                          <div className="text-xs text-gray-500">
                            {project.tasks?.filter(
                              (task) => task.status === "DONE"
                            ).length || 0}{" "}
                            completadas
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ClientAuthGuard>
  );
}
