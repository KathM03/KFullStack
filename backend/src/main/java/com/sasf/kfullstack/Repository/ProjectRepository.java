package com.sasf.kfullstack.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sasf.kfullstack.Entity.Project;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    public List<Project> findByOwnerUserId(Long userId);
}
