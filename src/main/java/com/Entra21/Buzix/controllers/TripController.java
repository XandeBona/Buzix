package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.StopTimeResponseDTO;
import com.Entra21.Buzix.dtos.TripRequestDTO;
import com.Entra21.Buzix.dtos.TripResponseDTO;
import com.Entra21.Buzix.entities.*;
import com.Entra21.Buzix.repositories.RouteRepository;
import com.Entra21.Buzix.repositories.StopTimeRepository;
import com.Entra21.Buzix.repositories.TripRepository;
import com.Entra21.Buzix.repositories.VehicleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/trips")
public class TripController {
    private final TripRepository tripRepository;
    private final StopTimeRepository stopTimeRepository;
    private final RouteRepository routeRepository;
    private final VehicleRepository vehicleRepository;

    public TripController(TripRepository tripRepository, StopTimeRepository stopTimeRepository, RouteRepository routeRepository, VehicleRepository vehicleRepository) {
        this.tripRepository = tripRepository;
        this.stopTimeRepository = stopTimeRepository;
        this.routeRepository = routeRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @PostMapping("/register")
    public TripResponseDTO createTrip(@RequestBody TripRequestDTO request) {
        Trip trip = new Trip();

        Route route = routeRepository.findById(request.getRouteId()).orElseThrow();
        trip.setRoute(route);

        if (request.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(request.getVehicleId()).orElseThrow();
            trip.setVehicle(vehicle);
        }
        trip.setDepartureTime(request.getDepartureTime());
        trip.setArrivalTime(request.getArrivalTime());

        tripRepository.save(trip);

        TripResponseDTO resp = new TripResponseDTO(trip);
        resp.setStopTimes(Collections.emptyList()); // ao criar, ainda não há StopTimes
        return resp;
    }

    @GetMapping("/all")
    public List<TripResponseDTO> getAllTrips() {
        List<Trip> trips = tripRepository.findAll();
        return trips.stream()
                .map(TripResponseDTO::new) // aqui devolvemos sem StopTimes para evitar N+1
                .collect(Collectors.toList());
    }

    @GetMapping("/{idTrip}")
    public TripResponseDTO searchTripById(@PathVariable Integer idTrip) {
        Trip trip = tripRepository.findById(idTrip).orElseThrow();

        List<StopTime> stops = stopTimeRepository.findByTripIdOrderByStopSequenceAsc(idTrip);
        List<StopTimeResponseDTO> stopDtos = new ArrayList<>();

        for (StopTime stop : stops) {
            stopDtos.add(new StopTimeResponseDTO(stop));
        }

        TripResponseDTO resp = new TripResponseDTO(trip);
        resp.setStopTimes(stopDtos);  // aqui “entra” o setStopTimes
        return resp;
    }

    //Busca sem os StopTimes (usa o construtor simples do TripResponseDTO)
    @GetMapping("/route/{idRoute}")
    public List<TripResponseDTO> getTripsByRoute(@PathVariable Integer idRoute) {
        List<Trip> trips = tripRepository.findByRouteId(idRoute);
        return trips.stream()
                .map(TripResponseDTO::new)
                .collect(Collectors.toList());
    }

    //Busca com os StopTimes (usa o construtor do TripResponseDTO que busca StopTimes ordenados)
    @GetMapping("/route/{idRoute}/withStops")
    public List<TripResponseDTO> getTripsByRouteComplete(@PathVariable Integer idRoute) {
        List<Trip> trips = tripRepository.findByRouteId(idRoute);

        return trips.stream()
                .map(trip -> new TripResponseDTO(trip, stopTimeRepository))
                .collect(Collectors.toList());
    }

    @GetMapping("/search")
    public List<TripResponseDTO> searchByRoutePrefix(@RequestParam String prefix) {
        List<Trip> trips = tripRepository.findByRoute_NameStartingWithIgnoreCase(prefix);
        return trips.stream()
                .map(TripResponseDTO::new)
                .collect(Collectors.toList());
    }

    @PutMapping("/{idTrip}")
    public TripResponseDTO editTrip(@PathVariable Integer idTrip, @RequestBody TripRequestDTO request) {
        Trip trip = tripRepository.findById(idTrip).orElseThrow();

        Route route = routeRepository.findById(request.getRouteId()).orElseThrow();
        trip.setRoute(route);
        if (request.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findById(request.getVehicleId()).orElseThrow();
            trip.setVehicle(vehicle);
        } else {
            trip.setVehicle(null);
        }
        trip.setDepartureTime(request.getDepartureTime());
        trip.setArrivalTime(request.getArrivalTime());

        tripRepository.save(trip);

        //Atualização não mexe nos StopTimes - devolve vazio aqui
        TripResponseDTO resp = new TripResponseDTO(trip);
        resp.setStopTimes(Collections.emptyList());
        return resp;
    }

    @DeleteMapping("/{idTrip}")
    public TripResponseDTO removeTrip(@PathVariable Integer idTrip) {
        Trip trip = tripRepository.findById(idTrip).orElseThrow();
        tripRepository.delete(trip);
        return new TripResponseDTO(trip);
    }
}