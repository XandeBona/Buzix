package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.BusStopRequestDTO;
import com.Entra21.Buzix.dtos.BusStopResponseDTO;
import com.Entra21.Buzix.entities.BusStop;
import com.Entra21.Buzix.repositories.BusStopRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/busstops")
public class BusStopController {

    private final BusStopRepository busStopRepository;

    public BusStopController(BusStopRepository busStopRepository) {
        this.busStopRepository = busStopRepository;
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

    @GetMapping("/{idBusStop}")
    public BusStopResponseDTO searchBusStopById(@PathVariable Integer idBusStop) {
        BusStop busStop = busStopRepository.findById(idBusStop).orElseThrow();

        return new BusStopResponseDTO(busStop);
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
