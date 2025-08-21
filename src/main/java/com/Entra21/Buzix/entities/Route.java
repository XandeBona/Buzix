package com.Entra21.Buzix.entities;

import jakarta.persistence.*;

import java.util.List;

//Linha

@Entity
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String code;
    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private RouteColor color;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL)
    private List<Trip> trips;

    public Route() {

    }

    public Route(Integer id) {
        this.id = id;
    }

    public Route(Integer id, String code, String name, String description, RouteColor color, List<Trip> trips) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.color = color;
        this.trips = trips;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public List<Trip> getTrips() {
        return trips;
    }

    public void setTrips(List<Trip> trips) {
        this.trips = trips;
    }
}
