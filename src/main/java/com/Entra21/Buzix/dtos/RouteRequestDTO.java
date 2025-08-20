package com.Entra21.Buzix.dtos;

import com.Entra21.Buzix.entities.RouteColor;

public class RouteRequestDTO {
    private String code;
    private String name;
    private String description;
    private RouteColor color;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RouteColor getColor() {
        return color;
    }

    public void setColor(RouteColor color) {
        this.color = color;
    }
}
