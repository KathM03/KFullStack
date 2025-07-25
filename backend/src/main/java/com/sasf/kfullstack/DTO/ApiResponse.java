package com.sasf.kfullstack.DTO;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class ApiResponse<T> {

    private int statusCode;

    private String status;

    private String message;

    private T data;
}
