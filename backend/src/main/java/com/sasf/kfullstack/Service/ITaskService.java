package com.sasf.kfullstack.Service;

import java.util.List;

import com.sasf.kfullstack.DTO.TaskRequestDTO;
import com.sasf.kfullstack.DTO.TaskResponseDTO;

public interface ITaskService {

    public TaskResponseDTO createTask(Long userId, TaskRequestDTO request);

    public List<TaskResponseDTO> getTasksByUser(Long userId);

    public List<TaskResponseDTO> getTasksByProject(Long projectId, Long userId);

    public TaskResponseDTO updateTask(Long taskId, Long userId, TaskRequestDTO request);

    public void deleteTask(Long taskId, Long userId);

}
