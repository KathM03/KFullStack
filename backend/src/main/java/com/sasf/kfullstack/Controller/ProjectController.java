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
import com.sasf.kfullstack.DTO.ProjectRequestDTO;
import com.sasf.kfullstack.DTO.ProjectResponseDTO;
import com.sasf.kfullstack.Service.IProjectService;
import com.sasf.kfullstack.Util.JwtUtil;
import com.sasf.kfullstack.Util.ResponseUtil;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
@Tag(name = "Projects")
public class ProjectController {

    private final IProjectService projectService;

    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponseDTO>> createProject(
            HttpServletRequest request,
            @Valid @RequestBody ProjectRequestDTO projectRequest) {
        Long userId = jwtUtil.extractUserIdFromCurrentToken(request);
        ProjectResponseDTO createdProject = projectService.createProject(projectRequest, userId);
        return ResponseUtil.created("Project created successfully", createdProject);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponseDTO>>> getUserProjects(HttpServletRequest request) {
        Long userId = jwtUtil.extractUserIdFromCurrentToken(request);
        List<ProjectResponseDTO> projects = projectService.getProjectsByUser(userId);
        return ResponseUtil.ok(null, projects);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponseDTO>> updateProject(HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody ProjectRequestDTO projectRequestDTO) {
        Long userId = jwtUtil.extractUserIdFromCurrentToken(request);

        ProjectResponseDTO updatedProject = projectService.updateProject(userId, id, projectRequestDTO);
        return ResponseUtil.ok("Project updated successfully", updatedProject);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            HttpServletRequest request,
            @PathVariable Long id) {
        Long userId = jwtUtil.extractUserIdFromCurrentToken(request);
        projectService.deleteProject(id, userId);
        return ResponseUtil.ok(null, null);
    }
}
