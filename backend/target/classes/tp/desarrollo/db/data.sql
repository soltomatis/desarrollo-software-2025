-- ============================
-- Tabla: direccion
-- ============================
INSERT INTO direccion (id, calle, codigo_postal, departamento, localidad, numero, pais, piso, provincia)
VALUES
(1,'San Martín',3100,'Depto A','Paraná',101,'Argentina',1,'Entre Ríos'),
(2,'Belgrano',3100,'Depto B','Paraná',102,'Argentina',2,'Entre Ríos'),
(3,'Mitre',3100,'Depto C','Paraná',103,'Argentina',3,'Entre Ríos'),
(4,'Urquiza',3100,'Depto D','Paraná',104,'Argentina',4,'Entre Ríos'),
(5,'Corrientes',3100,'Depto E','Paraná',105,'Argentina',5,'Entre Ríos'),
(6,'Buenos Aires',3100,'Depto F','Paraná',106,'Argentina',6,'Entre Ríos'),
(7,'Santa Fe',3100,'Depto G','Paraná',107,'Argentina',7,'Entre Ríos'),
(8,'Italia',3100,'Depto H','Paraná',108,'Argentina',8,'Entre Ríos'),
(9,'España',3100,'Depto I','Paraná',109,'Argentina',9,'Entre Ríos'),
(10,'Francia',3100,'Depto J','Paraná',110,'Argentina',10,'Entre Ríos');

-- ============================
-- Tabla: persona
-- ============================
INSERT INTO persona (id, apellido, cuit, fecha_nacimiento, nacionalidad, nombre, num_documento, tipo_documento, direccion_id)
VALUES
(1,'Gómez',20300111123,'1985-01-01','Argentina','Juan',30011112,1,1),
(2,'Pérez',20300111124,'1990-02-02','Argentina','Ana',30011113,1,2),
(3,'López',20300111125,'1988-03-03','Argentina','Carlos',30011114,1,3),
(4,'Martínez',20300111126,'1992-04-04','Argentina','Lucía',30011115,1,4),
(5,'Fernández',20300111127,'1980-05-05','Argentina','Diego',30011116,1,5),
(6,'Rodríguez',20300111128,'1995-06-06','Argentina','María',30011117,1,6),
(7,'Suárez',20300111129,'1987-07-07','Argentina','Pedro',30011118,1,7),
(8,'Torres',20300111130,'1993-08-08','Argentina','Sofía',30011119,1,8),
(9,'Ramírez',20300111131,'1984-09-09','Argentina','Jorge',30011120,1,9),
(10,'Morales',20300111132,'1991-10-10','Argentina','Carla',30011121,1,10);

-- ============================
-- Tabla: habitacion
-- ============================
INSERT INTO habitacion (numero_habitacion, cantidad_camad, cantidad_camai, cantidad_camaks, cantidad_huespedes, tipo)
VALUES
(1,1,0,0,1,'Single'),
(2,0,1,0,2,'Doble'),
(3,0,0,1,2,'Suite'),
(4,2,0,0,2,'Twin'),
(5,0,1,1,3,'Triple'),
(6,1,1,0,2,'Doble'),
(7,0,2,0,4,'Cuádruple'),
(8,0,0,2,4,'Suite'),
(9,3,0,0,3,'Triple'),
(10,0,1,0,2,'Doble');

-- ============================
-- Tabla: estadia
-- ============================
INSERT INTO estadia (id, fecha_check_in, fecha_check_out, valor_estadia, habitacion_id)
VALUES
(1,'2025-12-01','2025-12-05',20000,1),
(2,'2025-12-02','2025-12-06',25000,2),
(3,'2025-12-03','2025-12-07',30000,3),
(4,'2025-12-04','2025-12-08',22000,4),
(5,'2025-12-05','2025-12-09',27000,5),
(6,'2025-12-06','2025-12-10',28000,6),
(7,'2025-12-07','2025-12-11',32000,7),
(8,'2025-12-08','2025-12-12',35000,8),
(9,'2025-12-09','2025-12-13',18000,9),
(10,'2025-12-10','2025-12-14',21000,10);

