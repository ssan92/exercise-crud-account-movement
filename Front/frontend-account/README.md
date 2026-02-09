# Frontend Account

Aplicación Angular para la gestión de cuentas, clientes, movimientos y reportes. Generada con [Angular CLI](https://github.com/angular/angular-cli) 21.1.3.

## Requisitos

- **Node.js** 18.x o superior
- **npm** 8.x o superior
- **Backend** en ejecución (ver sección [Dependencia del backend](#dependencia-del-backend))

## Instalación

```bash
npm install
```

## Ejecutar la aplicación

```bash
npm start
```

O directamente con Angular CLI:

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200/` y se recargará automáticamente al modificar el código.

## Ejecutar tests

Para ejecutar las pruebas unitarias con [Vitest](https://vitest.dev/):

```bash
npm test
```

Para ejecutar los tests una sola vez (sin modo watch):

```bash
npm test -- --no-watch
```

## Dependencia del backend

Esta aplicación **requiere** que el backend esté en ejecución. El frontend consume la API en:

| Recurso | URL base |
|---------|----------|
| API | `http://localhost:8080/api` |
| Clientes | `http://localhost:8080/api/clientes` |
| Cuentas | `http://localhost:8080/api/cuentas` |
| Movimientos | `http://localhost:8080/api/movimientos` |
| Reportes | `http://localhost:8080/api/reportes` |

### Cómo levantar el backend

El backend se encuentra en `Back/account-microservices`. Para ejecutarlo:

1. **Con Gradle** (MySQL local):
   ```bash
   cd Back/account-microservices
   ./gradlew bootRun
   ```

2. **Con Docker Compose** (MySQL + Spring Boot):
   ```bash
   cd Back/account-microservices
   docker compose up --build
   ```

Consultar `Back/account-microservices/README.md` para requisitos detallados (Java 17, MySQL, etc.) y configuración.

---

## Build

```bash
npm run build
```

Los artefactos se generan en `dist/`.

## Estructura del proyecto

- `src/app/core/` — Modelos y servicios de API
- `src/app/features/` — Módulos: clientes, cuentas, movimientos, reportes
- `src/app/shared/` — Componentes compartidos (layout, sidebar)

## Recursos adicionales

Para más información sobre Angular CLI: [Angular CLI Overview](https://angular.dev/tools/cli)
