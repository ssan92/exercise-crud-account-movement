package com.upgrade.senior.service;

import com.upgrade.senior.service.dto.cuenta.CuentaCreateDTO;
import com.upgrade.senior.service.dto.cuenta.CuentaResponseDTO;

import java.util.List;

public interface CuentaService {
    CuentaResponseDTO crearCuenta(CuentaCreateDTO cuenta);
    CuentaResponseDTO obtenerCuentaPorId(Long id);
    CuentaResponseDTO obtenerCuentaPorNumeroCuenta(String numeroCuenta);
    List<CuentaResponseDTO> listarCuentas();
    List<CuentaResponseDTO> obtenerCuentasPorClienteId(Long clienteId);
    CuentaResponseDTO actualizarCuenta(String numeroCuenta, CuentaCreateDTO cuenta);
    void eliminarCuenta(Long id);
    void eliminarCuentaByNumeroCuenta(String numeroCuenta);
}
