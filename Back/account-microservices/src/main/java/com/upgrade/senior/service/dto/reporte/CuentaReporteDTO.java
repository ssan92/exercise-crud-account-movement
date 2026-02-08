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
public class CuentaReporteDTO {
    private String numeroCuenta;
    private String tipo;
    private Double saldoInicial;
    private Boolean estado;
    private List<MovimientoReporteDTO> movimientos;
    private Double totalCreditos;
    private Double totalDebitos;
    private Double saldoFinal;
}
