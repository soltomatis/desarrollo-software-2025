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
## Variables de Entorno

`.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
---

## Flujo Principal

1. **Login** → Obtener token JWT
2. **Dashboard** → Menú de opciones
3. **Huéspedes** → Crear/buscar huésped
4. **Reservas** → Crear reserva (seleccionar habitación + fechas)
5. **Check-in** → Registrar ingreso de huésped
6. **Estadías** → Agregar consumos durante la estadía
7. **Facturas** → Generar factura con habitación + consumos
8. **Pagos** → Procesar pago de factura
9. **Check-out** → Dar de alta la habitación
---

## Autores

- **Alvarez, Juan Francisco**
- **Buxman, Martín**
- **Tomatis, María Sol**

---

**Última actualización:** Diciembre 8, 2025