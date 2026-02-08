package com.upgrade.senior.service.dto.cliente;

import com.upgrade.senior.enums.Genero;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class PersonaDTO {
    @NotEmpty
    private String nombre;
    @NotNull
    private Genero genero;
    @NotNull
    private Integer edad;
    @NotNull
    @NotEmpty
    private String identificacion;
    private String direccion;
    private String telefono;
}
