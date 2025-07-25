package com.sasf.kfullstack.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Setter
@Getter
@NoArgsConstructor
@SuperBuilder
public class UserResponseDTO {

    private Long idUser;

    private String username;

    private String email;

    private String status;

    private String role;
}
