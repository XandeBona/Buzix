package com.Entra21.Buzix.dtos;

import com.Entra21.Buzix.entities.Trip;
import com.Entra21.Buzix.repositories.StopTimeRepository;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class TripResponseDTO {
    private Integer id;
    private Integer routeId;
    private String routeName;
    private Integer vehicleId;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private List<StopTimeResponseDTO> stopTimes;

    public TripResponseDTO(Trip trip) {
        this.id = trip.getId();
        this.routeId = trip.getRoute().getId();
        this.routeName = trip.getRoute().getName();
        this.vehicleId = trip.getVehicle() != null ? trip.getVehicle().getId() : null;
        this.departureTime = trip.getDepartureTime();
        this.arrivalTime = trip.getArrivalTime();
        this.stopTimes = new ArrayList<>();
    }

    public void setStopTimes(List<StopTimeResponseDTO> stopTimes) {
        this.stopTimes = stopTimes;
    }

    //Construtor para trazer os StopTimes ordenados
    public TripResponseDTO(Trip trip, StopTimeRepository stopTimeRepository) {
        this(trip);

        this.stopTimes = stopTimeRepository.findByTripIdOrderByStopSequenceAsc(trip.getId())
                .stream()
                .map(StopTimeResponseDTO::new)
                .collect(Collectors.toList());
    }

    public Integer getId() {
        return id;
    }

    public Integer getRouteId() {
        return routeId;
    }

    public String getRouteName() {
        return routeName;
    }

    public Integer getVehicleId() {
        return vehicleId;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public List<StopTimeResponseDTO> getStopTimes() {
        return stopTimes;
    }
}
