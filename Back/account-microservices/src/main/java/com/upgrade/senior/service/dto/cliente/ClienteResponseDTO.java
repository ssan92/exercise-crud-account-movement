package com.upgrade.senior.service.dto.cliente;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@RequiredArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ClienteResponseDTO extends PersonaDTO {
    private Long clienteId;
    private String contrasena;
    private Boolean estado;
}
