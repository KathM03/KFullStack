package com.sasf.kfullstack.Service.Impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sasf.kfullstack.Constants.StatusConstants;
import com.sasf.kfullstack.DTO.ProjectRequestDTO;
import com.sasf.kfullstack.DTO.ProjectResponseDTO;
import com.sasf.kfullstack.Entity.Project;
import com.sasf.kfullstack.Entity.User;
import com.sasf.kfullstack.Exception.AccessDeniedException;
import com.sasf.kfullstack.Exception.ResourceNotFoundException;
import com.sasf.kfullstack.Mapper.ProjectMapper;
import com.sasf.kfullstack.Repository.ProjectRepository;
import com.sasf.kfullstack.Repository.UserRepository;
import com.sasf.kfullstack.Service.IProjectService;
import com.sasf.kfullstack.Validation.ProjectValidation;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService implements IProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;
    private final ProjectValidation projectValidation;

    @Override
    public ProjectResponseDTO createProject(ProjectRequestDTO request, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User not found with id: " + userId));
        Project project = projectMapper.toEntity(request);
        project.setOwner(user);
        project.setCreatedAt(LocalDateTime.now());
        project.setStatus(StatusConstants.ACTIVE);
        Project savedProject = projectRepository.save(project);
        return projectMapper.toDTO(savedProject);
    }

    @Override
    public List<ProjectResponseDTO> getProjectsByUser(Long userId) {
        return projectRepository.findByOwnerUserId(userId)
                .stream()
                .map(projectMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponseDTO updateProject(Long userId, Long projectId, ProjectRequestDTO request) {
        Project project = projectRepository.findById(projectId)
                .filter(p -> p.getOwner().getUserId().equals(userId))
                .orElseThrow(() -> new AccessDeniedException("Project not found or not authorized"));

        projectValidation.updateProjectFields(project, request);
        return projectMapper.toDTO(projectRepository.save(project));
    }

    @Override
    public void deleteProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
        .filter(p -> p.getOwner().getUserId().equals(userId))
        .orElseThrow(() -> new AccessDeniedException("Project not found or not authorized"));
        project.setStatus(StatusConstants.DELETE);
        this.updateProject(userId, projectId, projectMapper.toRequestDTO(project));
    }
}
