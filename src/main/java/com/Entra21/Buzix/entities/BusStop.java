package com.Entra21.Buzix.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "busstops")
public class BusStop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String identifier;
    private Double latitude;
    private Double longitude;

    public BusStop() {

    }

    public BusStop(Integer id, String identifier, Double latitude, Double longitude) {
        this.id = id;
        this.identifier = identifier;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getIdentifier() {
        return identifier;
    }

    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}
