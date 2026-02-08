package com.upgrade.senior.service.dto.movimiento;

import com.upgrade.senior.enums.TipoMovimiento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class MovimientoResponseDTO {
    private String movimientoId;
    private String numeroCuenta;
    private String fecha;
    private TipoMovimiento tipoMovimiento;
    private Double valor;
    private Double saldo;
}
