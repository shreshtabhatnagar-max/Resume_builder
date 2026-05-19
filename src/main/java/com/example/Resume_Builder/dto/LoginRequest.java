package com.example.Resume_Builder.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Email is Required")
    @Email(message = "Email Should be Valid")
    private  String email;

    @NotBlank(message = "Password is Required")
    private String password;


}
