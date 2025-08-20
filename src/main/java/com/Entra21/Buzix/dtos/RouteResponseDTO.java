package com.Entra21.Buzix.dtos;

import com.Entra21.Buzix.entities.Route;
import com.Entra21.Buzix.entities.RouteColor;

public class RouteResponseDTO {
    private Integer id;
    private String code;
    private String name;
    private String description;
    private RouteColor color;

    public RouteResponseDTO(Route route) {
        this.id = route.getId();
        this.code = route.getCode();
        this.name = route.getName();
        this.description = route.getDescription();
        this.color = route.getColor();
    }

    public Integer getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public RouteColor getColor() {
        return color;
    }
}
