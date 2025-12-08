
--CREAR HUESPEDES
--1
INSERT INTO direccion (calle, numero, departamento, piso, codigo_postal, localidad, provincia, pais)
VALUES ('Av. Corrientes', 550, 'B', 12, 1043, 'CABA', 'Buenos Aires', 'Argentina');

INSERT INTO persona (
    apellido, nombre, tipo_documento, num_documento, cuit, fecha_nacimiento, direccion_id, nacionalidad
)
VALUES (
    'López', 'Martín', 1, -- ⭐ '0' es el valor ORDINAL para DNI
    28987654, 20289876540, '1979-11-10', 
    (SELECT MAX(id) FROM direccion),
    'Argentina'
);
INSERT INTO huesped (id, telefono, email, ocupacion, condicionIva)
VALUES (
    (SELECT MAX(id) FROM persona), 
    '5491144556677', 'martin.lopez@mail.com', 'Arquitecto', 'CONSUMIDOR_FINAL'
);


--2
INSERT INTO direccion (calle, numero, departamento, piso, codigo_postal, localidad, provincia, pais)
VALUES ('San Martín', 800, 'Casa', 0, 4400, 'Salta', 'Salta', 'Argentina');

INSERT INTO persona (
    apellido, nombre, tipo_documento, num_documento, cuit, fecha_nacimiento, direccion_id, nacionalidad
)
VALUES (
    'Rodríguez', 'Carlos', 0, 
    18543210, 20185432104, '1965-02-01', 
    (SELECT MAX(id) FROM direccion),
    'Argentina'
);

INSERT INTO huesped (id, telefono, email, ocupacion, condicionIva)
VALUES (
    (SELECT MAX(id) FROM persona),
    '543874223344', 'carlos.rodriguez@trabajo.ar', 'Jubilado', 'EXENTO'
);
--3
INSERT INTO direccion (calle, numero, departamento, piso, codigo_postal, localidad, provincia, pais)
VALUES ('Rue Saint-Denis', 750, 0, 0, 50001, 'Montreal', 'Quebec', 'Canadá');

INSERT INTO persona (
    apellido, nombre, tipo_documento, num_documento, cuit, fecha_nacimiento, direccion_id, nacionalidad
)
VALUES (
    'Dubois', 'Sophie', 3,
    89123456, 0, '1995-07-25',
    (SELECT MAX(id) FROM direccion),
    'Canadiense'
);

INSERT INTO huesped (id, telefono, email, ocupacion, condicionIva)
VALUES (
    (SELECT MAX(id) FROM persona),
    '15147778899', 'sophie.dubois@travel.ca', 'Estudiante', 'CONSUMIDOR_FINAL'
);
--4
INSERT INTO direccion (calle, numero, departamento, piso, codigo_postal, localidad, provincia, pais)
VALUES ('Bv. Chacabuco', 350, '1A', 1, 5000, 'Córdoba', 'Córdoba', 'Argentina');

INSERT INTO persona (
    apellido, nombre, tipo_documento, num_documento, cuit, fecha_nacimiento, direccion_id, nacionalidad
)
VALUES (
    'Fernández', 'Laura', 0, -- ⭐ DNI
    35112233, 27351122338, '1988-04-15',
    (SELECT MAX(id) FROM direccion),
    'Argentina'
);

INSERT INTO huesped (id, telefono, email, ocupacion, condicionIva)
VALUES (
    (SELECT MAX(id) FROM persona),
    '5493516001234', 'laura.fernandez@empresa.com.ar', 'Gerente de Ventas', 'RESPONSABLE_INSCRIPTO'
);
--5
INSERT INTO direccion (calle, numero, departamento, piso, codigo_postal, localidad, provincia, pais)
VALUES ('Rua Augusta', 2000, 0, 0, 10000, 'São Paulo', 'São Paulo', 'Brasil');

INSERT INTO persona (
    apellido, nombre, tipo_documento, num_documento, cuit, fecha_nacimiento, direccion_id, nacionalidad
)
VALUES (
    'Santos', 'Joao', 3, -- 🇧🇷 Pasaporte (asumiendo que 3 = Pasaporte)
    90001000, 0, '1975-10-05',
    (SELECT MAX(id) FROM direccion),
    'Brasileña'
);

INSERT INTO huesped (id, telefono, email, ocupacion, condicionIva)
VALUES (
    (SELECT MAX(id) FROM persona),
    '5511987654321', 'joao.santos@mail.br', 'Empresario', 'CONSUMIDOR_FINAL'
);
--6
INSERT INTO direccion (calle, numero, departamento, piso, codigo_postal, localidad, provincia, pais)
VALUES ('Pellegrini', 1850, 0, 0, 2000, 'Rosario', 'Santa Fe', 'Argentina');

INSERT INTO persona (
    apellido, nombre, tipo_documento, num_documento, cuit, fecha_nacimiento, direccion_id, nacionalidad
)
VALUES (
    'Gómez', 'Ana', 0, -- ⭐ DNI
    30987123, 27309871230, '1983-01-20',
    (SELECT MAX(id) FROM direccion),
    'Argentina'
);

