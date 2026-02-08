package com.upgrade.senior.service.dto.reporte;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class ReporteEstadoCuentaResponseDTO {
    private String fechaReporte;
    private String cliente;
    private List<CuentaReporteDTO> cuentas;
}
