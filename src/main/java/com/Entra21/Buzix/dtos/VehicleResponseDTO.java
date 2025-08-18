package com.Entra21.Buzix.dtos;

import com.Entra21.Buzix.entities.Vehicle;
import org.hibernate.grammars.hql.HqlParser;

public class VehicleResponseDTO {
    private String identifier;
    private String registrationPlate;
    private String make;
    private String model;
    private String year;
    private String numberOfSeats;
    private String fuelType;

    public VehicleResponseDTO(Vehicle vehicle) {
        this.identifier = vehicle.getIdentifier();
        this.registrationPlate = vehicle.getRegistrationPlate();
        this.make = vehicle.getMake();
        this.model = vehicle.getModel();
        this.year = vehicle.getYear();
        this.numberOfSeats = vehicle.getNumberOfSeats();
        this.fuelType = vehicle.getFuelType();
    }

    public String getIdentifier() {
        return identifier;
    }

    public String getRegistrationPlate() {
        return registrationPlate;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    public String getYear() {
        return year;
    }

    public String getNumberOfSeats() {
        return numberOfSeats;
    }

    public String getFuelType() {
        return fuelType;
    }
}
