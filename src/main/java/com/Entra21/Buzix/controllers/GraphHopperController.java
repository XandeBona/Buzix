package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.services.GraphHopperService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class GraphHopperController {

    @Autowired
    private GraphHopperService graphHopperService;

    @GetMapping("/route")
    public String getRoute(@RequestParam String points) throws IOException {
        return graphHopperService.getRoute(points);
    }
}