package com.Entra21.Buzix.dtos;

import com.Entra21.Buzix.entities.User;

public class UserResponseDTO {
    private Integer id;
    private String userName;
    private String email;

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.userName = user.getUserName();
        this.email = user.getEmail();
    }

    public Integer getId() {
        return id;
    }

    public String getUserName() {
        return userName;
    }

    public String getEmail() {
        return email;
    }

}