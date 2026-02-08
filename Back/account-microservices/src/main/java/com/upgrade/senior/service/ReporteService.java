package com.upgrade.senior.service;

import com.upgrade.senior.service.dto.reporte.ReporteEstadoCuentaPDFResponseDTO;
import com.upgrade.senior.service.dto.reporte.ReporteEstadoCuentaResponseDTO;

import java.time.LocalDate;

public interface ReporteService {
    ReporteEstadoCuentaResponseDTO generarEstadoCuenta(Long clienteId, LocalDate fechaInicio, LocalDate fechaFin);
    ReporteEstadoCuentaPDFResponseDTO generarEstadoCuentaPDF(Long clienteId, java.time.LocalDate fechaInicio, java.time.LocalDate fechaFin);
}
