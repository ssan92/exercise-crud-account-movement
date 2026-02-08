package com.upgrade.senior.controller;

import com.upgrade.senior.service.MovimientoService;
import com.upgrade.senior.service.dto.movimiento.MovimientoCreateDTO;
import com.upgrade.senior.service.dto.movimiento.MovimientoResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api/movimientos")
@RequiredArgsConstructor
public class MovimientoController {
    private final MovimientoService movimientoService;

    @PostMapping
    public ResponseEntity<MovimientoResponseDTO> createMovimiento(@RequestBody MovimientoCreateDTO dto) {
        log.info("[POST] /api/movimientos - Request: {}", dto);
        MovimientoResponseDTO response = movimientoService.crearMovimiento(dto);
        log.info("[POST] /api/movimientos - Response: {}", response);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/cuenta/{numeroCuenta}")
    public List<MovimientoResponseDTO> getByCuenta(@PathVariable String numeroCuenta) {
        log.info("[GET] /api/movimientos/cuenta/{} - Request", numeroCuenta);
        List<MovimientoResponseDTO> response = movimientoService.obtenerMovimientosPorCuenta(numeroCuenta);
        log.info("[GET] /api/movimientos/cuenta/{} - Response: {}", numeroCuenta, response);
        return response;
    }

    @GetMapping("/cliente/{clienteId}")
    public List<MovimientoResponseDTO> getByClienteAndDates(
            @PathVariable Long clienteId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate fechaFin) {
        log.info("[GET] /api/movimientos/cliente/{} - Request: fechaInicio={}, fechaFin={}", clienteId, fechaInicio, fechaFin);
        List<MovimientoResponseDTO> response = movimientoService.obtenerMovimientosPorClienteYFechas(clienteId, fechaInicio, fechaFin);
        log.info("[GET] /api/movimientos/cliente/{} - Response: {}", clienteId, response);
        return response;
    }

    @GetMapping("/{id}")
    public MovimientoResponseDTO getById(@PathVariable Long id) {
        log.info("[GET] /api/movimientos/{} - Request", id);
        MovimientoResponseDTO response = movimientoService.obtenerMovimientoPorId(id);
        log.info("[GET] /api/movimientos/{} - Response: {}", id, response);
        return response;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("[DELETE] /api/movimientos/{} - Request", id);
        movimientoService.eliminarMovimiento(id);
        log.info("[DELETE] /api/movimientos/{} - Response: No Content", id);
        return ResponseEntity.noContent().build();
    }
}
