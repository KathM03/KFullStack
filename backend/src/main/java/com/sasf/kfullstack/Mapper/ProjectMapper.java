package com.sasf.kfullstack.Mapper;

import org.springframework.stereotype.Component;

import com.sasf.kfullstack.DTO.ProjectRequestDTO;
import com.sasf.kfullstack.DTO.ProjectResponseDTO;
import com.sasf.kfullstack.Entity.Project;

@Component
public class ProjectMapper {

    private final UserMapper userMapper;

    public ProjectMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public ProjectResponseDTO toDTO(Project project) {
        if (project == null)
            return null;
        return ProjectResponseDTO.builder()
                .idProject(project.getProjectId())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus())
                .owner(userMapper.toResponseDTO(project.getOwner()))
                .createdAt(project.getCreatedAt())
                .build();
    }

    public ProjectRequestDTO toRequestDTO(Project project) {
        if (project == null)
            return null;
        return ProjectRequestDTO.builder()
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus())
                .build();
    }

    public Project toEntity(ProjectRequestDTO request) {
        if (request == null)
            return null;
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        return project;
    }
}
