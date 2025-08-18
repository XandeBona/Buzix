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
@RequestMapping("/empresa")
public class CompanyController {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // só ADMIN consegue acessar
    public ResponseEntity<String> getEmpresa() throws IOException {
        // caminho do arquivo HTML fora de /static
        Path path = Paths.get("src/main/resources/templates/empresa.html");
        String html = Files.readString(path, StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "text/html")
                .body(html);
    }
}