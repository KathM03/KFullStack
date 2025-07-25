package com.sasf.kfullstack.Service;

import java.util.List;

import com.sasf.kfullstack.DTO.UserRequestDTO;
import com.sasf.kfullstack.DTO.UserResponseDTO;

public interface IUserService {

    public List<UserResponseDTO> getAllUsers();

    public UserResponseDTO getUserById(Long userId);

    public UserResponseDTO createUser(UserRequestDTO request);

    public UserResponseDTO getAuthenticatedUserId(String email);
}
