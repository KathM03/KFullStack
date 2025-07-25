package com.sasf.kfullstack.Validation;

import org.springframework.stereotype.Component;

import com.sasf.kfullstack.DTO.UserRequestDTO;
import com.sasf.kfullstack.Entity.User.Role;

@Component
public class UserValidation {

    public void validateUserRequest(UserRequestDTO userRequest) {
        if (userRequest == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        if (userRequest.getUsername() == null || userRequest.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (userRequest.getEmail() == null || userRequest.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (userRequest.getPassword() == null || userRequest.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        if (userRequest.getRole() == null || userRequest.getRole().isBlank()) {
            throw new IllegalArgumentException("Role is required");
        } else {
            try {
                Role.valueOf(userRequest.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid Role: " + userRequest.getRole());
            }
        }
    }
}
