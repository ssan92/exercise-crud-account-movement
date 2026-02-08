package com.upgrade.senior.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.upgrade.senior.service.MovimientoService;
import com.upgrade.senior.service.dto.movimiento.MovimientoCreateDTO;
import com.upgrade.senior.service.dto.movimiento.MovimientoResponseDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MovimientoController.class)
class MovimientoControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private MovimientoService movimientoService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/movimientos")
    void testCreateMovimiento() throws Exception {
        MovimientoCreateDTO request = new MovimientoCreateDTO();
        MovimientoResponseDTO response = new MovimientoResponseDTO();
        when(movimientoService.crearMovimiento(any(MovimientoCreateDTO.class))).thenReturn(response);
        mockMvc.perform(post("/api/movimientos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("GET /api/movimientos/cuenta/{numeroCuenta}")
    void testGetByCuenta() throws Exception {
        when(movimientoService.obtenerMovimientosPorCuenta("123")).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/movimientos/cuenta/123"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("GET /api/movimientos/cliente/{clienteId}")
    void testGetByClienteAndDates() throws Exception {
        when(movimientoService.obtenerMovimientosPorClienteYFechas(eq(1L), any(), any())).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/movimientos/cliente/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("GET /api/movimientos/{id}")
    void testGetById() throws Exception {
        MovimientoResponseDTO response = new MovimientoResponseDTO();
        when(movimientoService.obtenerMovimientoPorId(1L)).thenReturn(response);
        mockMvc.perform(get("/api/movimientos/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("DELETE /api/movimientos/{id}")
    void testDelete() throws Exception {
        doNothing().when(movimientoService).eliminarMovimiento(1L);
        mockMvc.perform(delete("/api/movimientos/1"))
                .andExpect(status().isNoContent());
    }
}