INSERT INTO huesped (id, telefono, email, ocupacion, condicionIva)
VALUES (
    (SELECT MAX(id) FROM persona),
    '543415550000', 'ana.gomez@rosario.net', 'Médica', 'MONOTRIBUTO'
);
--7
INSERT INTO direccion (calle, numero, departamento, piso, codigo_postal, localidad, provincia, pais)
VALUES ('Libertador', 900, 'A', 5, 1112, 'CABA', 'Buenos Aires', 'Argentina');

INSERT INTO persona (
    apellido, nombre, tipo_documento, num_documento, cuit, fecha_nacimiento, direccion_id, nacionalidad
)
VALUES (
    'Pérez', 'Hernán', 0, -- ⭐ DNI
    25444888, 20254448889, '1977-08-01',
    (SELECT MAX(id) FROM direccion),
    'Argentina'
);

INSERT INTO huesped (id, telefono, email, ocupacion, condicionIva)
VALUES (
    (SELECT MAX(id) FROM persona),
    '5491133221100', 'hernan.perez@consulting.ar', 'Consultor IT', 'RESPONSABLE_INSCRIPTO'
);
--8
INSERT INTO direccion (calle, numero, departamento, piso, codigo_postal, localidad, provincia, pais)
VALUES ('Avenida Providencia', 1500, '1002', 10, 7500000, 'Providencia', 'Santiago', 'Chile');

INSERT INTO persona (
    apellido, nombre, tipo_documento, num_documento, cuit, fecha_nacimiento, direccion_id, nacionalidad
)
VALUES (
    'Silva', 'Isidora', 2, 
    20111444, 0, '1999-03-22',
    (SELECT MAX(id) FROM direccion),
    'Chilena'
);

INSERT INTO huesped (id, telefono, email, ocupacion, condicionIva)
VALUES (
    (SELECT MAX(id) FROM persona),
    '56980001111', 'isi.silva@chilemail.cl', 'Diseñadora', 'CONSUMIDOR_FINAL'
);
INSERT INTO habitacion (
    numero_habitacion, 
    tipo, 
    cantidad_huespedes, 
    cantidad_camai, 
    cantidad_camad, 
    cantidad_camaks
) VALUES (
    101, 
    'Simple', 
    1, 
    1,  
    0, 
    0 
);
INSERT INTO habitacion (
    numero_habitacion, 
    tipo, 
    cantidad_huespedes, 
    cantidad_camai, 
    cantidad_camad, 
    cantidad_camaks
) VALUES (
    102, 
    'Simple', 
    1, 
    1, 
    0, 
    0 
);
INSERT INTO habitacion (
    numero_habitacion, 
    tipo, 
    cantidad_huespedes, 
    cantidad_camai, 
    cantidad_camad, 
    cantidad_camaks
) VALUES (
    106, 
    'Doble', 
    2, 
    2, 
    0, 
    0 
);
INSERT INTO habitacion (
    numero_habitacion, 
    tipo, 
    cantidad_huespedes, 
    cantidad_camai, 
    cantidad_camad, 
    cantidad_camaks
) VALUES (
    103, 
    'Simple', 
    1, 
    1,  
    0, 
    0 
);
INSERT INTO habitacion (
    numero_habitacion, 
    tipo, 
    cantidad_huespedes, 
    cantidad_camai, 
    cantidad_camad, 
    cantidad_camaks
) VALUES (
    104, 
    'Simple', 
    1, 
    1, 
    0, 
    0 
);
INSERT INTO habitacion (
    numero_habitacion, 
    tipo, 
    cantidad_huespedes, 
    cantidad_camai, 
    cantidad_camad, 
    cantidad_camaks
) VALUES (
    105, 
    'Doble', 
    2, 
    2, 
    0, 
    0 
);
-- 1. Habitación 101: OCUPADA (1)
INSERT INTO public.estado_habitacion (estado, fecha_fin, fecha_inicio, habitacion_id)
VALUES (1, '2025-12-15', '2025-12-08', 101);

-- 2. Habitación 102: FUERA_DE_SERVICIO (2)
INSERT INTO public.estado_habitacion (estado, fecha_fin, fecha_inicio, habitacion_id)
VALUES (2, '2025-12-31', '2025-12-08', 102);

-- 3. Habitación 103: OCUPADA (1)
INSERT INTO public.estado_habitacion (estado, fecha_fin, fecha_inicio, habitacion_id)
VALUES (1, '2025-12-10', '2025-12-05', 103);

-- 4. Habitación 104: FUERA_DE_SERVICIO (2)
INSERT INTO public.estado_habitacion (estado, fecha_fin, fecha_inicio, habitacion_id)
VALUES (2, '2025-12-09', '2025-11-20', 104);

-- 5. Habitación 105: OCUPADA (1)
INSERT INTO public.estado_habitacion (estado, fecha_fin, fecha_inicio, habitacion_id)
VALUES (1, '2025-12-20', '2025-12-08', 105);

-- 6. Habitación 106: OCUPADA (1)
INSERT INTO public.estado_habitacion (estado, fecha_fin, fecha_inicio, habitacion_id)
VALUES (1, '2025-12-09', '2025-12-07', 106);

