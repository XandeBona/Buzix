package com.Entra21.Buzix.dtos;

import java.time.LocalTime;

public class StopTimeRequestDTO {
    private Integer tripId;
    private Integer busStopId;
    private LocalTime arrivalTime;
    private LocalTime departureTime;
    private Integer stopSequence;

    public Integer getTripId() {
        return tripId;
    }

    public void setTripId(Integer tripId) {
        this.tripId = tripId;
    }

    public Integer getBusStopId() {
        return busStopId;
    }

    public void setBusStopId(Integer busStopId) {
        this.busStopId = busStopId;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public Integer getStopSequence() {
        return stopSequence;
    }

    public void setStopSequence(Integer stopSequence) {
        this.stopSequence = stopSequence;
    }
}
