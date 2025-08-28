package com.Entra21.Buzix.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class GraphHopperService {
    @Value("${graphhopper.api.key}")
    private String graphhopperApiKey;

    //Busca a chave API do GraphHopper
    public String getRoute(String pointsQuery) throws IOException {
        String url = "https://graphhopper.com/api/1/route?" + pointsQuery +
                "&vehicle=car&points_encoded=false&key=" + graphhopperApiKey;

        //Chamada HTTP para o GraphHopper
        var client = HttpClient.newHttpClient();
        var request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .build();

        try {
            var response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Erro de interrupção ao chamar GraphHopper", e);
        }
    }
}