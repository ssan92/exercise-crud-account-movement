package com.upgrade.senior.service.dto.movimiento;

import com.upgrade.senior.enums.TipoMovimiento;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class MovimientoCreateDTO {
    @NotNull
    @NotEmpty
    private String numeroCuenta;
    @NotNull
    private TipoMovimiento tipoMovimiento;
    private Double valor;
}
