cat > /tmp/readme_simple.md << 'EOF'
# Sistema Hotelero - Implementación de Patrones de Diseño

**Trabajo Práctico Final - Desarrollo de Software 2025**

---

## Resumen Ejecutivo

Sistema hotelero **Spring Boot 3.x** con **Next.js 14** que implementa **3 patrones de diseño formales** en el backend para mejorar mantenibilidad, extensibilidad y calidad del código.

---
## Instalación y Configuración

### Requisitos Previos

- Java 21+
- Maven 3.9+
- PostgreSQL 16+
- Node.js 18+ (para frontend)

### Backend - Spring Boot

**Paso 1: Clonar/descargar proyecto**

```bash
cd backend
```

**Paso 2: Configurar base de datos**

Editar `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hotel_db
spring.datasource.username=postgres
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

**Paso 3: Crear base de datos**

```sql
CREATE DATABASE hotel_db;
```

**Paso 4: Compilar y ejecutar**

```bash
# Compilar
mvn clean compile

# Tests
mvn clean test

# Ejecutar
mvn spring-boot:run
```

Backend disponible en: `http://localhost:8080`

### Frontend - Next.js

```bash
cd ../frontend

# Instalar dependencias
npm install

# Ejecutar
npm run dev
```

Frontend disponible en: `http://localhost:3000`

---

## Casos de Uso Implementados

### AuthController
```
- POST /api/auth/login              // CU01 - Login
- GET /api/auth/me                  // Obtener usuario actual
- POST /api/auth/logout             // Logout
```
---

### HuespedController
```
- GET /api/huespedes                    // Listar todos
- GET /api/huespedes/{id}               // CU02 - Obtener por ID
- GET /api/huespedes/buscar?documento   // Buscar por documento
- GET /api/huespedes/buscar?email       // Buscar por email
- POST /api/huespedes/crear             // CU09 - Crear huésped
- PUT /api/huespedes/{id}               // CU10 - Editar huésped
- DELETE /api/huespedes/{id}            // CU11 - Eliminar huésped
```
---

### HabitacionController
```
- GET /api/habitaciones                     // Listar todas
- GET /api/habitaciones/{id}                // Obtener habitación
- GET /api/habitaciones/estado/{estado}     // Por estado (LIBRE, OCUPADA, etc)
- POST /api/habitaciones/{id}/check-in      // CU15 - Check-in
- POST /api/habitaciones/{id}/check-out     // CU15 - Check-out
```
---

### ReservaController
```
- GET /api/reservas                                            // Listar reservas
- GET /api/reservas/{id}                                       // Obtener reserva
- GET /api/reservas/huesped/{huespedId}                        // Por huésped
- GET /api/reservas/disponibilidad?fecha_inicio&fecha_fin      // Disponibilidad
- POST /api/reservas/crear                                     // CU04 - Crear reserva
- DELETE /api/reservas/{id}                                    // CU06 - Cancelar reserva
```
---

### EstadiaController
```
- GET /api/estadias                         // Listar estadías
- GET /api/estadias/{id}                    // Detalle estadía
- POST /api/estadias/{id}/consumos/agregar  // Agregar consumo
- GET /api/estadias/{id}/consumos           // Listar consumos
```
---

### FacturaController
```
- POST /api/factura/resumen                  // CU07 - Generar resumen
- POST /api/factura/generar                  // CU07 - Generar factura
- GET /api/factura/{id}/descargar            // Descargar PDF
- GET /api/facturas                          // Listar todas
- GET /api/facturas/{id}                     // Detalle factura
- GET /api/facturas/huesped/{huespedId}      // Por huésped
```
---

### PagoController

```
- POST /api/pagos/procesar           // CU16 - Procesar pago
- POST /api/pagos/registrar-manual   // Registrar pago manual
- GET /api/pagos                     // Listar pagos
- GET /api/pagos/{id}                // Detalle pago
- GET /api/pagos/factura/{facturaId} // Por factura
```

---
### Database connection error
**Solución:**
```bash
# Verificar PostgreSQL corriendo
psql -U postgres -d hotel_db

# Recrear BD
DROP DATABASE hotel_db;
CREATE DATABASE hotel_db;
```

---

## Archivos Importantes

- `application.properties` - Configuración BD, JWT, logging
- `pom.xml` - Dependencias Maven
- `schema.sql` - Script creación tablas
- `data.sql` - Datos iniciales

---

## Autores

- **Alvarez, Juan Francisco**
- **Buxman, Martín**
- **Tomatis, María Sol**

---

**Última actualización:** Diciembre 8, 2025