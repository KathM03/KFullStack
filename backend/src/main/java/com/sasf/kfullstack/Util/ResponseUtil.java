package com.sasf.kfullstack.Util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.sasf.kfullstack.DTO.ApiResponse;

public class ResponseUtil {
    
    public static <T> ResponseEntity<ApiResponse<T>> ok(String message, T data) {
        return ResponseEntity.ok(ApiResponse.<T>builder()
                .data(data)
                .status("success")
                .statusCode(HttpStatus.OK.value())
                .message(message != null ? message : "Operation successful")
                .build());
    }

    public static <T> ResponseEntity<ApiResponse<T>> created(String message, T data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<T>builder()
                .data(data)
                .message(message != null ? message : "Resource created successfully")
                .status("success")
                .statusCode(HttpStatus.CREATED.value())
                .build());
    }


    public static <T> ResponseEntity<ApiResponse<T>> error(String message, HttpStatus status) {
        return ResponseEntity.status(status)
                .body(ApiResponse.<T>builder()
                        .message(message != null ? message : "An error occurred")
                        .status("error")
                        .statusCode(status.value())
                        .build());
    }
}
