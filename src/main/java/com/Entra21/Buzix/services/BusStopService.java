package com.Entra21.Buzix.services;

import com.Entra21.Buzix.entities.BusStop;
import com.Entra21.Buzix.repositories.BusStopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BusStopService {

    @Autowired
    private BusStopRepository repository;

    public BusStop salvar(BusStop ponto) {
        return repository.save(ponto);
    }
}
