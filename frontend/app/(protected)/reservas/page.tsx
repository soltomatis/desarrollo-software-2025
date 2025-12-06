'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Habitacion } from '@/interfaces/Habitacion';
import MostrarEstado from '@/components/MostrarEstado';
import GrillaSeleccionReserva, { BloqueSeleccionado, GrillaRef } from '@/components/GrillaSeleccionReserva';
import HabitacionCard, { ReservaHabitacionInfo } from '@/components/HabitacionCard';
import ToastNotification from '@/components/ToastNotification';
import Link from 'next/link';
interface HuespedDTO {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    ocupacion: string;
    condicionIVA: string;
    tipo_documento: string; 
    num_documento: number;
    cuit: number;
    fecha_nacimiento: string;
    direccion: DireccionDTO;
    nacionalidad: string;
}
interface DireccionDTO {
    calle: string;
    numero: number; 
    departamento: string;
    piso: number;    
    codigoPostal: number | null; 
    localidad: string;
    provincia: string;
    pais: string;
}
interface HuespedModalProps {
    huespedData: HuespedDTO;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onSave: () => void;
}
async function traerHabitaciones(desde: string, hasta: string) {
    const res = await fetch(`http://localhost:8080/api/habitaciones/estado?desde=${desde}&hasta=${hasta}`);
    if (!res.ok) throw new Error('Error al conectar con el servidor');
    return res.json();
}

export default function PaginaNuevaReserva() {
    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
    const router = useRouter();
    const [cargando, setCargando] = useState(false);
    const [fechasBusqueda, setFechasBusqueda] = useState<{ desde: string, hasta: string } | null>(null);
    const [mostrarModalHuesped, setMostrarModalHuesped] = useState(false);
    const [bloquesSeleccionados, setBloquesSeleccionados] = useState<BloqueSeleccionado[]>([]); 
    const [mostrarBotonReserva, setMostrarBotonReserva] = useState(false);
    const grillaRef = useRef<GrillaRef>(null);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
    const closeToast = () => setToast(null);

    const cancelarSeleccion = () => {
    if (grillaRef.current) {
        grillaRef.current.limpiarSeleccion();
    } else {
        setBloquesSeleccionados([]); 
    }

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    setMostrarBotonReserva(false);
    setToast({
        message: "Selección de reserva rechazada. Seleccione un nuevo rango.",
        type: 'info'
    });
    };
    const handleConflict = (message: string) => {
    setToast({
        message: message,
        type: 'error'
    });
    };

    const [huespedData, setHuespedData] = useState<HuespedDTO>({ 
    nombre: '',
    apellido: '',
    telefono: '',

    email: 'huesped_temp@hotel.com',
    ocupacion: 'Sin especificar',
    condicionIVA: 'CONSUMIDOR_FINAL', 
    tipo_documento: 'DNI', 
    num_documento: 99999999,
    cuit: 20999999990,      
    fecha_nacimiento: '2000-01-01', 
    nacionalidad: 'Argentina',
    direccion: { 
        calle: 'Av. Temporal', 
        numero: 1, 
        departamento: '', 
        piso: 0,          
        codigoPostal: null, 
        localidad: 'Ciudad Temporal', 
        provincia: 'Provincia Temporal',
        pais: 'Argentina'
    }, 
});

const [seleccion, setSeleccion] = useState<any>({ 
      habitaciones: [], 
      fechaInicio: null, 
      fechaFin: null 
}); 

const parseFecha = (s: string): Date => {
  if (!s) return new Date(NaN);
  if (s.includes('T')) {
    const d = new Date(s);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  }

  let sep = '-';
  if (s.includes('/')) sep = '/';
  const parts = s.split(sep).map(p => p.trim());
  if (parts.length !== 3) {
    return new Date(s);
  }


  if (parts[0].length === 4) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  } else {

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }
};

const generarDias = (inicio: string, fin: string) => {
  const lista: string[] = [];
  const fechaIni = parseFecha(inicio);
  const fechaFin = parseFecha(fin);

  if (isNaN(fechaIni.getTime()) || isNaN(fechaFin.getTime())) {
    console.error('generarDias: formato de fecha inválido', inicio, fin);
    return lista;
  }

  const actual = new Date(fechaIni.getTime());
  while (actual <= fechaFin) {
    lista.push(actual.toISOString().split('T')[0]);
    actual.setDate(actual.getDate() + 1);
  }
  return lista;
};

