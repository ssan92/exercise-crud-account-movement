package com.upgrade.senior.repository;

import com.upgrade.senior.persistence.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {
    List<Movimiento> findByCuenta_NumeroCuenta(String numeroCuenta);
    
    @Query("SELECT m FROM Movimiento m WHERE m.cuenta.cliente.clienteId = :clienteId " +
            "AND CAST(m.fecha AS DATE) BETWEEN :fechaInicio AND :fechaFin " +
            "ORDER BY m.fecha DESC")
    List<Movimiento> findMovimientosPorClienteYFechas(@Param("clienteId") Long clienteId, 
                                                       @Param("fechaInicio") LocalDate fechaInicio, 
                                                       @Param("fechaFin") LocalDate fechaFin);
}
