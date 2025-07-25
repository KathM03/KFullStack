package com.sasf.kfullstack.Service.Impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sasf.kfullstack.Constants.StatusConstants;
import com.sasf.kfullstack.DTO.UserRequestDTO;
import com.sasf.kfullstack.DTO.UserResponseDTO;
import com.sasf.kfullstack.Entity.User;
import com.sasf.kfullstack.Exception.DuplicateResourceException;
import com.sasf.kfullstack.Exception.ResourceNotFoundException;
import com.sasf.kfullstack.Mapper.UserMapper;
import com.sasf.kfullstack.Repository.UserRepository;
import com.sasf.kfullstack.Service.IUserService;
import com.sasf.kfullstack.Validation.UserValidation;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    
    private final UserRepository userRepository;
    
    private final UserMapper userMapper;
    
    private final UserValidation userValidation;
    
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> StatusConstants.GENERIC_STATUS.contains(user.getStatus()))
                .map(userMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO getUserById(Long userId) {
        return userRepository.findById(userId)
                .filter(user -> StatusConstants.GENERIC_STATUS.contains(user.getStatus()))
                .map(userMapper::toResponseDTO)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public UserResponseDTO createUser(UserRequestDTO request) {
        userValidation.validateUserRequest(request);
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User already exists with this email: " + request.getEmail());
        }
        
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("User already exists with this username: " + request.getUsername());
        }
        
        User user = userMapper.toEntity(request);
        user.setStatus(StatusConstants.ACTIVE);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userMapper.toResponseDTO(userRepository.save(user));
    }

    @Override
    public UserResponseDTO getAuthenticatedUserId(String email) {
        User user = userRepository.findByEmailAndStatus(email, StatusConstants.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return userMapper.toResponseDTO(user);
    }
}
