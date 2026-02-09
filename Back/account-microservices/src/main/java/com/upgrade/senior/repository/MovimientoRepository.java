package com.upgrade.senior.repository;

import com.upgrade.senior.persistence.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {
    List<Movimiento> findByCuenta_NumeroCuenta(String numeroCuenta);
    
    @Query("SELECT m FROM Movimiento m WHERE m.cuenta.cliente.clienteId = :clienteId " +
            "AND m.fecha >= :fechaInicio AND m.fecha < :fechaFin " +
            "ORDER BY m.fecha DESC")
    List<Movimiento> findMovimientosPorClienteYFechas(@Param("clienteId") Long clienteId, 
                                                       @Param("fechaInicio") LocalDateTime fechaInicio, 
                                                       @Param("fechaFin") LocalDateTime fechaFin);
}
