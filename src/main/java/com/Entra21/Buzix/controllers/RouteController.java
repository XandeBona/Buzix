package com.Entra21.Buzix.controllers;

import com.Entra21.Buzix.dtos.RouteRequestDTO;
import com.Entra21.Buzix.dtos.RouteResponseDTO;
import com.Entra21.Buzix.entities.Route;
import com.Entra21.Buzix.repositories.RouteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/routes")
public class RouteController {
    private final RouteRepository routeRepository;

    public RouteController(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    //Cadastro de linha
    @PostMapping("/register")
    public RouteResponseDTO createRoute(@RequestBody RouteRequestDTO request) {
        Route route = new Route();

        route.setCode(request.getCode());
        route.setName(request.getName());
        route.setDescription(request.getDescription());
        route.setColor(request.getColor());

        routeRepository.save(route);

        return new RouteResponseDTO(route);
    }

    //Para listar todos
    @GetMapping("/all")
    public List<RouteResponseDTO> getAllRoutes() {
        List<Route> routes = routeRepository.findAll();
        return routes.stream()
                .map(RouteResponseDTO::new)
                .collect(Collectors.toList());
    }

    //Pesquisa linha por id
    @GetMapping("/{idRoute}")
    public RouteResponseDTO searchRouteById(@PathVariable Integer idRoute) {
        Route routes = routeRepository.findById(idRoute).orElseThrow();

        return new RouteResponseDTO(routes);
    }

    //Para pesquisa por nome
    @GetMapping("/search")
    public List<RouteResponseDTO> searchRoutesStartingWith(@RequestParam String prefix) {
        List<Route> routes = routeRepository.findByNameStartingWithIgnoreCase(prefix);
        return routes.stream()
                .map(RouteResponseDTO::new)
                .collect(Collectors.toList());
    }

    //Edita a linha
    @PutMapping("/{idRoute}")
    public RouteResponseDTO editRoute(@PathVariable Integer idRoute, @RequestBody RouteRequestDTO request) {
        Route route = routeRepository.findById(idRoute).orElseThrow();

        route.setCode(request.getCode());
        route.setName(request.getName());
        route.setDescription(request.getDescription());
        route.setColor(request.getColor());

        routeRepository.save(route);

        return new RouteResponseDTO(route);
    }

    //Deleta a linha
    @DeleteMapping("/{idRoute}")
    public RouteResponseDTO removeRoute(@PathVariable Integer idRoute) {
        Route route = routeRepository.findById(idRoute).orElseThrow();

        routeRepository.delete(route);

        return new RouteResponseDTO(route);
    }
}
