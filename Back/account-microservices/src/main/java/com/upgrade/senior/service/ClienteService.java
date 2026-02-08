package com.upgrade.senior.service;

import com.upgrade.senior.service.dto.cliente.ClienteRequestDTO;
import com.upgrade.senior.service.dto.cliente.ClienteResponseDTO;

import java.util.List;

public interface ClienteService {

    ClienteResponseDTO crearCliente(ClienteRequestDTO cliente);
    ClienteResponseDTO obtenerClientePorId(Long id);
    List<ClienteResponseDTO> listarClientes();
    ClienteResponseDTO actualizarCliente(Long id, ClienteRequestDTO cliente);
    void eliminarCliente(Long id);
}

