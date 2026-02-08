package com.upgrade.senior.service.impl;

import com.upgrade.senior.exception.ClienteNotFoundException;
import com.upgrade.senior.exception.CuentaNotFoundException;
import com.upgrade.senior.exception.GeneralException;
import com.upgrade.senior.persistence.Cuenta;
import com.upgrade.senior.repository.CuentaRepository;
import com.upgrade.senior.repository.ClienteRepository;
import com.upgrade.senior.service.CuentaService;
import com.upgrade.senior.service.dto.cuenta.CuentaCreateDTO;
import com.upgrade.senior.service.dto.cuenta.CuentaResponseDTO;
import com.upgrade.senior.service.mapper.CuentaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CuentaServiceImpl implements CuentaService {
    public static final String CUENTA_NO_EXISTE = "El número de cuenta no existe";
    private final CuentaRepository cuentaRepository;
    private final ClienteRepository clienteRepository;
    private final CuentaMapper cuentaMapper;

    @Override
    @Transactional
    public CuentaResponseDTO crearCuenta(CuentaCreateDTO cuentaDTO) {
        if (cuentaRepository.existsByNumeroCuenta(cuentaDTO.getNumeroCuenta())) {
            throw new GeneralException("El número de cuenta ya existe", 412);
        }
        if (!clienteRepository.existsById(cuentaDTO.getClienteId())) {
            throw new ClienteNotFoundException(cuentaDTO.getClienteId());
        }
        Cuenta cuenta = cuentaMapper.toEntity(cuentaDTO);
        cuenta.setCliente(clienteRepository.findById(cuentaDTO.getClienteId()).orElseThrow());
        Cuenta saved = cuentaRepository.save(cuenta);
        return cuentaMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CuentaResponseDTO obtenerCuentaPorId(Long id) {
        return cuentaRepository.findById(id)
                .map(cuentaMapper::toResponseDTO)
                .orElseThrow(() -> new CuentaNotFoundException(id));
    }

    @Override
    public CuentaResponseDTO obtenerCuentaPorNumeroCuenta(String numeroCuenta) {
        return cuentaRepository.findByNumeroCuenta(numeroCuenta)
                .map(cuentaMapper::toResponseDTO)
                .orElseThrow(() -> new GeneralException(CUENTA_NO_EXISTE,412));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CuentaResponseDTO> listarCuentas() {
        return cuentaRepository.findAll().stream().map(cuentaMapper::toResponseDTO).toList();
    }

    @Override
    @Transactional
    public CuentaResponseDTO actualizarCuenta(String numeroCuenta, CuentaCreateDTO cuentaDTO) {
        Cuenta cuenta = cuentaRepository.findByNumeroCuenta(numeroCuenta)
                .orElseThrow(() -> new GeneralException(CUENTA_NO_EXISTE,412));
        cuentaMapper.updateEntityFromDto(cuentaDTO, cuenta);
        // Validar y actualizar el cliente
        if (cuentaDTO.getClienteId() != null) {
            if (!clienteRepository.existsById(cuentaDTO.getClienteId())) {
                throw new ClienteNotFoundException(cuentaDTO.getClienteId());
            }
            cuenta.setCliente(clienteRepository.findById(cuentaDTO.getClienteId()).orElseThrow());
        }
        Cuenta updated = cuentaRepository.save(cuenta);
        return cuentaMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void eliminarCuenta(Long id) {
        if (!cuentaRepository.existsById(id)) {
            throw new CuentaNotFoundException(id);
        }
        cuentaRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void eliminarCuentaByNumeroCuenta(String numeroCuenta) {
        if (!cuentaRepository.existsByNumeroCuenta(numeroCuenta)) {
            throw new GeneralException(CUENTA_NO_EXISTE,412);
        }
        cuentaRepository.deleteByNumeroCuenta(numeroCuenta);
    }
}
