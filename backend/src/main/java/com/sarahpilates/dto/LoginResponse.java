package com.sarahpilates.dto;

import com.sarahpilates.entity.User;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private User user;
    private Long expiresIn;
}