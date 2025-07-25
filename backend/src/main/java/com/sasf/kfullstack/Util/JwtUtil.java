package com.sasf.kfullstack.Util;

import org.springframework.stereotype.Component;

import com.sasf.kfullstack.Security.JwtTokenProvider;

import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtUtil {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtUtil(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public Long extractUserIdFromCurrentToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader != null ? authHeader.replace("Bearer ", "") : null;
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("Invalid or missing JWT token");
        }
        return jwtTokenProvider.getUserIdFromToken(token);
    }
}
