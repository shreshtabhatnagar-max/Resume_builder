package com.example.Resume_Builder.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    @Email(message ="Email Should be valid")
    @NotBlank(message = "Email is required")
    private String email;
    @NotBlank(message = "Name is required ")
    @Size(min =2, max=15, message="Name must Be between 2 and 15 Characters" )
    private String name;
    @NotBlank(message = "Password is Required")
    @Size(min =6, max=15, message="Password must Be between 2 and 15 Characters" )
    private String password;
    private String profileImageUrl;
}
