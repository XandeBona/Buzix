package com.Entra21.Buzix.dtos;

public class LoginResponseDTO {
    private String email;
    private String role;

    public LoginResponseDTO(String email, String role) {
        this.email = email;
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}
