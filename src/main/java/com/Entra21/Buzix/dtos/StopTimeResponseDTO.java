package com.Entra21.Buzix.dtos;

import com.Entra21.Buzix.entities.StopTime;

import java.time.LocalTime;

public class StopTimeResponseDTO {
    private Integer id;
    private Integer busStopId;
    private String busStopName;
    private LocalTime arrivalTime;
    private LocalTime departureTime;
    private Integer stopSequence;

    public StopTimeResponseDTO(StopTime stopTime) {
        this.id = stopTime.getId();
        this.busStopId = stopTime.getBusStop().getId();
        this.busStopName = stopTime.getBusStop().getIdentifier();
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
