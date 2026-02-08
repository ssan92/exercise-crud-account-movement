
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

-- Ajuste de la secuencia para cliente_id, cuenta_id y movimiento_id
-- H2 (comentado)
-- ALTER TABLE cliente ALTER COLUMN cliente_id RESTART WITH (SELECT MAX(cliente_id) + 1 FROM cliente);
-- ALTER TABLE cuenta ALTER COLUMN cuenta_id RESTART WITH (SELECT MAX(cuenta_id) + 1 FROM cuenta);
-- ALTER TABLE movimiento ALTER COLUMN movimiento_id RESTART WITH (SELECT MAX(movimiento_id) + 1 FROM movimiento);
