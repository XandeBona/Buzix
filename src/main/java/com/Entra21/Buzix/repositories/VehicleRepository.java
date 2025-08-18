package com.Entra21.Buzix.repositories;

import com.Entra21.Buzix.entities.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
}
