package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.VehicleRequestDTO;
import com.Entra21.Buzix.dtos.VehicleResponseDTO;
import com.Entra21.Buzix.entities.Vehicle;
import com.Entra21.Buzix.repositories.VehicleRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    private final VehicleRepository vehicleRepository;

    public VehicleController(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @PostMapping("/register")
    public VehicleResponseDTO createVehicle(@RequestBody VehicleRequestDTO request) {
        Vehicle vehicle = new Vehicle();

        vehicle.setIdentifier(request.getIdentifier());
        vehicle.setRegistrationPlate(request.getRegistrationPlate());
        vehicle.setMake(request.getMake());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setNumberOfSeats(request.getNumberOfSeats());
        vehicle.setFuelType(request.getFuelType());

        vehicleRepository.save(vehicle);

        return new VehicleResponseDTO(vehicle);
    }
}
