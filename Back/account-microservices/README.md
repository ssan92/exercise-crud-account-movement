# java-microservices-senior

## Requisitos
* Java 17 o superior
* Gradle
* Docker y Docker Compose
* Base de datos MySQL (se recomienda usar el contenedor incluido)

## 1. Clonar el repositorio
```
git clone <url-del-repositorio>
cd Back\account-microservices
```
## 2. Configurar la base de datos
El proyecto está preparado para usar MySQL. Puedes levantar la base de datos junto con el microservicio usando Docker Compose:
```
docker compose up --build
```
Esto hará lo siguiente automáticamente:
* Descargará la imagen oficial de MySQL si no está en tu máquina.
* Creará el contenedor MySQL y la base accountmovement.
* Compilará y levantará el microservicio Spring Boot, conectado a MySQL.
* La configuración de la base de datos dentro del contenedor se encuentra en src/main/resources/application-test.properties, usando variables de entorno definidas en docker-compose.yml.

Nota: Tu configuración local permanece intacta en application.properties para usar MySQL local.

## 3. Ejecutar la aplicación
Existen varias formas de ejecutar la app, dependiendo de tus necesidades:

### a) Localmente con Gradle
```
./gradlew bootRun
```
* Ejecuta tu aplicación directamente desde el código.
* Útil para desarrollo o depuración sin usar Docker.
* Conecta a tu base de datos local según application.properties.

## b) Levantar todo con Docker Compose
```
docker compose up --build
```
* La opción más completa: levanta todos los servicios definidos (MySQL + Spring Boot) en un solo comando.
* Configuración de base de datos y profile test se aplican automáticamente.
* Recomendado para desarrollo integral o pruebas de integración.

## 4. Acceder a la API
La aplicación estará disponible en: http://localhost:8080

* Puedes probar los endpoints con Postman, CURL o un cliente HTTP.
* Los modelos y endpoints están documentados en ejercicio.md.
* Para documentación interactiva, se puede integrar Swagger/OpenAPI.

## 5. Ejecutar pruebas
Para correr las pruebas unitarias:
```
./gradlew test
```
## 6. Probar la API con Postman
Se incluye la colección de Postman: 
```
Account Movement.postman_collection.json
```

### Orden recomendado para probar los endpoints
1. Clientes
    - Create Client: Crear un nuevo cliente.
    - Get Client By Id: Obtener un cliente específico por ID.
    - Update Client by Id: Modificar un cliente existente.
    - Get Client All: Listar todos los clientes.
    - Delete Client: Eliminar un cliente por ID.
2. Cuentas
    - Create Account: Crear una cuenta para un cliente existente.
    - Get Account By numeroCuenta: Obtener una cuenta específica por número.
    - Update Account By numeroCuenta: Modificar la cuenta.
    - Get Account All: Listar todas las cuentas.
    - Delete Account By numeroCuenta: Eliminar una cuenta.
3. Movimientos
    - Create Movimiento: Crear un movimiento (crédito/débito) para una cuenta existente.
    - Get Movimiento By Account: Listar movimientos de una cuenta.
    - Get Movimiento All: Listar todos los movimientos de un cliente.
    - Delete Movimiento: Eliminar un movimiento por ID.
4. Reportes
    - /api/reportes/estado-cuenta: Obtener estado de cuenta de un cliente en formato json o pdf.

Importante: Algunos endpoints dependen de otros. No puedes crear una cuenta si el cliente no existe, ni un movimiento si la cuenta no existe.

### Cómo usar la colección
* Importa el archivo Account Movement.postman_collection.json en Postman.
* Asegúrate de que la aplicación esté corriendo en: http://localhost:8080
* Ejecuta los endpoints en el orden recomendado para evitar errores de referencia.
* Consejo: crea un environment en Postman con la variable baseUrl apuntando a http://localhost:8080.

## 7. Diagrama conceptual
```
Clientes
│
├──> Cuentas
│
└──> Movimientos
│
└──> Reportes (estado de cuenta)
```

Cada entidad depende de la anterior: no se puede crear una cuenta sin cliente, ni un movimiento sin cuenta. Los reportes consolidan la información de cuentas y movimientos por cliente.

## 8. Notas adicionales
* El proyecto sigue buenas prácticas de arquitectura, patrones de diseño y principios SOLID.
* Manejo centralizado de excepciones.
* Los DTOs usan Lombok Builder.
* Mapeo entre entidades y DTOs con MapStruct.
* La configuración de Spring Boot permite profiles, para no afectar la base local al ejecutar en Docker.

## 9. Contacto
Para dudas o sugerencias, contacta al equipo de desarrollo.