package com.upgrade.senior.service.dto.reporte;

import com.upgrade.senior.enums.TipoMovimiento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class MovimientoReporteDTO {
    private LocalDate fecha;
    private TipoMovimiento tipoMovimiento;
    private Double valor;
    private Double saldoDisponible;
}