-- 1. Estadia en Habitación 101 (Check-in hoy)
INSERT INTO public.estadia(
	fecha_check_in, valor_estadia, fecha_check_out, habitacion_id)
	VALUES ('2025-12-08', 15000.00, NULL, 101);

-- 2. Estadia en Habitación 103 (Check-in hace unos días)
INSERT INTO public.estadia(
	fecha_check_in, valor_estadia, fecha_check_out, habitacion_id)
	VALUES ('2025-12-05', 22500.50, NULL, 103);

-- 3. Estadia en Habitación 105 (Check-in hoy)
INSERT INTO public.estadia(
	fecha_check_in, valor_estadia, fecha_check_out, habitacion_id)
	VALUES ('2025-12-08', 18000.00, NULL, 105);

-- 4. Estadia en Habitación 106 (Check-in ayer)
INSERT INTO public.estadia(
	fecha_check_in, valor_estadia, fecha_check_out, habitacion_id)
	VALUES ('2025-12-07', 12000.00, NULL, 106);

-- 5. Estadia en Habitación 104 (Check-in de hace unos días, alto valor)
INSERT INTO public.estadia(
	fecha_check_in, valor_estadia, fecha_check_out, habitacion_id)
	VALUES ('2025-12-06', 30000.00, NULL, 104);
	
--Asociamos a los huespedes con estadias
UPDATE public.huesped
SET estadia_id = 1
WHERE id = (SELECT id FROM public.persona WHERE apellido = 'López' AND nombre = 'Martín');

-- 2. Asignar Estadia ID 2 a Rodríguez, Carlos (Hab. 103)
UPDATE public.huesped
SET estadia_id = 2
WHERE id = (SELECT id FROM public.persona WHERE apellido = 'Rodríguez' AND nombre = 'Carlos');

-- 3. Asignar Estadia ID 3 a Dubois, Sophie (Hab. 105)
UPDATE public.huesped
SET estadia_id = 3
WHERE id = (SELECT id FROM public.persona WHERE apellido = 'Dubois' AND nombre = 'Sophie');

-- 4. Asignar Estadia ID 4 a Fernández, Laura (Hab. 106)
UPDATE public.huesped
SET estadia_id = 4
WHERE id = (SELECT id FROM public.persona WHERE apellido = 'Fernández' AND nombre = 'Laura');

-- 5. Asignar Estadia ID 5 a Santos, Joao (Hab. 104)
UPDATE public.huesped
SET estadia_id = 5
WHERE id = (SELECT id FROM public.persona WHERE apellido = 'Santos' AND nombre = 'Joao');

UPDATE public.huesped
SET estadia_id = 4
WHERE id = (SELECT id FROM public.persona WHERE apellido = 'Gómez' AND nombre = 'Ana');

-- 7. Asignar Estadia ID 3 a Pérez, Hernán (Acompañante en Hab. 105)
UPDATE public.huesped
SET estadia_id = 3
WHERE id = (SELECT id FROM public.persona WHERE apellido = 'Pérez' AND nombre = 'Hernán');
-- --- ESTADIA ID 1 (Habitación 101) ---

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (4500.00, 1, 'Consumo', NULL, 'PENDIENTE', 'BAR');

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (9200.00, 1, 'Consumo', NULL, 'PENDIENTE', 'RESTAURANTE');

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (1800.50, 1, 'Consumo', NULL, 'PENDIENTE', 'MINIBAR');

-- --- ESTADIA ID 2 (Habitación 103) ---

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (2100.00, 2, 'Consumo', NULL, 'PENDIENTE', 'LAVANDERIA');

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (7800.00, 2, 'Consumo', NULL, 'PENDIENTE', 'RESTAURANTE');

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (3200.00, 2, 'Consumo', NULL, 'PENDIENTE', 'BAR');

-- --- ESTADIA ID 3 (Habitación 105 - Doble) ---

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (15000.00, 3, 'Consumo', NULL, 'PENDIENTE', 'RESTAURANTE');

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (4900.00, 3, 'Consumo', NULL, 'PENDIENTE', 'MINIBAR');

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (1500.00, 3, 'Consumo', NULL, 'PENDIENTE', 'LAVANDERIA');

-- --- ESTADIA ID 4 (Habitación 106 - Doble) ---

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (6700.00, 4, 'Consumo', NULL, 'PENDIENTE', 'BAR');

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (12500.00, 4, 'Consumo', NULL, 'PENDIENTE', 'RESTAURANTE');

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (2000.00, 4, 'Consumo', NULL, 'PENDIENTE', 'MINIBAR');

-- --- ESTADIA ID 5 (Habitación 104) ---

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (3000.00, 5, 'Consumo', NULL, 'PENDIENTE', 'LAVANDERIA');

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (11000.00, 5, 'Consumo', NULL, 'PENDIENTE', 'RESTAURANTE');

INSERT INTO public.consumo (valor, estadia_id, dtype, descripcion, estado, tipo)
VALUES (5500.00, 5, 'Consumo', NULL, 'PENDIENTE', 'BAR');