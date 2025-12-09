import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import jakarta.persistence.EntityNotFoundException;
import tp.desarrollo.model.Estadia;
import tp.desarrollo.model.Habitacion;
import tp.desarrollo.repository.EstadiaDaoDB;
import tp.desarrollo.repository.HabitacionDaoDB;
import tp.desarrollo.services.Gestor_Estadia;

@ExtendWith(MockitoExtension.class)
public class Gestor_EstadiaTest {

    @Mock
    private EstadiaDaoDB estadiaDaoDB;

    @Mock
    private HabitacionDaoDB habitacionDaoDB;

    @InjectMocks
    private Gestor_Estadia gestorEstadia;

    private final Long ESTADIA_ID = 50L;
    private final Long NUMERO_HABITACION = 101L;
    private final String HORA_MINUTO_SALIDA = "15:30";
    private Habitacion habitacionEjemplo;
    private Estadia estadiaActivaEjemplo;

    @BeforeEach
    void setUp() {
        habitacionEjemplo = new Habitacion();
        habitacionEjemplo.setNumeroHabitacion(NUMERO_HABITACION);

        estadiaActivaEjemplo = new Estadia();
        estadiaActivaEjemplo.setId(50L);
        estadiaActivaEjemplo.setHabitacion(habitacionEjemplo);
        estadiaActivaEjemplo.setFecha_check_in(LocalDate.now());
    }

    //Test buscarEstadia
    //test retornar estadia
    @Test
    void buscarEstadia_deberiaRetornarEstadia_siEsActiva() {
        when(habitacionDaoDB.buscarPorNumero(NUMERO_HABITACION)).thenReturn(habitacionEjemplo);
        when(estadiaDaoDB.buscarEstadiaActivaPorHabitacionId(NUMERO_HABITACION)).thenReturn(estadiaActivaEjemplo);

        Estadia resultado = gestorEstadia.buscarEstadia(NUMERO_HABITACION.toString());

        assertNotNull(resultado);
        assertEquals(estadiaActivaEjemplo.getId(), resultado.getId());
        verify(estadiaDaoDB, never()).actualizar(any(Estadia.class));
    }

    //test lanza excepcion si habitacion no existe
    @Test
    void buscarEstadia_deberiaLanzarExcepcion_siHabitacionNoExiste() {
        when(habitacionDaoDB.buscarPorNumero(anyLong())).thenReturn(null);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            gestorEstadia.buscarEstadia("999");
        });

        assertTrue(exception.getMessage().contains("No se encontró la habitación con el número: 999"));

        verify(estadiaDaoDB, never()).buscarEstadiaActivaPorHabitacionId(anyLong());
    }
    //test lanza excepcion si no hay estadia activa
    @Test
    void buscarEstadia_deberiaLanzarExcepcion_siNoHayEstadiaActiva() {
        when(habitacionDaoDB.buscarPorNumero(NUMERO_HABITACION)).thenReturn(habitacionEjemplo);
        when(estadiaDaoDB.buscarEstadiaActivaPorHabitacionId(NUMERO_HABITACION)).thenReturn(null);

        EntityNotFoundException exception = assertThrows(EntityNotFoundException.class, () -> {
            gestorEstadia.buscarEstadia(NUMERO_HABITACION.toString());
        });

        assertTrue(exception.getMessage().contains("No se encontró ninguna estadía activa en la habitación 101"));

        verify(estadiaDaoDB, never()).actualizar(any(Estadia.class));
    }

    //test lanza excepcion si numero habitacion no es numero
    @Test
    void buscarEstadia_deberiaLanzarException_siNumeroHabitacionNoEsNumero() {
        assertThrows(NumberFormatException.class, () -> {
            gestorEstadia.buscarEstadia("A101"); 
        });
        verify(habitacionDaoDB, never()).buscarPorNumero(anyLong());
        verify(estadiaDaoDB, never()).actualizar(any(Estadia.class));
    }

    //Test actualizarCheckOut
    //test actualiza la fecha correctamente
    @Test
    void actualizarCheckOut_deberiaActualizarFechaYHoraDeSalida() {

        when(estadiaDaoDB.findById(ESTADIA_ID)).thenReturn(estadiaActivaEjemplo);
        doNothing().when(estadiaDaoDB).actualizar(any(Estadia.class));

        Estadia resultado = gestorEstadia.actualizarCheckOut(ESTADIA_ID, HORA_MINUTO_SALIDA);

        assertNotNull(resultado);
        assertNotNull(resultado.getFecha_check_out());

        verify(estadiaDaoDB, times(1)).actualizar(estadiaActivaEjemplo);

        LocalDate fechaEsperada = LocalDate.now();
        LocalTime horaEsperada = LocalTime.parse(HORA_MINUTO_SALIDA);
        LocalDateTime checkOutEsperado = LocalDateTime.of(fechaEsperada, horaEsperada);
        
        assertEquals(checkOutEsperado, resultado.getFecha_check_out(), "El check-out debe coincidir con la hora de salida procesada.");
    }
    
    //test lanza excepcion si estadia no existe
    @Test
    void actualizarCheckOut_deberiaLanzarExcepcion_siEstadiaNoExiste() {
        when(estadiaDaoDB.findById(anyLong())).thenReturn(null);
        assertThrows(EntityNotFoundException.class, () -> {
            gestorEstadia.actualizarCheckOut(999L, HORA_MINUTO_SALIDA);
        });

        verify(estadiaDaoDB, never()).actualizar(any(Estadia.class));
    }
    //test lanza excepcion si hora es invalida
    @Test
    void actualizarCheckOut_deberiaLanzarExcepcion_siHoraEsInvalida() {
        when(estadiaDaoDB.findById(ESTADIA_ID)).thenReturn(estadiaActivaEjemplo);

        assertThrows(IllegalArgumentException.class, () -> {
            gestorEstadia.actualizarCheckOut(ESTADIA_ID, "99:99"); 
        });

        verify(estadiaDaoDB, times(1)).findById(ESTADIA_ID);
        verify(estadiaDaoDB, never()).actualizar(any(Estadia.class));
    }
}
