package com.upgrade.senior.service.impl;


import com.upgrade.senior.exception.ClienteNotFoundException;
import com.upgrade.senior.persistence.Cliente;
import com.upgrade.senior.repository.ClienteRepository;
import com.upgrade.senior.service.dto.cliente.ClienteRequestDTO;
import com.upgrade.senior.service.dto.cliente.ClienteResponseDTO;
import com.upgrade.senior.service.mapper.ClienteMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClienteServiceImplTest {

    @Mock
    private ClienteRepository clienteRepository;
    @Mock
    private ClienteMapper clienteMapper;
    @InjectMocks
    private ClienteServiceImpl clienteService;

    @Test
    void testCrearCliente() {
        ClienteRequestDTO requestDTO = ClienteRequestDTO.builder().build();
        Cliente cliente = new Cliente();
        Cliente saved = new Cliente();
        ClienteResponseDTO responseDTO = ClienteResponseDTO.builder().build();
        when(clienteMapper.toEntity(requestDTO)).thenReturn(cliente);
        when(clienteRepository.save(cliente)).thenReturn(saved);
        when(clienteMapper.toResponseDTO(saved)).thenReturn(responseDTO);
        ClienteResponseDTO result = clienteService.crearCliente(requestDTO);
        assertEquals(responseDTO, result);
        verify(clienteRepository).save(cliente);
    }

    @Test
    void testObtenerClientePorId_found() {
        Long id = 1L;
        Cliente cliente = new Cliente();
        ClienteResponseDTO responseDTO = ClienteResponseDTO.builder().build();
        when(clienteRepository.findById(id)).thenReturn(Optional.of(cliente));
        when(clienteMapper.toResponseDTO(cliente)).thenReturn(responseDTO);
        ClienteResponseDTO result = clienteService.obtenerClientePorId(id);
        assertEquals(responseDTO, result);
    }

    @Test
    void testObtenerClientePorId_notFound() {
        Long id = 1L;
        when(clienteRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(ClienteNotFoundException.class, () -> clienteService.obtenerClientePorId(id));
    }

    @Test
    void testListarClientes() {
        Cliente cliente1 = new Cliente();
        Cliente cliente2 = new Cliente();
        ClienteResponseDTO dto1 = ClienteResponseDTO.builder().build();
        ClienteResponseDTO dto2 = ClienteResponseDTO.builder().build();
        when(clienteRepository.findAll()).thenReturn(Arrays.asList(cliente1, cliente2));
        when(clienteMapper.toResponseDTO(cliente1)).thenReturn(dto1);
        when(clienteMapper.toResponseDTO(cliente2)).thenReturn(dto2);
        List<ClienteResponseDTO> result = clienteService.listarClientes();
        assertEquals(2, result.size());
        assertTrue(result.contains(dto1));
        assertTrue(result.contains(dto2));
    }

    @Test
    void testActualizarCliente_found() {
        Long id = 1L;
        ClienteRequestDTO requestDTO = ClienteRequestDTO.builder().build();
        Cliente existing = new Cliente();
        Cliente saved = new Cliente();
        ClienteResponseDTO responseDTO = ClienteResponseDTO.builder().build();
        when(clienteRepository.findById(id)).thenReturn(Optional.of(existing));
        when(clienteRepository.save(existing)).thenReturn(saved);
        when(clienteMapper.toResponseDTO(saved)).thenReturn(responseDTO);
        ClienteResponseDTO result = clienteService.actualizarCliente(id, requestDTO);
        assertEquals(responseDTO, result);
    }

    @Test
    void testActualizarCliente_notFound() {
        Long id = 1L;
        ClienteRequestDTO requestDTO = ClienteRequestDTO.builder().build();
        when(clienteRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(ClienteNotFoundException.class, () -> clienteService.actualizarCliente(id, requestDTO));
    }

    @Test
    void testEliminarCliente_found() {
        Long id = 1L;
        when(clienteRepository.existsById(id)).thenReturn(true);
        doNothing().when(clienteRepository).deleteById(id);
        assertDoesNotThrow(() -> clienteService.eliminarCliente(id));
        verify(clienteRepository).deleteById(id);
    }

    @Test
    void testEliminarCliente_notFound() {
        Long id = 1L;
        when(clienteRepository.existsById(id)).thenReturn(false);
        assertThrows(ClienteNotFoundException.class, () -> clienteService.eliminarCliente(id));
    }
}