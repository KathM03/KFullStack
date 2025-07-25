package com.sasf.kfullstack.DTO;

import com.sasf.kfullstack.Entity.Task.Status;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TaskRequestDTO {

    @NotBlank(message = "Title cannot be null")
    private String title;

    private String description;

    private Status status;

    private Long assignedTo;

    @NotBlank(message = "Project ID cannot be null.")
    private Long projectId;

}
