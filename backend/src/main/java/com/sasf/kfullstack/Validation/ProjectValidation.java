package com.sasf.kfullstack.Validation;

import org.springframework.stereotype.Component;

import com.sasf.kfullstack.DTO.ProjectRequestDTO;
import com.sasf.kfullstack.Entity.Project;

@Component
public class ProjectValidation {
    public void updateProjectFields(Project project, ProjectRequestDTO request) {
        if (request.getName() != null && !request.getName().isBlank()) {
            project.setName(request.getName().trim());
        }

        if (request.getDescription() != null && !request.getDescription().isBlank()) {
            project.setDescription(request.getDescription().trim());
        }

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            project.setStatus(request.getStatus().trim());
        }
    }
}