const existeAlgunDiaLibre = (datos: Habitacion[], desde: string, hasta: string) => {
  const diasRango = generarDias(desde, hasta);
  if (diasRango.length === 0) return false;

  const diasTimestamps = diasRango.map(d => parseFecha(d).getTime());

  console.log('DEBUG: diasRango', diasRango);

  for (const tsDia of diasTimestamps) {
    const diaISO = new Date(tsDia).toISOString().split('T')[0];
    for (const hab of datos) {
      if (!hab.historiaEstados || hab.historiaEstados.length === 0) {
        console.log(`DEBUG: hab ${hab.numeroHabitacion} libre por ausencia de historia en ${diaISO}`);
        return true;
      }

      let cubreEseDia = false;
      for (const est of hab.historiaEstados) {
        if (!est.fechaInicio) continue;

        const inicioTs = parseFecha(est.fechaInicio).getTime();
        const finTs = (est.fechaFin ? parseFecha(est.fechaFin) : parseFecha(est.fechaInicio)).getTime();
        const desdeTs = Math.min(inicioTs, finTs);
        const hastaTs = Math.max(inicioTs, finTs);

        if (tsDia >= desdeTs && tsDia <= hastaTs) {
          cubreEseDia = true;
          break;
        }
      }

      if (!cubreEseDia) {
        console.log(`DEBUG: hab ${hab.numeroHabitacion} libre en ${diaISO} (ningún estado lo cubre)`);
        return true;
      } else {
        console.log(`DEBUG: hab ${hab.numeroHabitacion} ocupada en ${diaISO}`);
      }
    }
  }

  console.log('DEBUG: No existe ningun dia libre en ninguna habitacion para el rango');
  return false;
};

const buscar = async (desde: string, hasta: string) => {
  setCargando(true);
  setHabitaciones([]);
  setFechasBusqueda({ desde, hasta });

  try {
    const datos: Habitacion[] = await traerHabitaciones(desde, hasta);
    if (!existeAlgunDiaLibre(datos, desde, hasta)) {
        setHabitaciones([]);
        setToast({
            message: "No hay por lo menos un día libre en ninguna habitación dentro del rango seleccionado.",
            type: 'error'
        });
        return;
        }

    if (!datos || datos.length === 0) {
      setToast({
        message: "No hay habitaciones en el sistema para las fechas solicitadas.",
        type: 'error'
      });
      return;
    }

    setHabitaciones(datos);

  } catch (error) {
    console.error("Error al buscar habitaciones:", error);
    setToast({
      message: "Error al obtener la disponibilidad. Revisa la conexión con el servidor.",
      type: 'error'
    });
  } finally {
    setCargando(false);
  }
};
    const manejarSeleccion = (bloques: BloqueSeleccionado[]) => {
        setBloquesSeleccionados(bloques);
        setMostrarBotonReserva(bloques.length > 0);
    };

