
CREATE TABLE IF NOT EXISTS cliente (
                         cliente_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                         nombre VARCHAR(120) NOT NULL,
                         genero VARCHAR(10) NOT NULL,
                         edad INT NOT NULL,
                         identificacion VARCHAR(20) NOT NULL UNIQUE,
                         direccion VARCHAR(200) NOT NULL,
                         telefono VARCHAR(20) NOT NULL,
                         contrasena VARCHAR(200) NOT NULL,
                         estado BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS cuenta (
                        cuenta_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        numero_cuenta VARCHAR(20) NOT NULL UNIQUE,
                        tipo_cuenta VARCHAR(20) NOT NULL,
                        saldo_inicial DECIMAL(15,2) NOT NULL,
                        estado BOOLEAN NOT NULL,
                        cliente_id BIGINT NOT NULL,
                        CONSTRAINT fk_cuenta_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(cliente_id)
);

CREATE TABLE IF NOT EXISTS movimiento (
                            movimiento_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            cuenta_id BIGINT NOT NULL,
                            fecha TIMESTAMP NOT NULL,
                            tipo_movimiento VARCHAR(20) NOT NULL,
                            valor DECIMAL(15,2) NOT NULL,
                            saldo DECIMAL(15,2) NOT NULL,
                            CONSTRAINT fk_movimiento_cuenta FOREIGN KEY (cuenta_id) REFERENCES cuenta(cuenta_id)
);



-- Inserción de datos de ejemplo (clientes) con IDs explícitos
INSERT IGNORE INTO cliente (cliente_id, nombre, genero, edad, identificacion, direccion, telefono, contrasena, estado) VALUES
                                                                                                                    (1, 'Jose Lema', 'MASCULINO', 30, '1234567890', 'Otavalo sn y principal', '098254785', '1234', TRUE),
                                                                                                                    (2, 'Marianela Montalvo', 'FEMENINO', 28, '0987654321', 'Amazonas y NNUU', '097548965', '5678', TRUE),
                                                                                                                    (3, 'Juan Osorio', 'MASCULINO', 35, '1122334455', '13 junio y Equinoccial', '098874587', '9999', TRUE);

-- Inserción de cuentas con IDs explícitos y referencia directa a cliente_id
INSERT IGNORE INTO cuenta (cuenta_id, numero_cuenta, tipo_cuenta, saldo_inicial, estado, cliente_id) VALUES
                                                                                                  (1, '478758', 'AHORRO', 2000, TRUE, 1),
                                                                                                  (2, '225487', 'CORRIENTE', 100, TRUE, 2),
                                                                                                  (3, '495878', 'AHORRO', 0, TRUE, 3),
                                                                                                  (4, '496825', 'AHORRO', 540, TRUE, 2),
                                                                                                  (5, '585545', 'CORRIENTE', 1000, TRUE, 1);

-- Inserción de movimientos con IDs explícitos y referencia directa a cuenta_id
INSERT IGNORE INTO movimiento (movimiento_id, cuenta_id, fecha, tipo_movimiento, valor, saldo) VALUES
                                                                                            (1, 1, '2022-02-08 10:00:00', 'CREDITO', 600, 2600),
                                                                                            (2, 2, '2022-02-10 09:00:00', 'DEBITO', 575, 475),
                                                                                            (3, 3, '2022-02-08 11:00:00', 'CREDITO', 600, 600),
                                                                                            (4, 4, '2022-02-08 12:00:00', 'CREDITO', 150, 690);
