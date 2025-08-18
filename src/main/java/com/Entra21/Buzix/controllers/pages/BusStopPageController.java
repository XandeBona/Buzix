package com.Entra21.Buzix.controllers.pages;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/ponto")
public class BusStopPageController {
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getPonto() throws IOException {
        Path path = Paths.get("src/main/resources/templates/ponto.html");
        String html = Files.readString(path, StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "text/html")
                .body(html);
    }
}
