package com.sasf.kfullstack.Mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sasf.kfullstack.DTO.UserRequestDTO;
import com.sasf.kfullstack.DTO.UserResponseDTO;
import com.sasf.kfullstack.Entity.User;
import com.sasf.kfullstack.Constants.StatusConstants;

@Component
public class UserMapper {

    public UserRequestDTO toRequestDTO(User user) {
        if (user == null)
            return null;

        UserRequestDTO request = new UserRequestDTO();
        request.setUsername(user.getUsername());
        request.setEmail(user.getEmail());
        request.setPassword(user.getPassword());
        if (StatusConstants.ACTIVE.equals(user.getStatus())) {
            request.setStatus(StatusConstants.ACTIVE);
        } else {
            request.setStatus(StatusConstants.INACTIVE);
        }
        return request;
    }

    public UserResponseDTO toResponseDTO(User user) {
        if (user == null)
            return null;

        return UserResponseDTO.builder()
                .idUser(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .status(StatusConstants.ACTIVE.equals(user.getStatus()) ? StatusConstants.ACTIVE
                        : StatusConstants.INACTIVE)
                .role(user.getRole() != null ? user.getRole().name() : null)
                .build();
    }

    public User toEntity(UserRequestDTO request) {
        if (request == null)
            return null;

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setStatus(StatusConstants.ACTIVE);
        user.setRole(request.getRole() != null ? 
                     User.Role.valueOf(request.getRole().toUpperCase()) 
                     : User.Role.USER);
        return user;
    }

    public List<UserResponseDTO> toResponseDTOList(List<User> users) {
        if (users == null)
            return null;
        return users.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
}