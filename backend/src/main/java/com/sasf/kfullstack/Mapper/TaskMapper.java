package com.sasf.kfullstack.Mapper;

import org.springframework.stereotype.Component;
import com.sasf.kfullstack.DTO.TaskRequestDTO;
import com.sasf.kfullstack.DTO.TaskResponseDTO;
import com.sasf.kfullstack.Entity.Project;
import com.sasf.kfullstack.Entity.Task;
import com.sasf.kfullstack.Entity.User;

@Component
public class TaskMapper {

    public TaskResponseDTO toDTO(Task task) {
        if (task == null) return null;

        TaskResponseDTO request = new TaskResponseDTO();
        request.setIdTask(task.getTaskId());
        request.setTitle(task.getTitle());
        request.setDescription(task.getDescription());
        request.setStatus(task.getStatus() != null ? task.getStatus().name() : null);
        request.setAssignedTo(task.getAssignedTo() != null ? task.getAssignedTo().getUserId() : null);
        request.setProjectId(task.getProject() != null ? task.getProject().getProjectId() : null);

        return request;
    }

    public Task toEntity(TaskRequestDTO request, User assignedToUser, Project project) {
        if (request == null) return null;

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setAssignedTo(assignedToUser);
        task.setProject(project);

        return task;
    }
}


