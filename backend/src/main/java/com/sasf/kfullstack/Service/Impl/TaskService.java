package com.sasf.kfullstack.Service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sasf.kfullstack.Constants.StatusConstants;
import com.sasf.kfullstack.DTO.TaskRequestDTO;
import com.sasf.kfullstack.DTO.TaskResponseDTO;
import com.sasf.kfullstack.Entity.Project;
import com.sasf.kfullstack.Entity.Task;
import com.sasf.kfullstack.Entity.User;
import com.sasf.kfullstack.Exception.AccessDeniedException;
import com.sasf.kfullstack.Exception.ResourceNotFoundException;
import com.sasf.kfullstack.Mapper.TaskMapper;
import com.sasf.kfullstack.Repository.ProjectRepository;
import com.sasf.kfullstack.Repository.TaskRepository;
import com.sasf.kfullstack.Repository.UserRepository;
import com.sasf.kfullstack.Service.ITaskService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService implements ITaskService {

        private final TaskRepository taskRepository;

        private final ProjectRepository projectRepository;

        private final UserRepository userRepository;

        private final TaskMapper taskMapper;

        @Override
        public TaskResponseDTO createTask(Long userId, TaskRequestDTO request) {
                User currentUser = userRepository.findById(userId)
                                .filter(user -> StatusConstants.GENERIC_STATUS.contains(user.getStatus()))
                                .orElseThrow(
                                                () -> new ResourceNotFoundException("User not found"));

                Project project = projectRepository.findById(request.getProjectId())
                                .filter(p -> p.getOwner().getUserId().equals(currentUser.getUserId()))
                                .filter(p -> !p.getStatus().equals(StatusConstants.DELETE))
                                .orElseThrow(
                                                () -> new AccessDeniedException("Project not found or not authorized"));

                User assignedUser = userRepository.findById(request.getAssignedTo())
                                .filter(user -> StatusConstants.GENERIC_STATUS.contains(user.getStatus()))
                                .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

                Task task = taskMapper.toEntity(request, assignedUser, project);
                Task savedTask = taskRepository.save(task);

                return taskMapper.toDTO(savedTask);
        }

        @Override
        public List<TaskResponseDTO> getTasksByUser(Long userId) {
                User user = userRepository.findById(userId)
                                .filter(u -> StatusConstants.GENERIC_STATUS.contains(u.getStatus()))
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<Task> tasks = taskRepository.findByAssignedToUserIdAndStatusIn(user.getUserId(),
                                StatusConstants.TASK_STATUS);
                return tasks.stream()
                                .map(taskMapper::toDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public List<TaskResponseDTO> getTasksByProject(Long projectId, Long userId) {
                Project project = projectRepository.findById(projectId)
                                .filter(p -> p.getOwner().getUserId().equals(userId))
                                .filter(p -> !p.getStatus().equals(StatusConstants.DELETE))
                                .orElseThrow(
                                                () -> new ResourceNotFoundException(
                                                                "Project not found or not authorized"));
                List<Task> tasks = taskRepository.findByProjectProjectIdAndStatusIn(project.getProjectId(),
                                StatusConstants.TASK_STATUS);
                return tasks.stream()
                                .map(taskMapper::toDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public TaskResponseDTO updateTask(Long taskId, Long userId, TaskRequestDTO request) {
                Task task = taskRepository.findById(taskId)
                                .filter(t -> !t.getStatus().equals(StatusConstants.DELETE))
                                .filter(t -> t.getProject().getOwner().getUserId().equals(userId))
                                .orElseThrow(() -> new AccessDeniedException("Task not found or not authorized"));

                User assignedUser = null;
                if (request.getAssignedTo() != null && request.getAssignedTo() > 0) {
                        assignedUser = userRepository.findById(request.getAssignedTo())
                                        .filter(user -> StatusConstants.GENERIC_STATUS.contains(user.getStatus()))
                                        .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));
                }

                if (request.getTitle() != null && !request.getTitle().isEmpty())
                        task.setTitle(request.getTitle());
                if (request.getDescription() != null && !request.getDescription().isEmpty())
                        task.setDescription(request.getDescription());
                if (request.getStatus() != null)
                        task.setStatus(request.getStatus());
                if (request.getAssignedTo() != null)
                        task.setAssignedTo(assignedUser);

                Task updatedTask = taskRepository.save(task);
                return taskMapper.toDTO(updatedTask);
        }

        @Override
        public void deleteTask(Long taskId, Long userId) {
                Task task = taskRepository.findById(taskId)
                                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
                if (!task.getProject().getOwner().getUserId().equals(userId)) {
                        throw new AccessDeniedException("Not authorized to delete this task");
                }

                taskRepository.delete(task);
        }
}
