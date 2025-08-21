package com.Entra21.Buzix.repositories;

import com.Entra21.Buzix.entities.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteRepository extends JpaRepository<Route, Integer> {
    List<Route> findByNameStartingWithIgnoreCase(String prefix);
}
