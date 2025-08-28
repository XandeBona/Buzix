package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.VehicleRequestDTO;
import com.Entra21.Buzix.dtos.VehicleResponseDTO;
import com.Entra21.Buzix.entities.Vehicle;
import com.Entra21.Buzix.repositories.VehicleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    private final VehicleRepository vehicleRepository;

    public VehicleController(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    //Cria veículo
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

    //Busca todos
    @GetMapping("/all")
    public List<VehicleResponseDTO> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return vehicles.stream()
                .map(VehicleResponseDTO::new)
                .collect(Collectors.toList());
    }

    //Lista veículo por id
    @GetMapping("/{idVehicle}")
    public VehicleResponseDTO searchVehicleById(@PathVariable Integer idVehicle) {
        Vehicle vehicles = vehicleRepository.findById(idVehicle).orElseThrow();

        return new VehicleResponseDTO(vehicles);
    }

    //Para pesquisa por nome
    @GetMapping("/search")
    public List<VehicleResponseDTO> searchVehiclesStartingWith(@RequestParam String prefix) {
        List<Vehicle> vehicles = vehicleRepository.findByRegistrationPlateStartingWithIgnoreCase(prefix);
        return vehicles.stream()
                .map(VehicleResponseDTO::new)
                .collect(Collectors.toList());
    }

    //Edita veículo
    @PutMapping("/{idVehicle}")
    public VehicleResponseDTO editVehicle(@PathVariable Integer idVehicle, @RequestBody VehicleRequestDTO request) {
        Vehicle vehicle = vehicleRepository.findById(idVehicle).orElseThrow();

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

    //Deleta veículo
    @DeleteMapping("/{idVehicle}")
    public VehicleResponseDTO removeVehicle(@PathVariable Integer idVehicle) {
        Vehicle vehicle = vehicleRepository.findById(idVehicle).orElseThrow();

        vehicleRepository.delete(vehicle);

        return new VehicleResponseDTO(vehicle);
    }

}