const realizarReserva = async () => {
        if (bloquesSeleccionados.length === 0 || !huespedData.nombre || !huespedData.apellido) {
            alert("Selecciona bloques y completa los datos del huésped principal.");
            return;
        }

        const listaHabitacionesReservadas: any[] = [];
        let totalBloques = 0;
        
        bloquesSeleccionados.forEach(bloque => {
            bloque.habitaciones.forEach(habNum => {
                totalBloques++;
            
                const habCompleta = habitaciones.find(h => h.numeroHabitacion === habNum);

                if (habCompleta) {
                    listaHabitacionesReservadas.push({
                        habitacion: {
                            numeroHabitacion: habCompleta.numeroHabitacion,
                            tipo: habCompleta.tipo,
                            cantidadHuespedes: habCompleta.cantidadHuespedes,
                            cantidadCamaI: habCompleta.cantidadCamaI,
                            cantidadCamaD: habCompleta.cantidadCamaD,
                            cantidadCamaKS: habCompleta.cantidadCamaKS,
                            historiaEstados: habCompleta.historiaEstados,
                        },
                        fecha_inicio: bloque.fechaInicio,
                        fecha_fin: bloque.fechaFin,
                    });
                }
            });
        });

        const reservaDTO = {
            listaHabitacionesReservadas: listaHabitacionesReservadas,
            huespedPrincipal: huespedData 
        };

        const confirmacion = window.confirm(
            `¿Confirmar la reserva de ${totalBloques} bloques para el huésped ${huespedData.nombre} ${huespedData.apellido}?`
        );
        
        if (!confirmacion) return;

        try {
            const res = await fetch('http://localhost:8080/api/reservas/crear', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservaDTO)
            });
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error desconocido al crear reserva.');
            }
            setToast({
                message: "¡Reserva realizada con éxito! Redirigiendo al inicio...",
                type: 'success'
            });

            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push('/');

        } catch (error: any) {
        setToast({
            message: `Fallo en la reserva: ${error.message}`,
            type: 'error'
        });
            console.error(error);
        }
    };
    
    const handleChangeHuesped = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHuespedData(prev => ({ 
            ...prev, 
            [name]: name === 'num_documento' ? parseInt(value) || 0 : value 
        }));
    };

    const listaHabitacionesParaMostrar: ReservaHabitacionInfo[] = [];

    if (bloquesSeleccionados.length > 0) {
        bloquesSeleccionados.forEach(bloque => {
            bloque.habitaciones.forEach(habNum => {
                const habCompleta = habitaciones.find(h => h.numeroHabitacion === habNum);

                if (habCompleta) {
                    listaHabitacionesParaMostrar.push({
                        habitacion: habCompleta,
                        fecha_inicio: bloque.fechaInicio,
                        fecha_fin: bloque.fechaFin,
                    });
                }
            });
        });
    }

    return (
        <div className="container" style={{ padding: '40px', color: '#333' }}>
          <h1>📅 Nueva Reserva (Selección de Rango)</h1>
          <Link href="/" style={{ display: 'block', marginBottom: '20px', color: 'blue' }}>← Volver al inicio</Link>

          <MostrarEstado onSearch={buscar} />

          {cargando && <p>Cargando datos...</p>}

          {habitaciones.length > 0 && fechasBusqueda && (
              <>
                  <GrillaSeleccionReserva
                    habitaciones={habitaciones}
                    fechaDesde={fechasBusqueda.desde}
                    fechaHasta={fechasBusqueda.hasta}
                    onSelect={manejarSeleccion}
                    ref={grillaRef}
                    onConflict={handleConflict}
                />
                  
                    {mostrarBotonReserva && (
                    <>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '30px', marginBottom: '15px' }}>
                        Resumen de Habitaciones Seleccionadas
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {listaHabitacionesParaMostrar.map((reserva, index) => (
                            <HabitacionCard 
                                key={`${reserva.habitacion.numeroHabitacion}-${reserva.fecha_inicio}-${index}`}
                                reservaInfo={reserva}
                            />
                        ))}
                    </div>
                    
                    <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
                        
                        <button 
                            onClick={cancelarSeleccion} 
                            style={{ 
                                padding: '15px 30px', 
                                backgroundColor: '#dc3545', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer', 
                                fontWeight: 'bold' 
                            }}
                        >
                            RECHAZAR
                        </button>
                        
                        <button 
                            onClick={() => setMostrarModalHuesped(true)} 
                            style={{ 
                                padding: '15px 30px', 
                                backgroundColor: 'green', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer', 
                                fontWeight: 'bold' 
                            }}
                        >
                            ACEPTAR
                        </button>
                    </div>
                </>
            )}
         </>
      )}
            {mostrarModalHuesped && (
                <HuespedModal
                    huespedData={huespedData}
                    onChange={handleChangeHuesped}
                    onClose={() => setMostrarModalHuesped(false)}
                    onSave={realizarReserva}
                />
            )}
          {habitaciones.length === 0 && fechasBusqueda && !cargando && (
            <p>No se encontraron habitaciones en el rango seleccionado.</p>
          )}
          {toast && (
            <ToastNotification
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
            )}
        </div>
    ); 
}

const HuespedModal: React.FC<HuespedModalProps> = ({ huespedData, onChange, onClose, onSave }) => {
    
    const isFormValid = huespedData.apellido && huespedData.nombre && huespedData.telefono;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{ 
                backgroundColor: 'white', padding: '30px', borderRadius: '8px', 
                width: '400px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
                <h2>Datos del Huésped Principal</h2>
                <p>Por favor, complete los datos para finalizar la reserva.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <input 
                        name="apellido" 
                        placeholder="Apellido" 
                        value={huespedData.apellido} 
                        onChange={onChange} 
                        required 
                        style={{ padding: '10px', border: '1px solid #ccc' }}
                    />
                    <input 
                        name="nombre" 
                        placeholder="Nombre" 
                        value={huespedData.nombre} 
                        onChange={onChange} 
                        required 
                        style={{ padding: '10px', border: '1px solid #ccc' }}
                    />
                    <input 
                        name="telefono" 
                        placeholder="Teléfono" 
                        value={huespedData.telefono} 
                        onChange={onChange} 
                        required 
                        style={{ padding: '10px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button 
                        onClick={onClose}
                        style={{ padding: '10px 15px', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onSave}
                        disabled={!isFormValid}
                        style={{ 
                            padding: '10px 15px', 
                            backgroundColor: isFormValid ? 'green' : '#aaa', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: isFormValid ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Confirmar Reserva
                    </button>
                </div>
            </div>
        </div>
    );
};
