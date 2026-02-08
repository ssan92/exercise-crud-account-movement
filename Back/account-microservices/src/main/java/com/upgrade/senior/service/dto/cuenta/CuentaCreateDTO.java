package com.upgrade.senior.service.dto.cuenta;

import com.upgrade.senior.enums.TipoCuenta;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class CuentaCreateDTO {
    @NotNull
    @NotEmpty
    private String numeroCuenta;
    @NotNull
    private TipoCuenta tipoCuenta;
    private Double saldoInicial;
    private Boolean estado=true;
    private Long clienteId;
}
