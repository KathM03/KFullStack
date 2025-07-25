package com.sasf.kfullstack.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sasf.kfullstack.Entity.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    public List<Task> findByAssignedToUserId(Long userId);

    public List<Task> findByProjectProjectId(Long projectId);

    public List<Task> findByAssignedToUserIdAndStatusIn(Long userId, List<String> taskStatus);

    public List<Task> findByProjectProjectIdAndStatusIn(Long projectId, List<String> taskStatus);

}
