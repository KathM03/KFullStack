package com.sasf.kfullstack.Service;

import java.util.List;


import com.sasf.kfullstack.DTO.ProjectRequestDTO;
import com.sasf.kfullstack.DTO.ProjectResponseDTO;

public interface IProjectService {

    public ProjectResponseDTO createProject(ProjectRequestDTO request, Long userId);

    public List<ProjectResponseDTO> getProjectsByUser(Long userId);

    public ProjectResponseDTO updateProject(Long userId, Long projectId, ProjectRequestDTO request);

    public void deleteProject(Long userId, Long projectId);

}
