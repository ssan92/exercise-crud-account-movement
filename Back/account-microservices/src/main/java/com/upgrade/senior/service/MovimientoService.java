package com.upgrade.senior.service;


import com.upgrade.senior.service.dto.movimiento.MovimientoCreateDTO;
import com.upgrade.senior.service.dto.movimiento.MovimientoResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface MovimientoService {

    MovimientoResponseDTO crearMovimiento(MovimientoCreateDTO dto);
    List<MovimientoResponseDTO> obtenerMovimientosPorCuenta(String numeroCuenta);
    List<MovimientoResponseDTO> obtenerMovimientosPorClienteYFechas(Long clienteId, LocalDate fechaInicio, LocalDate fechaFin);
    MovimientoResponseDTO obtenerMovimientoPorId(Long id);
    void eliminarMovimiento(Long id);

}
