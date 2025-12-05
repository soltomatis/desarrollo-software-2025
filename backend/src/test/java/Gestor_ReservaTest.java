import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
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

import tp.desarrollo.clases.*;
import tp.desarrollo.dao.*;
import tp.desarrollo.dto.*;
import tp.desarrollo.enums.CondicionIVA;
import tp.desarrollo.enums.Estado;
import tp.desarrollo.enums.TipoDocumento;
import tp.desarrollo.gestores.Gestor_Habitacion;
import tp.desarrollo.gestores.Gestor_Reserva;

@ExtendWith(MockitoExtension.class)
public class Gestor_ReservaTest {

    @Mock private ReservaDaoDB reservaDaoDB;
    @Mock private HuespedDaoDB huespedDaoDB;
    @Mock private HabitacionDaoDB habitacionDaoDB;
    @Mock private Gestor_Habitacion gestorHabitacion;
    @Mock private ReservaHabitacionDaoDB reservaHabitacionDaoDB;
    
    @InjectMocks private Gestor_Reserva gestorReserva;

    private ReservaDTO reservaDTO;
    private Huesped huespedExistente;
    private Habitacion habitacion101;
    private Reserva reservaPersistida;
    private ReservaHabitacion reservaHabitacionExistente;

    @BeforeEach
    void configurar() {
        Direccion direccionEjemplo = new Direccion();
        direccionEjemplo.setCalle("Calle Falsa");
        direccionEjemplo.setNumero(123);
        direccionEjemplo.setDepartamento("A");
        direccionEjemplo.setPiso(1);
        direccionEjemplo.setCodigoPostal(2000);
        direccionEjemplo.setLocalidad("Rosario");
        direccionEjemplo.setProvincia("Santa Fe");
        direccionEjemplo.setPais("Argentina");

        huespedExistente = new Huesped();
        huespedExistente.setId(5L);
        huespedExistente.setNombre("Juan");
        huespedExistente.setApellido("Perez");
        huespedExistente.setTelefono("111222333");
        huespedExistente.setDireccion(direccionEjemplo);
        huespedExistente.setNacionalidad("Argentina");
        huespedExistente.setFecha_nacimiento(LocalDate.of(1990, 1, 1));
        huespedExistente.setEmail("juan.perez@test.com");
        huespedExistente.setOcupacion("Desarrollador");
        huespedExistente.setCondicionIVA(CondicionIVA.CONSUMIDOR_FINAL); 
        huespedExistente.setTipo_documento(TipoDocumento.DNI);
        huespedExistente.setNum_documento(12345678);
        huespedExistente.setCUIT(0);

        habitacion101 = new Habitacion();
        habitacion101.setNumeroHabitacion(101L); 
        habitacion101.setHistoriaEstados(new ArrayList<>());

        reservaPersistida = new Reserva();
        reservaPersistida.setId(10);
        reservaPersistida.setHuespedPrincipal(huespedExistente);

        reservaHabitacionExistente = new ReservaHabitacion();
        reservaHabitacionExistente.setHabitacion(habitacion101);
        reservaHabitacionExistente.setFecha_inicio(LocalDate.of(2026, 1, 10));
        reservaHabitacionExistente.setFecha_fin(LocalDate.of(2026, 1, 15));

        reservaPersistida.setListaHabitacionesRerservadas(Arrays.asList(reservaHabitacionExistente));

        HuespedDTO huespedDTO = new HuespedDTO();
        huespedDTO.setNombre("Juan");
        huespedDTO.setApellido("Perez");
        huespedDTO.setTelefono("111222333"); 

        HabitacionDTO habitacionDTO = new HabitacionDTO();
        habitacionDTO.setNumeroHabitacion(101L);

        ReservaHabitacionDTO rhDTO = new ReservaHabitacionDTO();
        rhDTO.setHabitacion(habitacionDTO);
        rhDTO.setFecha_inicio(LocalDate.of(2026, 1, 10));
        rhDTO.setFecha_fin(LocalDate.of(2026, 1, 15));
 
        reservaDTO = new ReservaDTO();
        reservaDTO.setHuespedPrincipal(huespedDTO);
        reservaDTO.setListaHabitacionesReservadas(Arrays.asList(rhDTO));
    }
    //Tests para confirmarReserva
    //test para cuando el huesped ya existe y se reutiliza
    @Test
    void confirmarReserva_deberiaReutilizarHuespedYGuardarTodo_siHuespedExiste() throws Exception {
        when(huespedDaoDB.buscarHuespedPorDatos(anyString(), anyString(), anyString())).thenReturn(huespedExistente);
        when(reservaDaoDB.guardarReserva(any(Reserva.class))).thenReturn(reservaPersistida);

        when(habitacionDaoDB.buscarId(eq(101L))).thenReturn(habitacion101); 

        doNothing().when(gestorHabitacion).crearEstadoHabitacion(any(), any(), any());

        doNothing().when(reservaHabitacionDaoDB).save(any(ReservaHabitacion.class)); 

        Long idReservaConfirmada = gestorReserva.confirmarReserva(reservaDTO);

        verify(huespedDaoDB, times(1)).buscarHuespedPorDatos(anyString(), anyString(), anyString());
        verify(huespedDaoDB, never()).saveHuesped(any(Huesped.class));
        
        assertNotNull(idReservaConfirmada);
        assertEquals(reservaPersistida.getId(), idReservaConfirmada.longValue());

        verify(reservaDaoDB, times(1)).guardarReserva(any(Reserva.class));

        verify(habitacionDaoDB, times(1)).buscarId(eq(101L)); 
        
        verify(gestorHabitacion, times(1)).crearEstadoHabitacion(eq(habitacion101), any(), any());
        verify(reservaHabitacionDaoDB, times(1)).save(any(ReservaHabitacion.class));
    }
    //test para crear estado habitacion correctamente con un nuevo huesped
    @Test
    void confirmarReserva_deberiaCrearHuespedNuevoYGuardarTodo_siHuespedNoExiste() throws Exception {
        when(huespedDaoDB.buscarHuespedPorDatos(anyString(), anyString(), anyString())).thenReturn(null);
        
        Huesped huespedNuevo = new Huesped();
        huespedNuevo.setId(6L);
        when(huespedDaoDB.saveHuesped(any(Huesped.class))).thenReturn(huespedNuevo);

        when(reservaDaoDB.guardarReserva(any(Reserva.class))).thenReturn(reservaPersistida);
        
        when(habitacionDaoDB.buscarId(101L)).thenReturn(habitacion101);
        doNothing().when(gestorHabitacion).crearEstadoHabitacion(any(), any(), any());
        doNothing().when(reservaHabitacionDaoDB).save(any(ReservaHabitacion.class));

        gestorReserva.confirmarReserva(reservaDTO);


        verify(huespedDaoDB, times(1)).buscarHuespedPorDatos(anyString(), anyString(), anyString());
        verify(huespedDaoDB, times(1)).saveHuesped(any(Huesped.class));

        verify(reservaDaoDB, times(1)).guardarReserva(any(Reserva.class));
        verify(gestorHabitacion, times(1)).crearEstadoHabitacion(eq(habitacion101), any(), any());
    }
    //test para cuando falla crearEstadoHabitacion
    @Test
    void confirmarReserva_deberiaLanzarExcepcion_siFallaCrearEstadoHabitacion() throws Exception {
        when(huespedDaoDB.buscarHuespedPorDatos(anyString(), anyString(), anyString())).thenReturn(huespedExistente);
        when(reservaDaoDB.guardarReserva(any(Reserva.class))).thenReturn(reservaPersistida);
        when(habitacionDaoDB.buscarId(eq(101L))).thenReturn(habitacion101); 

        doThrow(new RuntimeException("Habitación no disponible")).when(gestorHabitacion)
                .crearEstadoHabitacion(any(), any(), any());

        Exception exception = assertThrows(RuntimeException.class, () -> {
            gestorReserva.confirmarReserva(reservaDTO);
        });

        assertEquals("Habitación no disponible", exception.getMessage());

        verify(huespedDaoDB, times(1)).buscarHuespedPorDatos(anyString(), anyString(), anyString());
        verify(reservaDaoDB, times(1)).guardarReserva(any(Reserva.class));
        verify(reservaHabitacionDaoDB, never()).save(any(ReservaHabitacion.class));
    }
    //Tests para cancelarReserva
    //test para cancelar reserva que no existe
    @Test
    void cancelarReserva_deberiaLanzarExcepcion_siReservaNoExiste() {
        int idReservaInexistente = 999;
        
        when(reservaDaoDB.buscarReservaPorId(idReservaInexistente)).thenReturn(null);

        Exception exception = assertThrows(Exception.class, () -> {
            gestorReserva.cancelarReserva(idReservaInexistente);
        });

        assertEquals("No se encontró la reserva con ID: 999", exception.getMessage());

        verify(reservaDaoDB, never()).eliminarReserva(any());
        verify(habitacionDaoDB, never()).actualizarHabitacion(any());
    }
    //test para cancelar reserva correctamente
    @Test
    void cancelarReserva_deberiaLiberarHabitacionesYEliminarReserva_siExiste() throws Exception {
        int idReserva = reservaPersistida.getId();

        when(reservaDaoDB.buscarReservaPorId(idReserva)).thenReturn(reservaPersistida);
        
        doNothing().when(habitacionDaoDB).actualizarHabitacion(any(Habitacion.class));
        doNothing().when(reservaDaoDB).eliminarReserva(any(Reserva.class));

        EstadoHabitacion estadoRes = new EstadoHabitacion();
        estadoRes.setEstado(Estado.RESERVADA);
        estadoRes.setFechaInicio(reservaHabitacionExistente.getFecha_inicio());
        estadoRes.setFechaFin(reservaHabitacionExistente.getFecha_fin());
        habitacion101.getHistoriaEstados().add(estadoRes); 

        gestorReserva.cancelarReserva(idReserva);

        verify(reservaDaoDB, times(1)).buscarReservaPorId(idReserva);
        verify(habitacionDaoDB, times(1)).actualizarHabitacion(habitacion101); 
        verify(reservaDaoDB, times(1)).eliminarReserva(reservaPersistida);
        assertTrue(habitacion101.getHistoriaEstados().isEmpty(), "El estado RESERVADA debe haber sido eliminado del historial.");
    }
    //test para cancelar varias reservas donde todas fallan
    @Test
    void cancelarReservas_deberiaLanzarExcepcion_siTodasFallan() {
        List<Integer> idsFallidos = Arrays.asList(998, 999);
        when(reservaDaoDB.buscarReservaPorId(998)).thenReturn(null);
        when(reservaDaoDB.buscarReservaPorId(999)).thenReturn(null);

        Exception exception = assertThrows(Exception.class, () -> {
            gestorReserva.cancelarReservas(idsFallidos);
        });

        assertEquals("No se pudo cancelar ninguna reserva", exception.getMessage());
        
        verify(reservaDaoDB, times(1)).buscarReservaPorId(998);
        verify(reservaDaoDB, times(1)).buscarReservaPorId(999);
        verify(reservaDaoDB, never()).eliminarReserva(any());
    }
    //test para cancelar varias reservas con fallos parciales
    @Test
    void cancelarReservas_deberiaDevolverListaConExitosos_siHayFallosParciales() throws Exception {
        List<Integer> idsAProcesar = Arrays.asList(10, 999);

        when(reservaDaoDB.buscarReservaPorId(10)).thenReturn(reservaPersistida);
        when(reservaDaoDB.buscarReservaPorId(999)).thenReturn(null);

        doNothing().when(habitacionDaoDB).actualizarHabitacion(any(Habitacion.class));
        doNothing().when(reservaDaoDB).eliminarReserva(any(Reserva.class));

        EstadoHabitacion estadoRes = new EstadoHabitacion();
        estadoRes.setEstado(Estado.RESERVADA);
        estadoRes.setFechaInicio(reservaHabitacionExistente.getFecha_inicio());
        estadoRes.setFechaFin(reservaHabitacionExistente.getFecha_fin());
        habitacion101.getHistoriaEstados().add(estadoRes);

        List<Integer> idsExitosos = gestorReserva.cancelarReservas(idsAProcesar);

        assertNotNull(idsExitosos);
        assertEquals(1, idsExitosos.size(), "Solo un ID (el 10) debería haber sido exitoso.");
        assertTrue(idsExitosos.contains(10), "La lista de retorno debe contener el ID 10.");

        verify(reservaDaoDB, times(1)).buscarReservaPorId(10);
        verify(reservaDaoDB, times(1)).buscarReservaPorId(999);
        verify(reservaDaoDB, times(1)).eliminarReserva(reservaPersistida); 
    }

