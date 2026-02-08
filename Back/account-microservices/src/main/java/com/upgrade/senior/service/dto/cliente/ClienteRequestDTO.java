package com.upgrade.senior.service.dto.cliente;

import lombok.*;
import lombok.experimental.SuperBuilder;


@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@RequiredArgsConstructor
public class ClienteRequestDTO extends PersonaDTO {
    private Long clienteId;
    private String contrasena;
    private Boolean estado = true;
}
