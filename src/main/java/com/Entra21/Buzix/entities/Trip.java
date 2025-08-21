package com.Entra21.Buzix.entities;

import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.List;

//Itinerário

@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private Route route;

    @ManyToOne
    private Vehicle vehicle;

    private LocalTime departureTime; //saída
    private LocalTime arrivalTime; //chegada

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL)
    private List<StopTime> stopTimes;

    public Trip() {
    }

    public Trip(Integer id) {
        this.id = id;
    }

    public Trip(Integer id, Route route, Vehicle vehicle, LocalTime departureTime, LocalTime arrivalTime, List<StopTime> stopTimes) {
        this.id = id;
        this.route = route;
        this.vehicle = vehicle;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.stopTimes = stopTimes;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Route getRoute() {
        return route;
    }

    public void setRoute(Route route) {
        this.route = route;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public List<StopTime> getStopTimes() {
        return stopTimes;
    }

    public void setStopTimes(List<StopTime> stopTimes) {
        this.stopTimes = stopTimes;
    }
}
