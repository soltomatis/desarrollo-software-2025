import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import tp.desarrollo.clases.*;
import tp.desarrollo.dto.*;
import tp.desarrollo.enums.CondicionIVA;
import tp.desarrollo.enums.TipoDocumento;
import tp.desarrollo.repository.EstadiaDaoDB;
import tp.desarrollo.repository.HuespedDaoArchivos;
import tp.desarrollo.repository.HuespedDaoDB;
import tp.desarrollo.repository.ReservaDaoArchivos;
import tp.desarrollo.repository.ReservaDaoDB;
import tp.desarrollo.repository.UsuarioDaoArchivos;
import tp.desarrollo.services.Gestor_Habitacion;
import tp.desarrollo.services.Gestor_Usuario;

@ExtendWith(MockitoExtension.class)
public class Gestor_UsuarioTest {

    @Mock private HuespedDaoDB huespedDaoDB;
    @Mock private ReservaDaoDB reservaDaoDB;
    @Mock private Gestor_Habitacion gestorHabitacion;
    @Mock private EstadiaDaoDB estadiaDaoDB;

    @Mock private HuespedDaoArchivos huespedDaoArchivos; 
    @Mock private UsuarioDaoArchivos usuarioDaoArchivos;
    @Mock private ReservaDaoArchivos reservaDaoArchivos;

    @InjectMocks
    private Gestor_Usuario gestorUsuario;

    private Huesped huespedEjemplo;
    private Direccion direccionEjemplo;

