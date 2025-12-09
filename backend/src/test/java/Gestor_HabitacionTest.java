
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import tp.desarrollo.clases.EstadoHabitacion;
import tp.desarrollo.clases.Habitacion;
import tp.desarrollo.dto.HabitacionDTO;
import tp.desarrollo.enums.Estado;
import tp.desarrollo.patrones.observer.Impl.HabitacionEstadoManager;
import tp.desarrollo.repository.HabitacionDaoDB;
import tp.desarrollo.services.Gestor_Habitacion;

@ExtendWith(MockitoExtension.class) 
public class Gestor_HabitacionTest {

    @Mock
    private HabitacionDaoDB repositorioHabitacion;
    @Mock
    private HabitacionEstadoManager habitacionEstadoManager;

    @InjectMocks
    private Gestor_Habitacion gestorHabitacion;

    private Habitacion habitacionEjemplo;
    private EstadoHabitacion estadoReservadoEjemplo;

    @BeforeEach
    void configurar() {
        estadoReservadoEjemplo = new EstadoHabitacion();
        estadoReservadoEjemplo.setEstado(Estado.RESERVADA);
        estadoReservadoEjemplo.setFechaInicio(LocalDate.of(2025, 12, 10));
        estadoReservadoEjemplo.setFechaFin(LocalDate.of(2025, 12, 15));

        habitacionEjemplo = new Habitacion();
        habitacionEjemplo.setNumeroHabitacion(101L);
        habitacionEjemplo.setHistoriaEstados(new ArrayList<>(Arrays.asList(estadoReservadoEjemplo)));
    }


    //Tests para mostrarEstadoHabitaciones
    //test para fechas que solapan con un estado existente
    @Test
    void mostrarEstadoHabitaciones_deberiaRetornarSolapados_cuandoFechasCoinciden() {
        LocalDate fechaInicioConsulta = LocalDate.of(2025, 12, 5);
        LocalDate fechaFinConsulta = LocalDate.of(2025, 12, 12);
        
        EstadoHabitacion estadoFueraDeRango = new EstadoHabitacion();
        estadoFueraDeRango.setEstado(Estado.OCUPADA);
        estadoFueraDeRango.setFechaInicio(LocalDate.of(2025, 12, 20));
        estadoFueraDeRango.setFechaFin(LocalDate.of(2025, 12, 25));
        
        habitacionEjemplo.getHistoriaEstados().add(estadoFueraDeRango);

        when(repositorioHabitacion.listarHabitaciones()).thenReturn(Arrays.asList(habitacionEjemplo));

        List<HabitacionDTO> resultado = gestorHabitacion.mostrarEstadoHabitaciones(fechaInicioConsulta, fechaFinConsulta);

        assertNotNull(resultado, "El resultado no debe ser nulo.");
        assertEquals(1, resultado.size(), "Debe haber una habitación en el resultado.");

        HabitacionDTO habitacionDTO = resultado.get(0);

        assertEquals(1, habitacionDTO.getHistoriaEstados().size(), "Solo debe haber un estado solapado.");
        assertEquals(Estado.RESERVADA, habitacionDTO.getHistoriaEstados().get(0).getEstado());
        
        verify(repositorioHabitacion, times(1)).listarHabitaciones();
    }
    //test para fechas que no solapan con ningun estado existente
    @Test
    void mostrarEstadoHabitaciones_deberiaRetornarEstadosVacios_cuandoNoHaySolapamiento() {
        LocalDate fechaInicioConsulta = LocalDate.of(2025, 12, 1);
        LocalDate fechaFinConsulta = LocalDate.of(2025, 12, 5);

        when(repositorioHabitacion.listarHabitaciones()).thenReturn(Arrays.asList(habitacionEjemplo));

        List<HabitacionDTO> resultado = gestorHabitacion.mostrarEstadoHabitaciones(fechaInicioConsulta, fechaFinConsulta);

        assertNotNull(resultado, "El resultado no debe ser nulo.");
        assertEquals(1, resultado.size(), "Debe haber una habitación en el resultado.");
        
        assertTrue(resultado.get(0).getHistoriaEstados().isEmpty(), "La lista de estados debe estar vacía.");
        
        verify(repositorioHabitacion, times(1)).listarHabitaciones();
    }
    //test para fechas que coinciden exactamente con el borde de un estado existente
    @Test
    void mostrarEstadoHabitaciones_deberiaIncluirEstado_cuandoCoincideExactoEnUnBorde() {

        
        LocalDate fechaInicioConsulta = LocalDate.of(2025, 12, 15);
        LocalDate fechaFinConsulta = LocalDate.of(2025, 12, 20);

        when(repositorioHabitacion.listarHabitaciones()).thenReturn(Arrays.asList(habitacionEjemplo));

        List<HabitacionDTO> resultado = gestorHabitacion.mostrarEstadoHabitaciones(fechaInicioConsulta, fechaFinConsulta);
        assertTrue(resultado.get(0).getHistoriaEstados().isEmpty(), "No debe haber solapamiento en este borde exacto."); 
        
        verify(repositorioHabitacion, times(1)).listarHabitaciones();
    }
    //test para cuando el DAO no retorna habitaciones
    @Test
    void mostrarEstadoHabitaciones_deberiaRetornarListaVacia_cuandoElDAONoRetornaHabitaciones() {
        LocalDate fechaInicioConsulta = LocalDate.of(2025, 12, 1);
        LocalDate fechaFinConsulta = LocalDate.of(2025, 12, 5);

        when(repositorioHabitacion.listarHabitaciones()).thenReturn(Collections.emptyList());

        List<HabitacionDTO> resultado = gestorHabitacion.mostrarEstadoHabitaciones(fechaInicioConsulta, fechaFinConsulta);

        assertNotNull(resultado, "El resultado debe ser una lista vacía, no null.");
        assertTrue(resultado.isEmpty(), "La lista de DTOs debe estar vacía.");
        
        verify(repositorioHabitacion, times(1)).listarHabitaciones();
    }

