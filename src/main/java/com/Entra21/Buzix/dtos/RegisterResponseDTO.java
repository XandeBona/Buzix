package com.Entra21.Buzix.dtos;

import com.Entra21.Buzix.entities.User;

public class RegisterResponseDTO {
    private Integer id;
    private String email;
    private String role;

    public RegisterResponseDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.role = user.getRole();
    }

    public Integer getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}