    //Test para buscarReservas
    //test para buscar reservas correctamente
    @Test
    void buscarReservas_deberiaRetornarDTOs_cuandoDAOEncuentraReservas() {
        List<Reserva> listaReservas = Arrays.asList(reservaPersistida);
        
        when(reservaDaoDB.buscarReservasPorCriterios(
            anyString(), anyString(), any(), anyString(), anyString(), anyString()
        )).thenReturn(listaReservas);

        List<ReservaDTO> resultado = gestorReserva.buscarReservas(
            "Perez", "Juan", 101L, "Simple", "2026-01-01", "2026-01-31"
        );

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        
        ReservaDTO dto = resultado.get(0);

        assertEquals(reservaPersistida.getId(), dto.getId());
        assertEquals("Juan", dto.getHuespedPrincipal().getNombre());

        assertEquals(1, dto.getListaHabitacionesReservadas().size());
        assertEquals(101L, dto.getListaHabitacionesReservadas().get(0).getHabitacion().getNumeroHabitacion());

        verify(reservaDaoDB, times(1)).buscarReservasPorCriterios(any(), any(), any(), any(), any(), any());
    }
    //test para buscar reservas cuando el DAO no retorna nada
    @Test
    void buscarReservas_deberiaRetornarListaVacia_siDAOdevuelveVacio() {
        when(reservaDaoDB.buscarReservasPorCriterios(
            anyString(), anyString(), any(), anyString(), anyString(), anyString()
        )).thenReturn(Collections.emptyList());

        List<ReservaDTO> resultado = gestorReserva.buscarReservas(
            "Perez", "Juan", 101L, "Simple", "2026-01-01", "2026-01-31"
        );

        assertNotNull(resultado, "El resultado no debe ser nulo, debe ser una lista vacía.");
        assertTrue(resultado.isEmpty(), "La lista de DTOs debe estar vacía.");
        
        verify(reservaDaoDB, times(1)).buscarReservasPorCriterios(any(), any(), any(), any(), any(), any());
    }
    //test para buscar reservas con todos los criterios nulos o vacíos
    @Test
    void buscarReservas_deberiaFuncionarConCriteriosNulos() {
        List<Reserva> listaReservas = Arrays.asList(reservaPersistida);

        when(reservaDaoDB.buscarReservasPorCriterios(
            eq(""), eq(null), eq(null), eq(""), eq(""), eq(null) 
        )).thenReturn(listaReservas);

        List<ReservaDTO> resultado = gestorReserva.buscarReservas(
            "", null, null, "", "", null
        );

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(reservaDaoDB, times(1)).buscarReservasPorCriterios(eq(""), eq(null), eq(null), eq(""), eq(""), eq(null));
    }
}
