package com.Entra21.Buzix.entities;


import jakarta.persistence.*;
import org.springframework.cglib.core.Local;

import java.time.LocalTime;

//Itinerário <> Ponto

@Entity
@Table(name = "stop_times")
public class StopTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private Trip trip;

    @ManyToOne
    private BusStop busStop;

    private LocalTime arrivalTime; //chegada
    private LocalTime departureTime; //saída
    private Integer stopSequence; //sequencia de paradas

    public StopTime() {

    }

    public StopTime(Integer id) {
        this.id = id;
    }

    public StopTime(Integer id, Trip trip, BusStop busStop, LocalTime arrivalTime, LocalTime departureTime, Integer stopSequence) {
        this.id = id;
        this.trip = trip;
        this.busStop = busStop;
        this.arrivalTime = arrivalTime;
        this.departureTime = departureTime;
        this.stopSequence = stopSequence;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public BusStop getBusStop() {
        return busStop;
    }

    public void setBusStop(BusStop busStop) {
        this.busStop = busStop;
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
