package com.upgrade.senior.service.impl;

import com.upgrade.senior.exception.ClienteNotFoundException;
import com.upgrade.senior.exception.CuentaNotFoundException;
import com.upgrade.senior.exception.GeneralException;
import com.upgrade.senior.persistence.Cuenta;
import com.upgrade.senior.persistence.Cliente;
import com.upgrade.senior.repository.CuentaRepository;
import com.upgrade.senior.repository.ClienteRepository;
import com.upgrade.senior.service.dto.cuenta.CuentaCreateDTO;
import com.upgrade.senior.service.dto.cuenta.CuentaResponseDTO;
import com.upgrade.senior.service.mapper.CuentaMapper;
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
class CuentaServiceImplTest {
    @Mock
    private CuentaRepository cuentaRepository;
    @Mock
    private ClienteRepository clienteRepository;
    @Mock
    private CuentaMapper cuentaMapper;
    @InjectMocks
    private CuentaServiceImpl cuentaService;

    @Test
    void testCrearCuenta_exito() {
        CuentaCreateDTO dto = CuentaCreateDTO.builder()
                .numeroCuenta("123")
                .clienteId(1L)
                .build();
        Cuenta cuenta = new Cuenta();
        Cliente cliente = new Cliente();
        Cuenta saved = new Cuenta();
        CuentaResponseDTO responseDTO = CuentaResponseDTO.builder().build();
        when(cuentaRepository.existsByNumeroCuenta(dto.getNumeroCuenta())).thenReturn(false);
        when(clienteRepository.existsById(dto.getClienteId())).thenReturn(true);
        when(cuentaMapper.toEntity(dto)).thenReturn(cuenta);
        when(clienteRepository.findById(dto.getClienteId())).thenReturn(Optional.of(cliente));
        when(cuentaRepository.save(cuenta)).thenReturn(saved);
        when(cuentaMapper.toResponseDTO(saved)).thenReturn(responseDTO);
        CuentaResponseDTO result = cuentaService.crearCuenta(dto);
        assertEquals(responseDTO, result);
    }

    @Test
    void testCrearCuenta_numeroCuentaExiste() {
        CuentaCreateDTO dto = CuentaCreateDTO.builder()
                .numeroCuenta("123")
                .build();
        when(cuentaRepository.existsByNumeroCuenta(dto.getNumeroCuenta())).thenReturn(true);
        GeneralException ex = assertThrows(GeneralException.class, () -> cuentaService.crearCuenta(dto));
        assertEquals("El número de cuenta ya existe", ex.getMessage());
    }

    @Test
    void testCrearCuenta_clienteNoExiste() {
        CuentaCreateDTO dto = CuentaCreateDTO.builder()
                .numeroCuenta("123")
                .clienteId(1L)
                .build();
        when(cuentaRepository.existsByNumeroCuenta(dto.getNumeroCuenta())).thenReturn(false);
        when(clienteRepository.existsById(dto.getClienteId())).thenReturn(false);
        assertThrows(ClienteNotFoundException.class, () -> cuentaService.crearCuenta(dto));
    }

    @Test
    void testObtenerCuentaPorId_exito() {
        Long id = 1L;
        Cuenta cuenta = new Cuenta();
        CuentaResponseDTO responseDTO = CuentaResponseDTO.builder().build();
        when(cuentaRepository.findById(id)).thenReturn(Optional.of(cuenta));
        when(cuentaMapper.toResponseDTO(cuenta)).thenReturn(responseDTO);
        CuentaResponseDTO result = cuentaService.obtenerCuentaPorId(id);
        assertEquals(responseDTO, result);
    }

    @Test
    void testObtenerCuentaPorId_noExiste() {
        Long id = 1L;
        when(cuentaRepository.findById(id)).thenReturn(Optional.empty());
        assertThrows(CuentaNotFoundException.class, () -> cuentaService.obtenerCuentaPorId(id));
    }

    @Test
    void testObtenerCuentaPorNumeroCuenta_exito() {
        String numero = "123";
        Cuenta cuenta = new Cuenta();
        CuentaResponseDTO responseDTO = CuentaResponseDTO.builder().build();
        when(cuentaRepository.findByNumeroCuenta(numero)).thenReturn(Optional.of(cuenta));
        when(cuentaMapper.toResponseDTO(cuenta)).thenReturn(responseDTO);
        CuentaResponseDTO result = cuentaService.obtenerCuentaPorNumeroCuenta(numero);
        assertEquals(responseDTO, result);
    }

    @Test
    void testObtenerCuentaPorNumeroCuenta_noExiste() {
        String numero = "123";
        when(cuentaRepository.findByNumeroCuenta(numero)).thenReturn(Optional.empty());
        assertThrows(GeneralException.class, () -> cuentaService.obtenerCuentaPorNumeroCuenta(numero));
    }

    @Test
    void testListarCuentas() {
        Cuenta cuenta1 = new Cuenta();
        Cuenta cuenta2 = new Cuenta();
        CuentaResponseDTO dto1 = CuentaResponseDTO.builder().build();
        CuentaResponseDTO dto2 = CuentaResponseDTO.builder().build();
        when(cuentaRepository.findAll()).thenReturn(Arrays.asList(cuenta1, cuenta2));
        when(cuentaMapper.toResponseDTO(cuenta1)).thenReturn(dto1);
        when(cuentaMapper.toResponseDTO(cuenta2)).thenReturn(dto2);
        List<CuentaResponseDTO> result = cuentaService.listarCuentas();
        assertEquals(2, result.size());
        assertTrue(result.contains(dto1));
        assertTrue(result.contains(dto2));
    }

    @Test
    void testActualizarCuenta_exito() {
        String numeroCuenta = "123";
        CuentaCreateDTO dto = CuentaCreateDTO.builder()
                .clienteId(2L)
                .build();
        Cuenta cuenta = new Cuenta();
        Cliente cliente = new Cliente();
        Cuenta updated = new Cuenta();
        CuentaResponseDTO responseDTO = CuentaResponseDTO.builder().build();
        when(cuentaRepository.findByNumeroCuenta(numeroCuenta)).thenReturn(Optional.of(cuenta));
        doNothing().when(cuentaMapper).updateEntityFromDto(dto, cuenta);
        when(clienteRepository.existsById(dto.getClienteId())).thenReturn(true);
        when(clienteRepository.findById(dto.getClienteId())).thenReturn(Optional.of(cliente));
        when(cuentaRepository.save(cuenta)).thenReturn(updated);
        when(cuentaMapper.toResponseDTO(updated)).thenReturn(responseDTO);
        CuentaResponseDTO result = cuentaService.actualizarCuenta(numeroCuenta, dto);
        assertEquals(responseDTO, result);
    }

    @Test
    void testEliminarCuenta_exito() {
        Long id = 1L;
        when(cuentaRepository.existsById(id)).thenReturn(true);
        doNothing().when(cuentaRepository).deleteById(id);
        assertDoesNotThrow(() -> cuentaService.eliminarCuenta(id));
        verify(cuentaRepository).deleteById(id);
    }

    @Test
    void testEliminarCuenta_noExiste() {
        Long id = 1L;
        when(cuentaRepository.existsById(id)).thenReturn(false);
        assertThrows(CuentaNotFoundException.class, () -> cuentaService.eliminarCuenta(id));
    }
}