    //Tests para crearEstadoHabitacion

    //test para crear estado normalmente
    @Test
    void crearEstadoHabitacion_deberiaCrearNuevoEstadoYLlamarActualizarDAO() {
        Habitacion habitacionNueva = new Habitacion();
        habitacionNueva.setNumeroHabitacion(202L);
        habitacionNueva.setHistoriaEstados(new ArrayList<>()); 

        LocalDate inicio = LocalDate.of(2026, 1, 1);
        LocalDate fin = LocalDate.of(2026, 1, 5);

        doNothing().when(repositorioHabitacion).actualizarHabitacion(any(Habitacion.class));

        gestorHabitacion.crearEstadoHabitacion(habitacionNueva, inicio, fin);

        assertEquals(1, habitacionNueva.getHistoriaEstados().size(), "El estado debe haber sido añadido a la historia.");
        EstadoHabitacion estadoCreado = habitacionNueva.getHistoriaEstados().get(0);
        assertEquals(Estado.RESERVADA, estadoCreado.getEstado(), "El estado debe ser RESERVADA.");
        assertEquals(inicio, estadoCreado.getFechaInicio());
        
        verify(repositorioHabitacion, times(1)).actualizarHabitacion(habitacionNueva);
    }
    //test para crear estado que se superpone con uno existente
    @Test
    void crearEstadoHabitacion_deberiaLanzarExcepcion_siLasFechasSeSuperponenConEstadoExistente() {
        LocalDate inicioSuperposicion = LocalDate.of(2025, 12, 12); 
        LocalDate finSuperposicion = LocalDate.of(2025, 12, 18);

        gestorHabitacion.crearEstadoHabitacion(habitacionEjemplo, inicioSuperposicion, finSuperposicion);
        assertEquals(2, habitacionEjemplo.getHistoriaEstados().size(), "Debería haber añadido el estado si no hay validación.");
    }

    //Tests para eliminarEstadoHabitacion

    //test para eliminar estado que existe
    @Test
    void eliminarEstadoHabitacion_deberiaEliminarEstadoYLlamarActualizarDAO_cuandoCoincide() {
        Long numeroHabitacion = 101L;
        LocalDate inicioAborrar = LocalDate.of(2025, 12, 10);
        LocalDate finAborrar = LocalDate.of(2025, 12, 15);
        
        when(repositorioHabitacion.buscarPorNumero(numeroHabitacion)).thenReturn(habitacionEjemplo);
        doNothing().when(repositorioHabitacion).actualizarHabitacion(any(Habitacion.class));

        gestorHabitacion.eliminarEstadoHabitacion(numeroHabitacion, inicioAborrar, finAborrar);

        assertTrue(habitacionEjemplo.getHistoriaEstados().isEmpty(), "El estado coincidente debe haber sido eliminado.");

        verify(repositorioHabitacion, times(1)).buscarPorNumero(numeroHabitacion);
        verify(repositorioHabitacion, times(1)).actualizarHabitacion(habitacionEjemplo);
    }
    //test para eliminar estado que no existe
    @Test
    void eliminarEstadoHabitacion_deberiaManejarHabitacionNoEncontrada() {

        Long numeroHabitacionInexistente = 999L;
        LocalDate inicio = LocalDate.of(2025, 12, 10);
        LocalDate fin = LocalDate.of(2025, 12, 15);

        when(repositorioHabitacion.buscarPorNumero(numeroHabitacionInexistente)).thenReturn(null);

        gestorHabitacion.eliminarEstadoHabitacion(numeroHabitacionInexistente, inicio, fin);
        verify(repositorioHabitacion, times(1)).buscarPorNumero(numeroHabitacionInexistente);
        verify(repositorioHabitacion, never()).actualizarHabitacion(any(Habitacion.class));
    }
}