-- ============================
-- Tabla: huesped
-- ============================
INSERT INTO huesped (id, condicioniva, email, ocupacion, telefono, estadia_id)
VALUES
(1,'CONSUMIDOR_FINAL','juan@example.com','Ingeniero','3435000001',1),
(2,'MONOTRIBUTO','ana@example.com','Docente','3435000002',2),
(3,'RESPONSABLE_INSCRIPTO','carlos@example.com','Abogado','3435000003',3),
(4,'EXENTO','lucia@example.com','Estudiante','3435000004',4),
(5,'CONSUMIDOR_FINAL','diego@example.com','Médico','3435000005',5),
(6,'MONOTRIBUTO','maria@example.com','Arquitecta','3435000006',6),
(7,'RESPONSABLE_INSCRIPTO','pedro@example.com','Contador','3435000007',7),
(8,'EXENTO','sofia@example.com','Diseñadora','3435000008',8),
(9,'CONSUMIDOR_FINAL','jorge@example.com','Comerciante','3435000009',9),
(10,'MONOTRIBUTO','carla@example.com','Administrativa','3435000010',10);

-- ============================
-- Tabla: reserva
-- ============================
INSERT INTO reserva (id, huesped_id)
VALUES
(1,1),(2,2),(3,3),(4,4),(5,5),(6,6),(7,7),(8,8),(9,9),(10,10);

-- ============================
-- Tabla: reserva_habitacion
-- ============================
INSERT INTO reserva_habitacion (id, fecha_inicio, fecha_fin, habitacion_fk, id_reserva)
VALUES
(1,'2025-12-01','2025-12-05',1,1),
(2,'2025-12-02','2025-12-06',2,2),
(3,'2025-12-03','2025-12-07',3,3),
(4,'2025-12-04','2025-12-08',4,4),
(5,'2025-12-05','2025-12-09',5,5),
(6,'2025-12-06','2025-12-10',6,6),
(7,'2025-12-07','2025-12-11',7,7),
(8,'2025-12-08','2025-12-12',8,8),
(9,'2025-12-09','2025-12-13',9,9),
(10,'2025-12-10','2025-12-14',10,10);

-- ============================
-- Tabla: factura
-- ============================
INSERT INTO factura (id, estado, tipo_factura, total, responsable_de_pago_id, estadia_id)
VALUES
(1,'Emitida','A',20000,1,1),
(2,'Emitida','B',25000,2,2),
(3,'Emitida','A',30000,3,3),
(4,'Emitida','B',22000,4,4),
(5,'Emitida','A',27000,5,5),
(6,'Emitida','B',28000,6,6),
(7,'Emitida','A',32000,7,7),
(8,'Emitida','B',35000,8,8),
(9,'Emitida','A',18000,9,9),
(10,'Emitida','B',21000,10,10);

-- ============================
-- Tabla: consumo
-- ============================
INSERT INTO consumo (id, dtype, estado, tipo, valor, descripcion, estadia_id)
VALUES
(1,'Servicio','Pagado','Minibar',500,'Agua',1),
(2,'Servicio','Pagado','Restaurante',1500,'Cena',2),
(4,'Servicio','Pendiente','Lavandería',800,'Lavado de ropa',4),
(5,'Servicio','Pagado','Restaurante',1200,'Almuerzo',5),
(6,'Servicio','Pendiente','Minibar',600,'Snacks',6),
(7,'Servicio','Pagado','Spa',2500,'Masaje',7),
(8,'Servicio','Pagado','Restaurante',1800,'Cena gourmet',8),
(9,'Servicio','Pendiente','Lavandería',700,'Planchado',9),
(10,'Servicio','Pagado','Minibar',400,'Refresco',10);

-- ============================
-- Tabla: estado_habitacion
-- ============================
INSERT INTO estado_habitacion (id, estado, fecha_inicio, fecha_fin, habitacion_id)
VALUES
(1,1,'2025-12-01','2025-12-05',1),
(2,2,'2025-12-02','2025-12-06',2),
(3,1,'2025-12-03','2025-12-07',3),
(4,3,'2025-12-04','2025-12-08',4),
(5,1,'2025-12-05','2025-12-09',5),
(6,2,'2025-12-06','2025-12-10',6),
(7,1,'2025-12-07','2025-12-11',7),
(8,3,'2025-12-08','2025-12-12',8),
(9,1,'2025-12-09','2025-12-13',9),
(10,2,'2025-12-10','2025-12-14',10);

