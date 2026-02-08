package com.upgrade.senior.service.mapper;

import com.upgrade.senior.service.dto.cuenta.CuentaCreateDTO;
import com.upgrade.senior.service.dto.cuenta.CuentaResponseDTO;
import com.upgrade.senior.persistence.Cuenta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CuentaMapper {
    Cuenta toEntity(CuentaCreateDTO dto);

    void updateEntityFromDto(CuentaCreateDTO dto, @org.mapstruct.MappingTarget Cuenta cuenta);

    @Mapping(target = "clienteId", source = "cliente.clienteId")
    CuentaResponseDTO toResponseDTO(Cuenta cuenta);
}
