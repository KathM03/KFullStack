package com.sasf.kfullstack.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class ProjectRequestDTO {

    @NotBlank(message = "Name cannot be null")
    private String name;

    @NotBlank(message = "Description cannot be null")
    private String description;

    @JsonIgnore
    private String status;
}
