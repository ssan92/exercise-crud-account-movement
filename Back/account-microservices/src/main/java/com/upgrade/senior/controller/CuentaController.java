package com.upgrade.senior.controller;

import com.upgrade.senior.service.CuentaService;
import com.upgrade.senior.service.dto.cuenta.CuentaCreateDTO;
import com.upgrade.senior.service.dto.cuenta.CuentaResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api/cuentas")
@RequiredArgsConstructor
public class CuentaController {
    private final CuentaService cuentaService;

    @PostMapping
    public ResponseEntity<CuentaResponseDTO> createCuenta(@RequestBody CuentaCreateDTO cuentaRequest) {
        log.info("[POST] /api/cuentas - Request: {}", cuentaRequest);
        CuentaResponseDTO response = cuentaService.crearCuenta(cuentaRequest);
        log.info("[POST] /api/cuentas - Response: {}", response);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/cuenta/{numeroCuenta}")
    public ResponseEntity<CuentaResponseDTO> getCuenta(@PathVariable String numeroCuenta) {
        log.info("[GET] /api/cuentas/cuenta/{} - Request", numeroCuenta);
        CuentaResponseDTO response = cuentaService.obtenerCuentaPorNumeroCuenta(numeroCuenta);
        log.info("[GET] /api/cuentas/cuenta/{} - Response: {}", numeroCuenta, response);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{cuentaId}")
    public ResponseEntity<CuentaResponseDTO> getCuenta(@PathVariable Long cuentaId) {
        log.info("[GET] /api/cuentas/{} - Request", cuentaId);
        CuentaResponseDTO response = cuentaService.obtenerCuentaPorId(cuentaId);
        log.info("[GET] /api/cuentas/{} - Response: {}", cuentaId, response);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<CuentaResponseDTO>> getCuentas() {
        log.info("[GET] /api/cuentas - Request");
        List<CuentaResponseDTO> cuentas = cuentaService.listarCuentas();
        log.info("[GET] /api/cuentas - Response: {}", cuentas);
        return ResponseEntity.ok(cuentas);
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<CuentaResponseDTO>> getCuentasPorCliente(@PathVariable Long clienteId) {
        log.info("[GET] /api/cuentas/cliente/{} - Request", clienteId);
        List<CuentaResponseDTO> cuentas = cuentaService.obtenerCuentasPorClienteId(clienteId);
        log.info("[GET] /api/cuentas/cliente/{} - Response: {}", clienteId, cuentas);
        return ResponseEntity.ok(cuentas);
    }

    @PutMapping("/cuenta/{numeroCuenta}")
    public ResponseEntity<CuentaResponseDTO> updateCuenta(@PathVariable String numeroCuenta, @RequestBody CuentaCreateDTO cuentaRequest) {
        log.info("[PUT] /api/cuentas/cuenta/{} - Request: {}", numeroCuenta, cuentaRequest);
        CuentaResponseDTO response = cuentaService.actualizarCuenta(numeroCuenta, cuentaRequest);
        log.info("[PUT] /api/cuentas/cuenta/{} - Response: {}", numeroCuenta, response);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{cuentaId}")
    public ResponseEntity<Void> deleteCuenta(@PathVariable Long cuentaId) {
        log.info("[DELETE] /api/cuentas/{} - Request", cuentaId);
        cuentaService.eliminarCuenta(cuentaId);
        log.info("[DELETE] /api/cuentas/{} - Response: No Content", cuentaId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/cuenta/{numeroCuenta}")
    public ResponseEntity<Void> deleteCuentaByNumeroCuenta(@PathVariable String numeroCuenta) {
        log.info("[DELETE] /api/cuentas/cuenta/{} - Request", numeroCuenta);
        cuentaService.eliminarCuentaByNumeroCuenta(numeroCuenta);
        log.info("[DELETE] /api/cuentas/cuenta/{} - Response: No Content", numeroCuenta);
        return ResponseEntity.noContent().build();
    }
}
