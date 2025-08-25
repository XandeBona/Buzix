package com.Entra21.Buzix.repositories;

import com.Entra21.Buzix.entities.StopTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StopTimeRepository extends JpaRepository<StopTime, Integer> {
    List<StopTime> findByTripIdOrderByStopSequenceAsc(Integer idTrip);

    List<StopTime> findByBusStopId(Integer idBusStop);

    List<StopTime> findByBusStopIdAndTripRouteId(Integer idBusStop, Integer idRoute);

    List<StopTime> findByBusStopIdentifierStartingWithIgnoreCase(String prefix);
}
