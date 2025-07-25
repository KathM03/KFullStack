package com.sasf.kfullstack.Controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sasf.kfullstack.DTO.ApiResponse;
import com.sasf.kfullstack.DTO.UserResponseDTO;
import com.sasf.kfullstack.Security.JwtTokenProvider;
import com.sasf.kfullstack.Service.IUserService;
import com.sasf.kfullstack.Util.ResponseUtil;

import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final JwtTokenProvider tokenProvider;

    private final IUserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider,
            IUserService userService) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, String>>> login(@RequestParam String email,
            @RequestParam String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Long userId = userService.getAuthenticatedUserId(email).getIdUser();
        String token = tokenProvider.generateToken(email, userId);
        return ResponseUtil.ok(null, Map.of("token", token));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAuthenticatedUserId(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String email = tokenProvider.getEmailFromToken(token);
        UserResponseDTO user = userService.getAuthenticatedUserId(email);
        Long userId = user.getIdUser();
        String role = user.getRole();
        return ResponseUtil.ok(null, Map.of("userId", userId, "email", email, "role", role));
    }
}