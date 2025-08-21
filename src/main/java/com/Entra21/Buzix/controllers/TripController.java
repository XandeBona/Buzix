package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.StopTimeResponseDTO;
import com.Entra21.Buzix.dtos.TripRequestDTO;
import com.Entra21.Buzix.dtos.TripResponseDTO;
import com.Entra21.Buzix.entities.Route;
import com.Entra21.Buzix.entities.StopTime;
import com.Entra21.Buzix.entities.Trip;
import com.Entra21.Buzix.entities.Vehicle;
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

    @GetMapping("/route/{routeId}")
    public List<TripResponseDTO> getTripsByRoute(@PathVariable Integer routeId) {
        List<Trip> trips = tripRepository.findByRouteId(routeId);
        return trips.stream()
                .map(TripResponseDTO::new) // idem, sem StopTimes por performance
                .collect(Collectors.toList());
    }

    @PutMapping("/{idTrip}")
    public TripResponseDTO editTrip(@PathVariable Integer idTrip, @RequestBody TripRequestDTO request) {
        Trip trip = tripRepository.findById(idTrip).orElseThrow();

        trip.setRoute(new Route(request.getRouteId()));
        trip.setVehicle(request.getVehicleId() != null ? new Vehicle(request.getVehicleId()) : null);
        trip.setDepartureTime(request.getDepartureTime());
        trip.setArrivalTime(request.getArrivalTime());

        tripRepository.save(trip);

        // Atualização não mexe nos StopTimes; devolve vazio aqui
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