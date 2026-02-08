package com.upgrade.senior.controller;

import com.upgrade.senior.service.ClienteService;
import com.upgrade.senior.service.dto.cliente.ClienteRequestDTO;
import com.upgrade.senior.service.dto.cliente.ClienteResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {
    private final ClienteService clienteService;

    @PostMapping
    public ResponseEntity<ClienteResponseDTO> createCliente(@RequestBody @Valid ClienteRequestDTO clienteRequest) {
        log.info("[POST] /api/clientes - Request: {}", clienteRequest);
        ClienteResponseDTO response = clienteService.crearCliente(clienteRequest);
        log.info("[POST] /api/clientes - Response: {}", response);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{clienteId}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Long clienteId) {
        log.info("[DELETE] /api/clientes/{} - Request", clienteId);
        clienteService.eliminarCliente(clienteId);
        log.info("[DELETE] /api/clientes/{} - Response: No Content", clienteId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{clienteId}")
    public ResponseEntity<ClienteResponseDTO> getCliente(@PathVariable Long clienteId) {
        log.info("[GET] /api/clientes/{} - Request", clienteId);
        ClienteResponseDTO response = clienteService.obtenerClientePorId(clienteId);
        log.info("[GET] /api/clientes/{} - Response: {}", clienteId, response);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> getClientes() {
        log.info("[GET] /api/clientes - Request");
        List<ClienteResponseDTO> clientes = clienteService.listarClientes();
        log.info("[GET] /api/clientes - Response: {}", clientes);
        return ResponseEntity.ok(clientes);
    }

    @PutMapping("/{clienteId}")
    public ResponseEntity<ClienteResponseDTO> updateCliente(@PathVariable Long clienteId, @RequestBody @Valid ClienteRequestDTO clienteRequest) {
        log.info("[PUT] /api/clientes/{} - Request: {}", clienteId, clienteRequest);
        ClienteResponseDTO response = clienteService.actualizarCliente(clienteId, clienteRequest);
        log.info("[PUT] /api/clientes/{} - Response: {}", clienteId, response);
        return ResponseEntity.ok(response);
    }
}
