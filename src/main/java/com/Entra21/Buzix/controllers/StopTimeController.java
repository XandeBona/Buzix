package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.StopTimeRequestDTO;
import com.Entra21.Buzix.dtos.StopTimeResponseDTO;
import com.Entra21.Buzix.entities.BusStop;
import com.Entra21.Buzix.entities.StopTime;
import com.Entra21.Buzix.entities.Trip;
import com.Entra21.Buzix.repositories.BusStopRepository;
import com.Entra21.Buzix.repositories.StopTimeRepository;
import com.Entra21.Buzix.repositories.TripRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/stoptimes")
public class StopTimeController {
    private final StopTimeRepository stopTimeRepository;
    private final TripRepository tripRepository;
    private final BusStopRepository busStopRepository;

    public StopTimeController(StopTimeRepository stopTimeRepository, TripRepository tripRepository, BusStopRepository busStopRepository) {
        this.stopTimeRepository = stopTimeRepository;
        this.tripRepository = tripRepository;
        this.busStopRepository = busStopRepository;
    }

    @PostMapping("/register")
    public StopTimeResponseDTO createStopTime(@RequestBody StopTimeRequestDTO request) {
        StopTime stopTime = new StopTime();

        Trip trip = tripRepository.findById(request.getTripId()).orElseThrow();
        stopTime.setTrip(trip);
        BusStop busStop = busStopRepository.findById(request.getBusStopId()).orElseThrow();
        stopTime.setBusStop(busStop);
        stopTime.setArrivalTime(request.getArrivalTime());
        stopTime.setDepartureTime(request.getDepartureTime());
        stopTime.setStopSequence(request.getStopSequence());

        stopTimeRepository.save(stopTime);

        return new StopTimeResponseDTO(stopTime);
    }

    @GetMapping("/all")
    public List<StopTimeResponseDTO> getAllStopTimes() {
        List<StopTime> stopTimes = stopTimeRepository.findAll();
        return stopTimes.stream()
                .map(StopTimeResponseDTO::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{idStopTime}")
    public StopTimeResponseDTO searchStopTimeById(@PathVariable Integer idStopTime) {
        StopTime stopTime = stopTimeRepository.findById(idStopTime).orElseThrow();
        return new StopTimeResponseDTO(stopTime);
    }

    @GetMapping("/search")
    public List<StopTimeResponseDTO> searchByBusStopPrefix(@RequestParam String prefix) {
        List<StopTime> stops = stopTimeRepository.findByBusStopIdentifierStartingWithIgnoreCase(prefix);
        return stops.stream()
                .map(StopTimeResponseDTO::new)
                .collect(Collectors.toList());
    }

    @PutMapping("/{idStopTime}")
    public StopTimeResponseDTO editStopTime(@PathVariable Integer idStopTime, @RequestBody StopTimeRequestDTO request) {
        StopTime stopTime = stopTimeRepository.findById(idStopTime).orElseThrow();

        stopTime.setTrip(new Trip(request.getTripId()));
        stopTime.setBusStop(new BusStop(request.getBusStopId()));
        stopTime.setArrivalTime(request.getArrivalTime());
        stopTime.setDepartureTime(request.getDepartureTime());
        stopTime.setStopSequence(request.getStopSequence());

        stopTimeRepository.save(stopTime);

        return new StopTimeResponseDTO(stopTime);
    }

    @DeleteMapping("/{idStopTime}")
    public StopTimeResponseDTO removeStopTime(@PathVariable Integer idStopTime) {
        StopTime stopTime = stopTimeRepository.findById(idStopTime).orElseThrow();

        stopTimeRepository.delete(stopTime);

        return new StopTimeResponseDTO(stopTime);
    }
}