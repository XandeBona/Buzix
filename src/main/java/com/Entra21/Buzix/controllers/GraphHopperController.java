package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.services.GraphHopperService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class GraphHopperController {

    @Autowired
    private GraphHopperService graphHopperService;

    //Recebe coordenadas geográficas e faz a requisição para API, retorna a rota calculada entre os pontos
    @GetMapping(value = "/route", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getRoute(@RequestParam("point") List<String> points) {
        try {
            //Remonta no formato que o GraphHopper espera
            String pointsQuery = points.stream()
                    .map(p -> "point=" + p) // p é "lat,lng"
                    .collect(Collectors.joining("&"));

            String json = graphHopperService.getRoute(pointsQuery);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(json);
        } catch (Exception e) {
            return ResponseEntity.status(502)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\":\"Erro ao buscar rota\"}");
        }
    }
}