package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.BusStopRequestDTO;
import com.Entra21.Buzix.dtos.BusStopResponseDTO;
import com.Entra21.Buzix.entities.BusStop;
import com.Entra21.Buzix.repositories.BusStopRepository;
import org.springframework.web.bind.annotation.*;

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

}
