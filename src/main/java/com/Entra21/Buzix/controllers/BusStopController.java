package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.entities.BusStop;
import com.Entra21.Buzix.repositories.BusStopRepository;
import com.Entra21.Buzix.services.BusStopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pontos")
public class BusStopController {

    private final BusStopRepository busStopRepository;
    private final BusStopService busStopService;
    @Autowired
    private BusStopService service;

    public BusStopController(BusStopRepository busStopRepository, BusStopService busStopService) {
        this.busStopRepository = busStopRepository;
        this.busStopService = busStopService;
    }

    // POST - Criar novo ponto
    @PostMapping ("/busstop")
    public BusStop salvar(@RequestParam String identifierCodeBusStop,
                          @RequestParam String latitude,
                          @RequestParam String longitude,
                          @RequestParam(required = false) String argskmte) {

        BusStop ponto = new BusStop();
        ponto.setIdentifierCodeBusStop(identifierCodeBusStop);
        ponto.setLatitude(Double.parseDouble(latitude));
        ponto.setLongitude(Double.parseDouble(longitude));
        // ponto.setArgskmte(argskmte);

        return service.salvar(ponto);
    }

    // GET - Listar todos os pontos
    @GetMapping
    public List<BusStop> listarTodos() {
        return busStopRepository.findAll();
    }

    // GET - Buscar ponto por ID
    @GetMapping("/{id}")
    public Optional<BusStop> buscarPorId(@PathVariable Long id) {
        return busStopRepository.findById(id);
    }

    // PUT - Atualizar ponto por ID
    @PutMapping("/{id}")
    public BusStop atualizar(@PathVariable Long id,
                             @RequestBody BusStop pontoAtualizado) {
      //  return service.atualizar(id, pontoAtualizado);
        return pontoAtualizado;
    }

    // DELETE - Remover ponto por ID
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        busStopRepository.deleteById(id);
    }
}
