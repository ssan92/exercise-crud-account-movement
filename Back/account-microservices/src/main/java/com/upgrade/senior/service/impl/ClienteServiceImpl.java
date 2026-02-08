package com.upgrade.senior.service.impl;

import com.upgrade.senior.exception.ClienteNotFoundException;
import com.upgrade.senior.exception.GeneralException;
import com.upgrade.senior.persistence.Cliente;
import com.upgrade.senior.repository.ClienteRepository;
import com.upgrade.senior.service.ClienteService;
import com.upgrade.senior.service.dto.cliente.ClienteRequestDTO;
import com.upgrade.senior.service.dto.cliente.ClienteResponseDTO;
import com.upgrade.senior.service.mapper.ClienteMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    @Override
    @Transactional
    public ClienteResponseDTO crearCliente(ClienteRequestDTO clienteDTO) {
        if(clienteRepository.existsByIdentificacion(clienteDTO.getIdentificacion())){
            throw new GeneralException("Cliente con identificación " + clienteDTO.getIdentificacion() + " ya existe",412);
        }
        Cliente cliente = clienteMapper.toEntity(clienteDTO);
        Cliente saved = clienteRepository.save(cliente);
        return clienteMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponseDTO obtenerClientePorId(Long id) {
        return clienteRepository.findById(id)
                .map(clienteMapper::toResponseDTO).orElseThrow(() -> new ClienteNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> listarClientes() {
        return clienteRepository.findAll().stream()
                .map(clienteMapper::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public ClienteResponseDTO actualizarCliente(Long id, ClienteRequestDTO clienteDTO) {
        Cliente updated = clienteRepository.findById(id)
                .map(existing -> {
                    clienteMapper.updateEntityFromDto(clienteDTO, existing);

                    if (clienteDTO.getEstado() != null) {
                        existing.setEstado(clienteDTO.getEstado());
                    }
                    return clienteRepository.save(existing);
                })
                .orElseThrow(() -> new ClienteNotFoundException(id));
        return clienteMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void eliminarCliente(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new ClienteNotFoundException(id);
        }
        clienteRepository.deleteById(id);
    }
}
