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
- POST /api/auth/login              
- GET /api/auth/me             
```
---

### HuespedController
```
- GET /api/huespedes/buscar                 
- GET /api/huespedes/buscarPorId  
- DELETE /api/huespedes/borrar
- GET /api/huespedes/verificar-historial          

```
---

### HabitacionController
```
- GET /api/habitaciones/estado
```
---

### ReservaController
```
- POST /api/reservas/crear    
- GET /api/reservas/buscar
- POST /api/reservas/cancelar
- DELETE /api/reservas/cancelar/{id}
                        
```
---

### EstadiaController
```
- GET /api/estadia/buscar
- PUT /api/estadia/checkout/{id}
```
---

### FacturaController
```
- POST /api/factura/resumen
- POST /api/factura/generar
- GET /api/factura/buscar-cuit

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