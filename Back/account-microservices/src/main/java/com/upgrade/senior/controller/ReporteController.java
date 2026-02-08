package com.upgrade.senior.controller;

import com.upgrade.senior.service.ReporteService;
import com.upgrade.senior.service.dto.reporte.ReporteEstadoCuentaPDFResponseDTO;
import com.upgrade.senior.service.dto.reporte.ReporteEstadoCuentaResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@Log4j2
@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteController {
    private final ReporteService reporteService;

    @GetMapping("/estado-cuenta")
    public ResponseEntity<?> getEstadoCuenta(
            @RequestParam Long clienteId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin,
            @RequestParam(defaultValue = "json") String formato
    ) {
        log.info("[GET] /api/reportes/estado-cuenta - Request: clienteId={}, fechaInicio={}, fechaFin={}, formato={}", clienteId, fechaInicio, fechaFin, formato);
        if ("pdf".equalsIgnoreCase(formato)) {
            ReporteEstadoCuentaPDFResponseDTO response = reporteService.generarEstadoCuentaPDF(clienteId, fechaInicio, fechaFin);
            log.info("[GET] /api/reportes/estado-cuenta - Response: PDF base64");
            return ResponseEntity.ok(response);
        } else {
            ReporteEstadoCuentaResponseDTO response = reporteService.generarEstadoCuenta(clienteId, fechaInicio, fechaFin);
            log.info("[GET] /api/reportes/estado-cuenta - Response: {}", response);
            return ResponseEntity.ok(response);
        }
    }
}
