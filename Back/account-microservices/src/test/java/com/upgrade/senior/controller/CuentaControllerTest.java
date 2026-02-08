package com.upgrade.senior.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.upgrade.senior.service.CuentaService;
import com.upgrade.senior.service.dto.cuenta.CuentaCreateDTO;
import com.upgrade.senior.service.dto.cuenta.CuentaResponseDTO;
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

@WebMvcTest(CuentaController.class)
class CuentaControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private CuentaService cuentaService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("POST /api/cuentas")
    void testCreateCuenta() throws Exception {
        CuentaCreateDTO request = new CuentaCreateDTO();
        CuentaResponseDTO response = new CuentaResponseDTO();
        when(cuentaService.crearCuenta(any(CuentaCreateDTO.class))).thenReturn(response);
        mockMvc.perform(post("/api/cuentas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("DELETE /api/cuentas/{cuentaId}")
    void testDeleteCuenta() throws Exception {
        doNothing().when(cuentaService).eliminarCuenta(1L);
        mockMvc.perform(delete("/api/cuentas/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("GET /api/cuentas/cuenta/{numeroCuenta}")
    void testGetCuentaByNumeroCuenta() throws Exception {
        CuentaResponseDTO response = new CuentaResponseDTO();
        when(cuentaService.obtenerCuentaPorNumeroCuenta("123")).thenReturn(response);
        mockMvc.perform(get("/api/cuentas/cuenta/123"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("GET /api/cuentas/{cuentaId}")
    void testGetCuentaById() throws Exception {
        CuentaResponseDTO response = new CuentaResponseDTO();
        when(cuentaService.obtenerCuentaPorId(1L)).thenReturn(response);
        mockMvc.perform(get("/api/cuentas/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("GET /api/cuentas")
    void testGetCuentas() throws Exception {
        when(cuentaService.listarCuentas()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/cuentas"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("PUT /api/cuentas/cuenta/{numeroCuenta}")
    void testUpdateCuenta() throws Exception {
        CuentaCreateDTO request = new CuentaCreateDTO();
        CuentaResponseDTO response = new CuentaResponseDTO();
        when(cuentaService.actualizarCuenta(eq("1"), any(CuentaCreateDTO.class))).thenReturn(response);
        mockMvc.perform(put("/api/cuentas/cuenta/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
}