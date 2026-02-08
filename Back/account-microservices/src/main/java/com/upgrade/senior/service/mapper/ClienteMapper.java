package com.upgrade.senior.service.mapper;

import com.upgrade.senior.service.dto.cliente.ClienteRequestDTO;
import com.upgrade.senior.service.dto.cliente.ClienteResponseDTO;
import com.upgrade.senior.persistence.Cliente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ClienteMapper {

    Cliente toEntity(ClienteRequestDTO dto);

    ClienteResponseDTO toResponseDTO(Cliente cliente);

    @Mapping(target = "clienteId", ignore = true)
    void updateEntityFromDto(ClienteRequestDTO dto, @MappingTarget Cliente entity);
}
