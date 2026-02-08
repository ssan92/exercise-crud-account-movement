package com.upgrade.senior.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.upgrade.senior.service.ClienteService;
import com.upgrade.senior.service.dto.cliente.ClienteRequestDTO;
import com.upgrade.senior.service.dto.cliente.ClienteResponseDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(com.upgrade.senior.controller.ClienteController.class)
class ClienteControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private ClienteService clienteService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/clientes")
    void testCreateCliente() throws Exception {
        ClienteRequestDTO request = new ClienteRequestDTO();
        ClienteResponseDTO response = new ClienteResponseDTO();
        when(clienteService.crearCliente(any(ClienteRequestDTO.class))).thenReturn(response);
        mockMvc.perform(post("/api/clientes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("DELETE /api/clientes/{clienteId}")
    void testDeleteCliente() throws Exception {
        doNothing().when(clienteService).eliminarCliente(1L);
        mockMvc.perform(delete("/api/clientes/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("GET /api/clientes/{clienteId}")
    void testGetCliente() throws Exception {
        ClienteResponseDTO response = new ClienteResponseDTO();
        when(clienteService.obtenerClientePorId(1L)).thenReturn(response);
        mockMvc.perform(get("/api/clientes/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("GET /api/clientes")
    void testGetClientes() throws Exception {
        when(clienteService.listarClientes()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/clientes"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("PUT /api/clientes/{clienteId}")
    void testUpdateCliente() throws Exception {
        ClienteRequestDTO request = new ClienteRequestDTO();
        ClienteResponseDTO response = new ClienteResponseDTO();
        when(clienteService.actualizarCliente(eq(1L), any(ClienteRequestDTO.class))).thenReturn(response);
        mockMvc.perform(put("/api/clientes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}