package com.sasf.kfullstack.DTO;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class ProjectResponseDTO {

    private Long idProject;

    private String name;

    private String description;

    private String status;

    private UserResponseDTO owner;

    private LocalDateTime createdAt;

}
