package com.Entra21.Buzix.dtos;

import com.Entra21.Buzix.entities.BusStop;

public class BusStopResponseDTO {
    private Integer id;
    private String identifier;
    private Double latitude;
    private Double longitude;

    public BusStopResponseDTO(BusStop busStop) {
        this.id = busStop.getId();
        this.identifier = busStop.getIdentifier();
        this.latitude = busStop.getLatitude();
        this.longitude = busStop.getLongitude();
    }

    public Integer getId() {
        return id;
    }

    public String getIdentifier() {
        return identifier;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }
}
