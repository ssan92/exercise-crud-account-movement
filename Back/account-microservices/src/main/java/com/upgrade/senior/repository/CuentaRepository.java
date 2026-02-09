package com.upgrade.senior.repository;

import com.upgrade.senior.persistence.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CuentaRepository extends JpaRepository<Cuenta, Long> {
    Optional<Cuenta> findByNumeroCuenta(String numeroCuenta);
    boolean existsByNumeroCuenta(String numeroCuenta);
    void deleteByNumeroCuenta(String numeroCuenta);
    List<Cuenta> findByClienteClienteId(Long clienteId);
}
