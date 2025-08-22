package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.*;
import com.Entra21.Buzix.entities.BusStop;
import com.Entra21.Buzix.entities.Route;
import com.Entra21.Buzix.entities.StopTime;
import com.Entra21.Buzix.repositories.BusStopRepository;
import com.Entra21.Buzix.repositories.StopTimeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/busstops")
public class BusStopController {

    private final BusStopRepository busStopRepository;
    private final StopTimeRepository stopTimeRepository;

    public BusStopController(BusStopRepository busStopRepository, StopTimeRepository stopTimeRepository) {
        this.busStopRepository = busStopRepository;
        this.stopTimeRepository = stopTimeRepository;
    }

    @PostMapping("/register")
    public BusStopResponseDTO createBusStop(@RequestBody BusStopRequestDTO request) {
        BusStop busStop = new BusStop();

        busStop.setIdentifier(request.getIdentifier());
        busStop.setLatitude(request.getLatitude());
        busStop.setLongitude(request.getLongitude());

        busStopRepository.save(busStop);

        return new BusStopResponseDTO(busStop);
    }

    @GetMapping("/all")
    public List<BusStopResponseDTO> getAllBusStops() {
        List<BusStop> busStops = busStopRepository.findAll();
        return busStops.stream()
                .map(BusStopResponseDTO::new)
                .collect(Collectors.toList());
    }

    //Lista ponto de ônibus por id
    @GetMapping("/{idBusStop}")
    public BusStopResponseDTO searchBusStopById(@PathVariable Integer idBusStop) {
        BusStop busStops = busStopRepository.findById(idBusStop).orElseThrow();

        return new BusStopResponseDTO(busStops);
    }

    @GetMapping("/search")
    public List<BusStopResponseDTO> searchBusStopsStartingWith(@RequestParam String prefix) {
        List<BusStop> busStops = busStopRepository.findByIdentifierStartingWithIgnoreCase(prefix);
        return busStops.stream()
                .map(BusStopResponseDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{idBusStop}/routes")
    public List<RouteResponseDTO> getRoutesByBusStop(@PathVariable Integer idBusStop) {
        List<StopTime> stopTimes = stopTimeRepository.findByBusStopId(idBusStop);

        Set<Route> routes = stopTimes.stream()
                .map(st -> st.getTrip().getRoute())
                .collect(Collectors.toSet());

        return routes.stream()
                .map(RouteResponseDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{idBusStop}/routes/{idRoute}/trips")
    public List<TripResponseDTO> getTripsByBusStopAndRoute(
            @PathVariable Integer idBusStop,
            @PathVariable Integer idRoute) {

        List<StopTime> stopTimes = stopTimeRepository.findByBusStopIdAndTripRouteId(idBusStop, idRoute);

        return stopTimes.stream()
                .map(st -> {
                    TripResponseDTO dto = new TripResponseDTO(st.getTrip());
                    dto.setStopTimes(Collections.singletonList(new StopTimeResponseDTO(st))); // só o horário do ponto atual
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @PutMapping("/{idBusStop}")
    public BusStopResponseDTO editBusStop(@PathVariable Integer idBusStop, @RequestBody BusStopRequestDTO request) {
        BusStop busStop = busStopRepository.findById(idBusStop).orElseThrow();

        busStop.setIdentifier(request.getIdentifier());
        busStop.setLatitude(request.getLatitude());
        busStop.setLongitude(request.getLongitude());

        busStopRepository.save(busStop);

        return new BusStopResponseDTO(busStop);
    }

    @DeleteMapping("/{idBusStop}")
    public BusStopResponseDTO removeBusStop(@PathVariable Integer idBusStop) {
        BusStop busStop = busStopRepository.findById(idBusStop).orElseThrow();

        busStopRepository.delete(busStop);

        return new BusStopResponseDTO(busStop);
    }

}