-- ============================
-- Tabla: divisa
-- ============================
INSERT INTO divisa (tipo, cotizacion)
VALUES
('ARS',1.0),
('USD',1000.0),
('EUR',1100.0),
('GBP',1300.0),
('BRL',200.0),
('CLP',0.5),
('UYU',25.0),
('JPY',7.0),
('CAD',800.0),
('MXN',50.0);

-- ============================
-- Tabla: nota_de_credito
-- ============================
INSERT INTO nota_de_credito (numero_nota, importe_neto, importe_total, iva, responsable_de_pago_id)
VALUES
(1,1000,1210,210,1),
(2,2000,2420,420,2),
(3,1500,1815,315,3),
(4,1800,2178,378,4),
(5,2200,2662,462,5),
(6,2500,3025,525,6),
(7,1700,2057,357,7),
(8,3000,3630,630,8),
(9,1200,1452,252,9),
(10,2000,2420,420,10);

-- ============================
-- Tabla: pago
-- ============================
INSERT INTO pago (id, dtype, estado, fecha_pago, monto, banco_emisor, fecha_cobro, numero_cheque, tipo, monto_de_pago, fecha_vencimiento, nombre_titular, numero_tarjeta, red_de_pago, divisa_tipo, factura_id)
VALUES
(1,'Pago','Pagado','2025-12-01',20000,'Banco Nación','2025-12-02',NULL,'Tarjeta',20000,'2025-12-30','Juan Gómez',1111,'Visa','ARS',1),
(2,'Pago','Pagado','2025-12-02',25000,'Banco Galicia','2025-12-03',NULL,'Tarjeta',25000,'2025-12-30','Ana Pérez',2222,'Mastercard','ARS',2),
(3,'Pago','Pendiente','2025-12-03',30000,'Banco Santander',NULL,NULL,'Cheque',30000,'2025-12-31','Carlos López',NULL,NULL,'ARS',3),
(4,'Pago','Pagado','2025-12-04',22000,'Banco Nación','2025-12-05',NULL,'Tarjeta',22000,'2025-12-30','Lucía Martínez',3333,'Visa','ARS',4),
(5,'Pago','Pagado','2025-12-05',27000,'Banco Galicia','2025-12-06',NULL,'Tarjeta',27000,'2025-12-30','Diego Fernández',4444,'Mastercard','ARS',5),
(6,'Pago','Pendiente','2025-12-06',28000,'Banco Santander',NULL,NULL,'Cheque',28000,'2025-12-31','María Rodríguez',NULL,NULL,'ARS',6),
(7,'Pago','Pagado','2025-12-07',32000,'Banco Nación','2025-12-08',NULL,'Tarjeta',32000,'2025-12-30','Pedro Suárez',5555,'Visa','ARS',7),
(8,'Pago','Pagado','2025-12-08',35000,'Banco Galicia','2025-12-09',NULL,'Tarjeta',35000,'2025-12-30','Sofía Torres',6666,'Mastercard','ARS',8),
(9,'Pago','Pendiente','2025-12-09',18000,'Banco Santander',NULL,NULL,'Cheque',18000,'2025-12-31','Jorge Ramírez',NULL,NULL,'ARS',9),
(10,'Pago','Pagado','2025-12-10',21000,'Banco Nación','2025-12-11',NULL,'Tarjeta',21000,'2025-12-30','Carla Morales',7777,'Visa','ARS',10);

-- ============================
-- Tabla: responsable_de_pago
-- ============================
INSERT INTO responsable_de_pago (id, razon_social)
VALUES
(1,'Juan Gómez'),
(2,'Ana Pérez'),
(3,'Carlos López'),
(4,'Lucía Martínez'),
(5,'Diego Fernández'),
(6,'María Rodríguez'),
(7,'Pedro Suárez'),
(8,'Sofía Torres'),
(9,'Jorge Ramírez'),
(10,'Carla Morales);