package com.upgrade.senior.service.mapper;

import com.upgrade.senior.persistence.Movimiento;
import com.upgrade.senior.service.dto.movimiento.MovimientoCreateDTO;
import com.upgrade.senior.service.dto.movimiento.MovimientoResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface MovimientoMapper {

    @Mapping(target = "numeroCuenta", source = "cuenta.numeroCuenta")
    MovimientoResponseDTO toResponseDTO(Movimiento movimiento);

    @Mapping(target = "cuenta", ignore = true) // Se asigna en el servicio
    Movimiento toEntity(MovimientoCreateDTO dto);
}