    @BeforeEach
    void configurar() {
        direccionEjemplo = new Direccion("Calle Falsa", 123, "A", 1, 2000, "Rosario", "Santa Fe", "Argentina");

        huespedEjemplo = new Huesped();
        huespedEjemplo.setId(5L);
        huespedEjemplo.setNombre("Juan");
        huespedEjemplo.setApellido("Perez");
        huespedEjemplo.setTipo_documento(TipoDocumento.DNI);
        huespedEjemplo.setNum_documento(12345678);
        huespedEjemplo.setTelefono("111222333");
        huespedEjemplo.setDireccion(direccionEjemplo);
        huespedEjemplo.setNacionalidad("Argentina");
        huespedEjemplo.setFecha_nacimiento(LocalDate.of(1990, 1, 1));
        huespedEjemplo.setEmail("juan.perez@test.com");
        huespedEjemplo.setOcupacion("Desarrollador");
        huespedEjemplo.setCondicionIVA(CondicionIVA.CONSUMIDOR_FINAL);
        huespedEjemplo.setCUIT(0);

        gestorUsuario = new Gestor_Usuario(huespedDaoArchivos, usuarioDaoArchivos, reservaDaoArchivos);
        
        ReflectionTestUtils.setField(gestorUsuario, "huespedDaoDB", huespedDaoDB);
        ReflectionTestUtils.setField(gestorUsuario, "reservaDaoDB", reservaDaoDB);
        ReflectionTestUtils.setField(gestorUsuario, "gestorHabitacion", gestorHabitacion);
        ReflectionTestUtils.setField(gestorUsuario, "estadiaDaoDB", estadiaDaoDB);
    }
    //Test para buscarHuespedPorId
    //test busca un huésped existente y mapearlo a DTO
    @Test
    void buscarHuespedPorId_deberiaRetornarDTO_siHuespedExiste() {
        when(huespedDaoDB.buscarPorId(5L)).thenReturn(huespedEjemplo);

        HuespedDTO resultado = gestorUsuario.buscarHuespedPorId(5L);

        assertNotNull(resultado);
        assertEquals("Juan", resultado.getNombre());
        assertEquals(5L, resultado.getId().longValue());
        assertNotNull(resultado.getDireccion(), "La dirección debe estar mapeada.");

        verify(huespedDaoDB, times(1)).buscarPorId(5L);
    }
    //test busca un huésped inexistente y retorna null
    @Test
    void buscarHuespedPorId_deberiaRetornarNull_siHuespedNoExiste() {
        when(huespedDaoDB.buscarPorId(999L)).thenReturn(null);

        HuespedDTO resultado = gestorUsuario.buscarHuespedPorId(999L);

        assertNull(resultado);
        verify(huespedDaoDB, times(1)).buscarPorId(999L);
    }
    //Test para buscarHuespedes
    //test busca huéspedes con criterios específicos y retorna lista de DTOs
    @Test
    void buscarHuespedes_deberiaRetornarListaDTO_siDAOEncuentraHuespedes() {
        HuespedDTO criterioEjemplo = new HuespedDTO("Juan", "Perez", TipoDocumento.DNI, "12345678"); 
        
        when(huespedDaoDB.buscar_huespedes(any(HuespedDTO.class))).thenReturn(Arrays.asList(huespedEjemplo));

        List<HuespedDTO> resultados = gestorUsuario.buscarHuespedes("Juan", "Perez", "DNI", "12345678");

        assertNotNull(resultados);
        assertEquals(1, resultados.size());
        assertEquals("Juan", resultados.get(0).getNombre());

        verify(huespedDaoDB, times(1)).buscar_huespedes(any(HuespedDTO.class));
    }
    //test busca huespedes con criterios nulos o vacíos y retorna lista de DTOs
    @Test
    void buscarHuespedes_deberiaFuncionarConCriteriosNulosOVacios() {
        when(huespedDaoDB.buscar_huespedes(any(HuespedDTO.class))).thenReturn(Arrays.asList(huespedEjemplo));

        List<HuespedDTO> resultados = gestorUsuario.buscarHuespedes("", null, "", null);

        assertNotNull(resultados);
        assertFalse(resultados.isEmpty());

        verify(huespedDaoDB, times(1)).buscar_huespedes(any(HuespedDTO.class));
    }
    //test busca huéspedes con tipo de documento invalido pero el DAO retorna lista vacía
    @Test
    void buscarHuespedes_deberiaRetornarListaVacia_siTipoDocumentoEsInvalido() {
        List<HuespedDTO> resultados = gestorUsuario.buscarHuespedes("Juan", "Perez", "PASAPORTEx", "12345678");

        assertNotNull(resultados);
        assertTrue(resultados.isEmpty(), "Debe retornar lista vacía debido al tipo de documento inválido.");

        verify(huespedDaoDB, never()).buscar_huespedes(any(HuespedDTO.class));
    }
    //test busca huéspedes pero el DAO no encuentra ninguno y retorna lista vacía
    @Test
    void buscarHuespedes_deberiaRetornarListaVacia_siDAONoEncuentra() {
        when(huespedDaoDB.buscar_huespedes(any(HuespedDTO.class))).thenReturn(Collections.emptyList());

        List<HuespedDTO> resultados = gestorUsuario.buscarHuespedes("No Existe", "Nadie", null, null);

        assertNotNull(resultados);
        assertTrue(resultados.isEmpty());
    }
    //Test para verificarHistorial
    //test verifica historial y el huésped tiene historial de estadías
    @Test
    void verificarHistorial_deberiaIndicarQueTieneHistorial_siEstadiaDAOEsTrue() {
        when(estadiaDaoDB.elHuespedSeHaAlojado(5L)).thenReturn(true);
        Map<String, Object> resultado = gestorUsuario.verificarHistorial(5L);

        assertTrue((Boolean) resultado.get("tieneHistorial"));
        assertEquals("El huésped no puede ser eliminado pues se ha alojado en el Hotel en alguna oportunidad.", resultado.get("mensaje"));
        verify(estadiaDaoDB, times(1)).elHuespedSeHaAlojado(5L);
        verify(huespedDaoDB, never()).buscarPorId(anyLong()); 
    }
    //test verifica historial y el huésped no tiene historial de estadías
    @Test
    void verificarHistorial_deberiaIndicarQueNoTieneHistorialYMapearDatos_siEstadiaDAOEsFalse() {
        when(estadiaDaoDB.elHuespedSeHaAlojado(5L)).thenReturn(false);
        when(huespedDaoDB.buscarPorId(5L)).thenReturn(huespedEjemplo);
        
        Map<String, Object> resultado = gestorUsuario.verificarHistorial(5L);

        assertFalse((Boolean) resultado.get("tieneHistorial"));
        String mensajeEsperado = String.format("Los datos del huésped %s %s, %s y %s serán eliminados del sistema", 
                                                huespedEjemplo.getNombre(), 
                                                huespedEjemplo.getApellido(), 
                                                huespedEjemplo.getTipoDocumento(), 
                                                huespedEjemplo.getNumDocumento());
        assertEquals(mensajeEsperado, resultado.get("mensaje"));
        verify(estadiaDaoDB, times(1)).elHuespedSeHaAlojado(5L);
        verify(huespedDaoDB, times(1)).buscarPorId(5L);
    }
    //test verifica historial y el huésped no existe en el sistema
    @Test
    void verificarHistorial_deberiaIndicarNoEncontrado_siEstadiaDAOEsFalseYHuespedNoExiste() {
        when(estadiaDaoDB.elHuespedSeHaAlojado(999L)).thenReturn(false);
        when(huespedDaoDB.buscarPorId(999L)).thenReturn(null);
        
        Map<String, Object> resultado = gestorUsuario.verificarHistorial(999L);

        assertFalse((Boolean) resultado.get("tieneHistorial"));
        assertEquals("Huésped no encontrado.", resultado.get("mensaje"));
        verify(estadiaDaoDB, times(1)).elHuespedSeHaAlojado(999L);
        verify(huespedDaoDB, times(1)).buscarPorId(999L);
    }
    //Test para borrarHuesped
    //test de borrar huesped sin reservas pendientes
    @Test
    void borrarHuesped_deberiaEliminarHuesped_siNoTieneReservasPendientes() {
        Long id = 5L;
        when(huespedDaoDB.buscarPorId(id)).thenReturn(huespedEjemplo);
        when(reservaDaoDB.buscarPorHuespedPrincipalId(id)).thenReturn(Collections.emptyList());
        doNothing().when(huespedDaoDB).eliminar(any(Huesped.class));

        assertDoesNotThrow(() -> gestorUsuario.borrarHuesped(id));

        verify(huespedDaoDB, times(1)).buscarPorId(id);
        verify(reservaDaoDB, times(1)).buscarPorHuespedPrincipalId(id);
        verify(huespedDaoDB, times(1)).eliminar(huespedEjemplo);
        verify(gestorHabitacion, never()).eliminarEstadoHabitacion(anyLong(), any(), any());
    }
    //test de borrar huesped con reservas pendientes
    @Test
    void borrarHuesped_deberiaEliminarHuespedYLiberarHabitaciones_siTieneReservas() {
        Long id = 5L;
        Habitacion habitacion = new Habitacion();
        habitacion.setNumeroHabitacion(101L);
        ReservaHabitacion rh = new ReservaHabitacion();
        rh.setHabitacion(habitacion);
        rh.setFecha_inicio(LocalDate.of(2026, 1, 1));
        rh.setFecha_fin(LocalDate.of(2026, 1, 5));
        
        Reserva reserva = new Reserva();
        reserva.setListaHabitacionesRerservadas(Arrays.asList(rh));
        
        when(huespedDaoDB.buscarPorId(id)).thenReturn(huespedEjemplo);
        when(reservaDaoDB.buscarPorHuespedPrincipalId(id)).thenReturn(Arrays.asList(reserva));
        doNothing().when(huespedDaoDB).eliminar(any(Huesped.class));
        doNothing().when(gestorHabitacion).eliminarEstadoHabitacion(anyLong(), any(), any());

        assertDoesNotThrow(() -> gestorUsuario.borrarHuesped(id));

        verify(gestorHabitacion, times(1)).eliminarEstadoHabitacion(
            eq(101L), 
            eq(LocalDate.of(2026, 1, 1)), 
            eq(LocalDate.of(2026, 1, 5))
        );
        verify(huespedDaoDB, times(1)).eliminar(huespedEjemplo);
    }
    //test de borrar huesped inexistente
    @Test
    void borrarHuesped_deberiaNoHacerNada_siHuespedNoExiste() {
        Long idInexistente = 999L;
        when(huespedDaoDB.buscarPorId(idInexistente)).thenReturn(null);

        assertDoesNotThrow(() -> gestorUsuario.borrarHuesped(idInexistente));

        verify(huespedDaoDB, times(1)).buscarPorId(idInexistente);
        verify(reservaDaoDB, never()).buscarPorHuespedPrincipalId(anyLong());
        verify(huespedDaoDB, never()).eliminar(any(Huesped.class));
    }
    //test de borrar huesped pero falla al liberar habitación
    @Test
    void borrarHuesped_deberiaLanzarRuntimeException_siFallaAlLiberarHabitacion() {
        Long id = 5L;
        Habitacion habitacion = new Habitacion();
        habitacion.setNumeroHabitacion(101L);
        ReservaHabitacion rh = new ReservaHabitacion();
        rh.setHabitacion(habitacion);
        
        Reserva reserva = new Reserva();
        reserva.setListaHabitacionesRerservadas(Arrays.asList(rh));
        
        when(huespedDaoDB.buscarPorId(id)).thenReturn(huespedEjemplo);
        when(reservaDaoDB.buscarPorHuespedPrincipalId(id)).thenReturn(Arrays.asList(reserva));

        doThrow(new RuntimeException("Falla en la liberación")).when(gestorHabitacion).eliminarEstadoHabitacion(anyLong(), any(), any());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            gestorUsuario.borrarHuesped(id);
        });

        assertTrue(exception.getMessage().contains("Fallo al procesar eliminación de huésped."));

        verify(huespedDaoDB, never()).eliminar(any(Huesped.class));
    }
    //Test para mapearDireccionADTO
    //test mapearDireccionADTO con dirección nula
    @Test
    void mapearDireccionADTO_deberiaRetornarNull_siDireccionNull() throws Exception {
        Huesped huespedConSinDireccion = new Huesped();
        huespedConSinDireccion.setId(10L);
        huespedConSinDireccion.setNombre("Ana");
        huespedConSinDireccion.setApellido("Lopez");
        huespedConSinDireccion.setDireccion(null);

        when(huespedDaoDB.buscarPorId(10L)).thenReturn(huespedConSinDireccion);

        HuespedDTO dto = gestorUsuario.buscarHuespedPorId(10L);

        assertNotNull(dto);
        assertNull(dto.getDireccion(), "Si la direccion es null, debe mapearse a null.");
    }
}
