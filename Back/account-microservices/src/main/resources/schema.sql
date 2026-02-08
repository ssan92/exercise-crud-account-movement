
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


