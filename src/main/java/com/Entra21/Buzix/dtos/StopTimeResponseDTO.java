package com.Entra21.Buzix.dtos;

import com.Entra21.Buzix.entities.StopTime;

import java.time.LocalTime;

public class StopTimeResponseDTO {
    private Integer id;
    private Integer busStopId;
    private String busStopIdentifier;
    private Double latitude;
    private Double longitude;
    private LocalTime arrivalTime;
    private LocalTime departureTime;
    private Integer stopSequence;
    private Integer tripId;
    private String tripRouteName;
    private LocalTime tripDepartureTime;
    private LocalTime tripArrivalTime;

    public StopTimeResponseDTO(StopTime stopTime) {
        this.id = stopTime.getId();
        this.busStopId = stopTime.getBusStop().getId();
        this.busStopIdentifier = stopTime.getBusStop().getIdentifier();
        this.latitude = stopTime.getBusStop().getLatitude();
        this.longitude = stopTime.getBusStop().getLongitude();
        this.arrivalTime = stopTime.getArrivalTime();
        this.departureTime = stopTime.getDepartureTime();
        this.stopSequence = stopTime.getStopSequence();
        this.tripId = stopTime.getTrip().getId();
        this.tripRouteName = stopTime.getTrip().getRoute().getName();
        this.tripDepartureTime = stopTime.getTrip().getDepartureTime();
        this.tripArrivalTime = stopTime.getTrip().getArrivalTime();
    }

    public Integer getId() {
        return id;
    }

    public Integer getBusStopId() {
        return busStopId;
    }

    public String getBusStopIdentifier() {
        return busStopIdentifier;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public Integer getStopSequence() {
        return stopSequence;
    }

    public Integer getTripId() {
        return tripId;
    }

    public String getTripRouteName() {
        return tripRouteName;
    }

    public LocalTime getTripDepartureTime() {
        return tripDepartureTime;
    }

    public LocalTime getTripArrivalTime() {
        return tripArrivalTime;
    }
}
