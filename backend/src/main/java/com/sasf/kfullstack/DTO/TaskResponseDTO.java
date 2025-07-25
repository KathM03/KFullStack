package com.sasf.kfullstack.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class TaskResponseDTO {

    private Long idTask;

    private String title;

    private String description;

    private Long assignedTo;

    private Long projectId;
    
    private String status;
}
