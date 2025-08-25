package com.Entra21.Buzix.repositories;

import com.Entra21.Buzix.entities.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Integer> {
    List<Trip> findByRouteId(Integer routeId);

    List<Trip> findByRouteNameStartingWithIgnoreCase(String prefix);
}
