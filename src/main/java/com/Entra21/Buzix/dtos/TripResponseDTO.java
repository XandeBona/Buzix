package com.Entra21.Buzix.dtos;

import com.Entra21.Buzix.entities.Trip;

import java.time.LocalTime;
import java.util.List;

public class TripResponseDTO {
    private Integer id;
    private Integer routeId;
    private Integer vehicleId;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private List<StopTimeResponseDTO> stopTimes;

    public TripResponseDTO(Trip trip, List<StopTimeResponseDTO> stopTimes) {
        this.id = trip.getId();
        this.routeId = trip.getRoute().getId();
        this.vehicleId = trip.getVehicle() != null ? trip.getVehicle().getId() : null;
        this.departureTime = trip.getDepartureTime();
        this.arrivalTime = trip.getArrivalTime();
        this.stopTimes = stopTimes;
    }
}
