package com.sasf.kfullstack.Controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sasf.kfullstack.DTO.ApiResponse;
import com.sasf.kfullstack.DTO.TaskRequestDTO;
import com.sasf.kfullstack.DTO.TaskResponseDTO;
import com.sasf.kfullstack.Service.ITaskService;
import com.sasf.kfullstack.Util.JwtUtil;
import com.sasf.kfullstack.Util.ResponseUtil;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks")
public class TaskController {

    private final ITaskService taskService;

    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponseDTO>> createTask(
            HttpServletRequest request,
            @RequestBody TaskRequestDTO taskRequestDTO) {
        Long userId = jwtUtil.extractUserIdFromCurrentToken(request);
        TaskResponseDTO createdTask = taskService.createTask(userId, taskRequestDTO);
        return ResponseUtil.ok("Task created successfully", createdTask);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getTasksByUser(HttpServletRequest request) {
        Long userId = jwtUtil.extractUserIdFromCurrentToken(request);
        List<TaskResponseDTO> tasks = taskService.getTasksByUser(userId);
        return ResponseUtil.ok(null, tasks);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<ApiResponse<List<TaskResponseDTO>>> getTasksByProject(
            HttpServletRequest request,
            @PathVariable Long projectId) {
        Long userId = jwtUtil.extractUserIdFromCurrentToken(request);
        List<TaskResponseDTO> tasks = taskService.getTasksByProject(projectId, userId);
        return ResponseUtil.ok(null, tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponseDTO>> updateTask(
            HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody TaskRequestDTO taskRequestDTO) {
        Long userId = jwtUtil.extractUserIdFromCurrentToken(request);
        TaskResponseDTO updatedTask = taskService.updateTask(id, userId, taskRequestDTO);
        return ResponseUtil.ok("Task updated successfully", updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            HttpServletRequest request,
            @PathVariable Long id) {
        Long userId = jwtUtil.extractUserIdFromCurrentToken(request);
        taskService.deleteTask(id, userId);
        return ResponseUtil.ok("Task deleted successfully", null);
    }
}
