package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.BusStopRequestDTO;
import com.Entra21.Buzix.dtos.BusStopResponseDTO;
import com.Entra21.Buzix.entities.BusStop;
import com.Entra21.Buzix.repositories.BusStopRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/busstops")
public class BusStopController {

    private final BusStopRepository busStopRepository;
    private final BusStopService busStopService;
    @Autowired
    private BusStopService service;

    public BusStopController(BusStopRepository busStopRepository, BusStopService busStopService) {
        this.busStopRepository = busStopRepository;
        this.busStopService = busStopService;
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

    @GetMapping
    public List<BusStop> listBusStops() {
        return busStopRepository.findAll();
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
