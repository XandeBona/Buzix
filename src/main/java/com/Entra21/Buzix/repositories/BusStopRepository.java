package com.Entra21.Buzix.repositories;


import com.Entra21.Buzix.entities.BusStop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusStopRepository extends JpaRepository<BusStop, Integer> {
    List<BusStop> findByIdentifierStartingWithIgnoreCase(String prefix);
}

