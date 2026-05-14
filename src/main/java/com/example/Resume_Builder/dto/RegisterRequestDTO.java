package com.example.Resume_Builder.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDTO {
    @Email(message ="Email Should be valid")
    @NotBlank(message = "Email is required")
    @Size (max =254)
    private String email;
    @NotBlank(message = "Name is required ")
    @Size(min =2, max=15, message="Name must Be between 2 and 15 Characters" )
    private String name;
    @NotBlank(message = "Password is Required")
    @Size(min =8, max=15, message="Password must Be between 2 and 15 Characters" )
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=]).*$",
            message = "Password must contain uppercase, lowercase, number and special character")
    private String password;
    private String profileImageUrl;
}
