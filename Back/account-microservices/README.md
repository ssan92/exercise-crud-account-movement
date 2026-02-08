# java-microservices-senior

## Requisitos
- Java 17 o superior
- Gradle
- Docker y Docker Compose
- Base de datos MySQL (se recomienda usar el contenedor incluido)

## Pasos para ejecutar el proyecto

### 1. Clonar el repositorio
```
git clone <url-del-repositorio>
cd java-microservices-senior
```

### 2. Configurar la base de datos

El proyecto está preparado para usar MySQL. Puedes levantar la base de datos con Docker Compose:

```
docker-compose up -d
```
Esto iniciará un contenedor MySQL y el servicio de la aplicación.

La configuración de la base de datos está en `src/main/resources/application.properties`.

### 3. Ejecutar la aplicación

Puedes ejecutar el proyecto localmente usando Gradle:

```
./gradlew bootRun
```

O puedes construir la imagen Docker y ejecutarla:

```
docker build -t java-microservices-senior .
docker run --rm -p 8080:8080 java-microservices-senior
```

### 4. Acceder a la API

La aplicación estará disponible en:
```
http://localhost:8080
```

### 5. Pruebas

Para ejecutar las pruebas unitarias:
```
./gradlew test
```

## Documentación
- Los endpoints y modelos están documentados en el archivo `ejercicio.md`.
- Puedes agregar Swagger/OpenAPI para documentación interactiva.

## Notas
- El proyecto sigue buenas prácticas de arquitectura, patrones de diseño y principios SOLID.
- El manejo de excepciones es centralizado.
- Los DTOs usan Lombok Builder.
- El mapeo entre entidades y DTOs se realiza con MapStruct.

## Contacto
Para dudas o sugerencias, contacta al equipo de desarrollo.
