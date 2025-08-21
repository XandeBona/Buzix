package com.Entra21.Buzix.dtos;

import com.Entra21.Buzix.entities.StopTime;

import java.time.LocalTime;

public class StopTimeResponseDTO {
    private Integer id;
    private Integer busStopId;
    private String busStopName;
    private Double latitude;
    private Double longitude;
    private LocalTime arrivalTime;
    private LocalTime departureTime;
    private Integer stopSequence;

    public StopTimeResponseDTO(StopTime stopTime) {
        this.id = stopTime.getId();
        this.busStopId = stopTime.getBusStop().getId();
        this.busStopName = stopTime.getBusStop().getIdentifier();
        this.latitude = stopTime.getBusStop().getLatitude();
        this.longitude = stopTime.getBusStop().getLongitude();
        this.arrivalTime = stopTime.getArrivalTime();
        this.departureTime = stopTime.getDepartureTime();
        this.stopSequence = stopTime.getStopSequence();
    }

    public Integer getId() {
        return id;
    }

    public Integer getBusStopId() {
        return busStopId;
    }

    public String getBusStopName() {
        return busStopName;
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
}
