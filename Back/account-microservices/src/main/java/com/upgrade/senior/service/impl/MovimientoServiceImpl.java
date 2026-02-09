package com.upgrade.senior.service.impl;


import com.upgrade.senior.enums.TipoMovimiento;
import com.upgrade.senior.exception.GeneralException;
import com.upgrade.senior.persistence.Cuenta;
import com.upgrade.senior.persistence.Movimiento;
import com.upgrade.senior.repository.CuentaRepository;
import com.upgrade.senior.repository.MovimientoRepository;
import com.upgrade.senior.service.MovimientoService;
import com.upgrade.senior.service.dto.movimiento.MovimientoCreateDTO;
import com.upgrade.senior.service.dto.movimiento.MovimientoResponseDTO;
import com.upgrade.senior.service.mapper.MovimientoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovimientoServiceImpl implements MovimientoService {
    public static final String MOVIMIENTO_NO_ENCONTRADO = "Movimiento no encontrado";
    private final MovimientoRepository movimientoRepository;
    private final CuentaRepository cuentaRepository;
    private final MovimientoMapper movimientoMapper;

    @Override
    @Transactional
    public MovimientoResponseDTO crearMovimiento(MovimientoCreateDTO dto) {
        Cuenta cuenta = cuentaRepository.findByNumeroCuenta(dto.getNumeroCuenta())
                .orElseThrow(() -> new GeneralException("Cuenta no encontrada", 404));

        double saldoAnterior = cuenta.getSaldoInicial();
        double valor = Math.abs(dto.getValor());
        if (valor == 0) {
            throw new GeneralException("El valor del movimiento debe ser mayor a cero", 400);
        }
        double saldoNuevo;

        if (dto.getTipoMovimiento() == TipoMovimiento.DEBITO) {
            saldoNuevo = saldoAnterior - valor;
            if (saldoNuevo < 0) {
                throw new GeneralException("Saldo insuficiente para el débito", 412);
            }
        } else if (dto.getTipoMovimiento() == TipoMovimiento.CREDITO) {
            saldoNuevo = saldoAnterior + valor;
        } else {
            throw new GeneralException("Tipo de movimiento inválido", 400);
        }

        Movimiento movimiento = movimientoMapper.toEntity(dto);
        movimiento.setCuenta(cuenta);
        movimiento.setFecha(LocalDateTime.now());
        movimiento.setSaldo(saldoNuevo);

        cuenta.setSaldoInicial(saldoNuevo);
        cuentaRepository.save(cuenta);
        movimientoRepository.save(movimiento);
        return movimientoMapper.toResponseDTO(movimiento);
    }

    private double getValorConSigno(Movimiento mov) {
        if (mov.getTipoMovimiento() == TipoMovimiento.DEBITO) {
            return -Math.abs(mov.getValor());
        } else if (mov.getTipoMovimiento() == TipoMovimiento.CREDITO) {
            return Math.abs(mov.getValor());
        }
        return mov.getValor();
    }

    @Override
    public List<MovimientoResponseDTO> obtenerMovimientosPorCuenta(String numeroCuenta) {
        return movimientoRepository.findByCuenta_NumeroCuenta(numeroCuenta)
                .stream().map(mov -> {
                    MovimientoResponseDTO dto = movimientoMapper.toResponseDTO(mov);
                    dto.setValor(getValorConSigno(mov));
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    public List<MovimientoResponseDTO> obtenerMovimientosPorClienteYFechas(Long clienteId, LocalDate fechaInicio, LocalDate fechaFin) {
        // Si las fechas no están presentes, usar la fecha actual
        LocalDate now = LocalDate.now();
        if (fechaInicio == null) fechaInicio = now;
        if (fechaFin == null) fechaFin = now;
        
        return movimientoRepository.findMovimientosPorClienteYFechas(clienteId, fechaInicio, fechaFin)
                .stream().map(mov -> {
                    MovimientoResponseDTO dto = movimientoMapper.toResponseDTO(mov);
                    dto.setValor(getValorConSigno(mov));
                    return dto;
                }).collect(Collectors.toList());
    }

    @Override
    public MovimientoResponseDTO obtenerMovimientoPorId(Long id) {
        return movimientoRepository.findById(id)
                .map(mov -> {
                    MovimientoResponseDTO dto = movimientoMapper.toResponseDTO(mov);
                    dto.setValor(getValorConSigno(mov));
                    return dto;
                })
                .orElseThrow(() -> new GeneralException(MOVIMIENTO_NO_ENCONTRADO, 404));
    }

    @Override
    public void eliminarMovimiento(Long id) {
        if (!movimientoRepository.existsById(id)) {
            throw new GeneralException(MOVIMIENTO_NO_ENCONTRADO, 404);
        }
        movimientoRepository.deleteById(id);
    }
}
