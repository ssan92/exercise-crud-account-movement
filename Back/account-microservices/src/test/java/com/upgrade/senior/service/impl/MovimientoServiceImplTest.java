package com.upgrade.senior.service.impl;


import com.upgrade.senior.enums.TipoMovimiento;
import com.upgrade.senior.exception.GeneralException;
import com.upgrade.senior.persistence.Cuenta;
import com.upgrade.senior.persistence.Movimiento;
import com.upgrade.senior.repository.CuentaRepository;
import com.upgrade.senior.repository.MovimientoRepository;
import com.upgrade.senior.service.dto.movimiento.MovimientoCreateDTO;
import com.upgrade.senior.service.dto.movimiento.MovimientoResponseDTO;
import com.upgrade.senior.service.mapper.MovimientoMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovimientoServiceImplTest {
    @Mock
    private MovimientoRepository movimientoRepository;
    @Mock
    private CuentaRepository cuentaRepository;
    @Mock
    private MovimientoMapper movimientoMapper;
    @InjectMocks
    private MovimientoServiceImpl movimientoService;

    @Test
    void testCrearMovimiento_debitoExitoso() {
        MovimientoCreateDTO dto = MovimientoCreateDTO.builder()
                .numeroCuenta("123")
                .tipoMovimiento(TipoMovimiento.DEBITO)
                .valor(50.0)
                .build();
        Cuenta cuenta = new Cuenta();
        cuenta.setSaldoInicial(100.0);
        Movimiento movimiento = new Movimiento();
        MovimientoResponseDTO responseDTO = MovimientoResponseDTO.builder().build();
        when(cuentaRepository.findByNumeroCuenta(dto.getNumeroCuenta())).thenReturn(Optional.of(cuenta));
        when(movimientoMapper.toEntity(dto)).thenReturn(movimiento);
        when(movimientoMapper.toResponseDTO(movimiento)).thenReturn(responseDTO);
        MovimientoResponseDTO result = movimientoService.crearMovimiento(dto);
        assertEquals(responseDTO, result);
        verify(cuentaRepository).save(any(Cuenta.class));
        verify(movimientoRepository).save(any(Movimiento.class));
    }

    @Test
    void testCrearMovimiento_debitoSaldoInsuficiente() {
        MovimientoCreateDTO dto = MovimientoCreateDTO.builder()
                .numeroCuenta("123")
                .tipoMovimiento(TipoMovimiento.DEBITO)
                .valor(200.0)
                .build();
        Cuenta cuenta = new Cuenta();
        cuenta.setSaldoInicial(100.0);
        when(cuentaRepository.findByNumeroCuenta(dto.getNumeroCuenta())).thenReturn(Optional.of(cuenta));
        GeneralException ex = assertThrows(GeneralException.class, () -> movimientoService.crearMovimiento(dto));
        assertEquals("Saldo insuficiente para el débito", ex.getMessage());
    }

    @Test
    void testCrearMovimiento_creditoExitoso() {
        MovimientoCreateDTO dto = MovimientoCreateDTO.builder()
                .numeroCuenta("123")
                .tipoMovimiento(TipoMovimiento.CREDITO)
                .valor(50.0)
                .build();
        Cuenta cuenta = new Cuenta();
        cuenta.setSaldoInicial(100.0);
        Movimiento movimiento = new Movimiento();
        MovimientoResponseDTO responseDTO = MovimientoResponseDTO.builder().build();
        when(cuentaRepository.findByNumeroCuenta(dto.getNumeroCuenta())).thenReturn(Optional.of(cuenta));
        when(movimientoMapper.toEntity(dto)).thenReturn(movimiento);
        when(movimientoMapper.toResponseDTO(movimiento)).thenReturn(responseDTO);
        MovimientoResponseDTO result = movimientoService.crearMovimiento(dto);
        assertEquals(responseDTO, result);
        verify(cuentaRepository).save(any(Cuenta.class));
        verify(movimientoRepository).save(any(Movimiento.class));
    }

    @Test
    void testCrearMovimiento_cuentaNoEncontrada() {
        MovimientoCreateDTO dto = MovimientoCreateDTO.builder()
                .numeroCuenta("123")
                .build();
        when(cuentaRepository.findByNumeroCuenta(dto.getNumeroCuenta())).thenReturn(Optional.empty());
        GeneralException ex = assertThrows(GeneralException.class, () -> movimientoService.crearMovimiento(dto));
        assertEquals("Cuenta no encontrada", ex.getMessage());
    }

    @Test
    void testObtenerMovimientosPorCuenta() {
        String numeroCuenta = "123";
        Movimiento mov1 = new Movimiento();
        mov1.setValor(10.0);
        Movimiento mov2 = new Movimiento();
        mov2.setValor(5.0);
        MovimientoResponseDTO dto1 = MovimientoResponseDTO.builder().build();
        MovimientoResponseDTO dto2 = MovimientoResponseDTO.builder().build();
        when(movimientoRepository.findByCuenta_NumeroCuenta(numeroCuenta)).thenReturn(Arrays.asList(mov1, mov2));
        when(movimientoMapper.toResponseDTO(mov1)).thenReturn(dto1);
        when(movimientoMapper.toResponseDTO(mov2)).thenReturn(dto2);
        List<MovimientoResponseDTO> result = movimientoService.obtenerMovimientosPorCuenta(numeroCuenta);
        assertEquals(2, result.size());
        assertTrue(result.contains(dto1));
        assertTrue(result.contains(dto2));
    }

    @Test
    void testObtenerMovimientosPorClienteYFechas() {
        Long clienteId = 1L;
        LocalDate fechaInicio = LocalDate.of(2024, 1, 1);
        LocalDate fechaFin = LocalDate.of(2024, 1, 31);
        Movimiento mov = new Movimiento();
        mov.setValor(15.0);
        MovimientoResponseDTO dto = MovimientoResponseDTO.builder().build();
        when(movimientoRepository.findMovimientosPorClienteYFechas(eq(clienteId), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(Collections.singletonList(mov));
        when(movimientoMapper.toResponseDTO(mov)).thenReturn(dto);
        List<MovimientoResponseDTO> result = movimientoService.obtenerMovimientosPorClienteYFechas(clienteId, fechaInicio, fechaFin);
        assertEquals(1, result.size());
        assertEquals(dto, result.get(0));
    }

    @Test
    void testObtenerMovimientosPorClienteYFechas_nullFechas() {
        Long clienteId = 1L;
        Movimiento mov = new Movimiento();
        mov.setValor(1.0);
        MovimientoResponseDTO dto = MovimientoResponseDTO.builder().build();
        when(movimientoRepository.findMovimientosPorClienteYFechas(eq(clienteId), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(Collections.singletonList(mov));
        when(movimientoMapper.toResponseDTO(mov)).thenReturn(dto);
        List<MovimientoResponseDTO> result = movimientoService.obtenerMovimientosPorClienteYFechas(clienteId, null, null);
        assertEquals(1, result.size());
        assertEquals(dto, result.get(0));
    }

    @Test
    void testObtenerMovimientoPorId_exito() {
        Long id = 1L;
        Movimiento mov = new Movimiento();
        mov.setValor(100.0);
        MovimientoResponseDTO dto = MovimientoResponseDTO.builder().build();
        when(movimientoRepository.findById(id)).thenReturn(Optional.of(mov));
        when(movimientoMapper.toResponseDTO(mov)).thenReturn(dto);
        MovimientoResponseDTO result = movimientoService.obtenerMovimientoPorId(id);
        assertEquals(dto, result);
    }

    @Test
    void testObtenerMovimientoPorId_noExiste() {
        Long id = 1L;
        when(movimientoRepository.findById(id)).thenReturn(Optional.empty());
        GeneralException ex = assertThrows(GeneralException.class, () -> movimientoService.obtenerMovimientoPorId(id));
        assertEquals("Movimiento no encontrado", ex.getMessage());
    }

    @Test
    void testEliminarMovimiento_exito() {
        Long id = 1L;
        when(movimientoRepository.existsById(id)).thenReturn(true);
        doNothing().when(movimientoRepository).deleteById(id);
        assertDoesNotThrow(() -> movimientoService.eliminarMovimiento(id));
        verify(movimientoRepository).deleteById(id);
    }

    @Test
    void testEliminarMovimiento_noExiste() {
        Long id = 1L;
        when(movimientoRepository.existsById(id)).thenReturn(false);
        GeneralException ex = assertThrows(GeneralException.class, () -> movimientoService.eliminarMovimiento(id));
        assertEquals("Movimiento no encontrado", ex.getMessage());
    }
}