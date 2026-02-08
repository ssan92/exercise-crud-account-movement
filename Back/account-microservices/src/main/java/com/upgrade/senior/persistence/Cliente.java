package com.upgrade.senior.persistence;

import com.upgrade.senior.enums.Genero;
import jakarta.persistence.*;
import java.util.List;
import lombok.Data;

@Data
@Entity
@Table(name = "cliente")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 10)
    @Enumerated(EnumType.STRING)
    private Genero genero;

    @Column(nullable = false)
    private Integer edad;

    @Column(nullable = false, length = 20, unique = true)
    private String identificacion;

    @Column(nullable = false, length = 200)
    private String direccion;

    @Column(nullable = false, length = 20)
    private String telefono;

    @Column(nullable = false, length = 200)
    private String contrasena;

    @Column(nullable = false)
    private Boolean estado;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cuenta> cuentas;
}
