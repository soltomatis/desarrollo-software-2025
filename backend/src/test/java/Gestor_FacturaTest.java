import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tp.desarrollo.model.*;
import tp.desarrollo.dto.FacturaResumenDTO;
import tp.desarrollo.enums.CondicionIVA;
import tp.desarrollo.repository.ConsumoDaoDB;
import tp.desarrollo.repository.DireccionDaoDB;
import tp.desarrollo.repository.EstadiaDaoDB;
import tp.desarrollo.repository.FacturaDaoDB;
import tp.desarrollo.repository.HuespedDaoDB;
import tp.desarrollo.repository.ResponsableDaoDB;
import tp.desarrollo.services.Gestor_Factura;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class Gestor_FacturaTest {

    @Mock
    private ConsumoDaoDB consumoDaoDB;
    @Mock
    private HuespedDaoDB huespedDaoDB;
    @Mock
    private EstadiaDaoDB estadiaDaoDB;
    @Mock
    private FacturaDaoDB facturaDaoDB;
    @Mock
    private ResponsableDaoDB responsableDaoDB;
    @Mock
    private DireccionDaoDB direccionDaoDB;

    @InjectMocks
    private Gestor_Factura gestorFactura;

    private final Long ESTADIA_ID = 1L;
    private final Long HUESPED_ID = 10L;
    private final Long RESPONSABLE_ID = 20L;
    private final Long CONSUMO_ID_1 = 100L;
    private final Long CONSUMO_ID_2 = 101L;

    private Estadia estadiaEjemplo;
    private Huesped huespedEjemplo;
    private Responsable_de_pago responsableEjemploRI; 
    private Responsable_de_pago responsableEjemploCF; 
    private Consumo consumo1;
    private Consumo consumo2;

    @BeforeEach
    void setUp() {
        Habitacion habitacion = new Habitacion();
        habitacion.setNumeroHabitacion(101L);

        estadiaEjemplo = new Estadia();
        estadiaEjemplo.setId(ESTADIA_ID);
        estadiaEjemplo.setHabitacion(habitacion);
        estadiaEjemplo.setValor_estadia((float) 100.0);
        estadiaEjemplo.setLista_consumos(new ArrayList<>());

        consumo1 = new Consumo(CONSUMO_ID_1, "RESTAURANTE", "PENDIENTE", 50.0, estadiaEjemplo);
        consumo2 = new Consumo(CONSUMO_ID_2, "BAR", "PENDIENTE", 100.0, estadiaEjemplo);
        estadiaEjemplo.getLista_consumos().addAll(Arrays.asList(consumo1, consumo2));
        
        Direccion dirHuesped = new Direccion();
        dirHuesped.setCalle("Calle Huesped"); 
        dirHuesped.setNumero(123);
        dirHuesped.setDepartamento("A"); 
        dirHuesped.setPiso(5); 
        dirHuesped.setCodigoPostal(1000); 
        dirHuesped.setLocalidad("CABA"); 
        dirHuesped.setProvincia("BsAs"); 
        dirHuesped.setPais("Arg"); 

        huespedEjemplo = new Huesped();
        huespedEjemplo.setId(HUESPED_ID);
        huespedEjemplo.setNombre("Juan");
        huespedEjemplo.setApellido("Perez");
        huespedEjemplo.setCondicionIVA(CondicionIVA.CONSUMIDOR_FINAL);
        huespedEjemplo.setDireccion(dirHuesped);

        responsableEjemploRI = new Responsable_de_pago();
        responsableEjemploRI.setId(RESPONSABLE_ID);
        responsableEjemploRI.setRazonSocial("Empresa RI S.A.");
        responsableEjemploRI.setCondicionIVA(CondicionIVA.RESPONSABLE_INSCRIPTO);

        responsableEjemploCF = new Responsable_de_pago();
        responsableEjemploCF.setId(RESPONSABLE_ID + 1);
        responsableEjemploCF.setRazonSocial("Consumidor Prueba");
        responsableEjemploCF.setCondicionIVA(CondicionIVA.CONSUMIDOR_FINAL);
    }

    // Tests para generarResumen 
    // test genera consumo alojamiento y resumen con huesped
    @Test
    void generarResumen_deberiaGenerarConsumoAlojamientoYResumen_conHuesped() {
        when(estadiaDaoDB.findById(ESTADIA_ID)).thenReturn(estadiaEjemplo);

        when(consumoDaoDB.findByEstadiaIdAndTipo(ESTADIA_ID, "ALOJAMIENTO")).thenReturn(null);
        when(consumoDaoDB.save(any(Consumo.class))).thenAnswer(i -> {
            Consumo c = i.getArgument(0);
            c.setId(200L); 
            return c;
        });

        when(huespedDaoDB.buscarPorId(HUESPED_ID)).thenReturn(huespedEjemplo);
        when(responsableDaoDB.findByFullIdentity("Juan Perez")).thenReturn(responsableEjemploCF);

        FacturaResumenDTO resumen = gestorFactura.generarResumen(ESTADIA_ID, HUESPED_ID, null);

        assertNotNull(resumen);
        assertEquals(3, resumen.getItems().size()); 

        assertEquals(250.0, resumen.getTotalAPagar(), 0.01);
        assertEquals("B", resumen.getTipoFactura());
        
        verify(consumoDaoDB, times(1)).save(any(Consumo.class)); 
    }

    // test genera resumen sin generar alojamiento con tercero
    @Test
    void generarResumen_deberiaGenerarResumenSinGenerarAlojamiento_conTercero() {
        when(estadiaDaoDB.findById(ESTADIA_ID)).thenReturn(estadiaEjemplo);

        when(responsableDaoDB.findById(RESPONSABLE_ID)).thenReturn(responsableEjemploRI);

        FacturaResumenDTO resumen = gestorFactura.generarResumen(ESTADIA_ID, null, RESPONSABLE_ID);

        assertNotNull(resumen);
        assertEquals(2, resumen.getItems().size());
        
        assertEquals(150.0, resumen.getTotalAPagar(), 0.01); 
        assertEquals("A", resumen.getTipoFactura());
        
        verify(consumoDaoDB, never()).findByEstadiaIdAndTipo(anyLong(), anyString());
        verify(consumoDaoDB, never()).save(any(Consumo.class));
    }

    // test lanza excepcion si estadia no existe
    @Test
    void generarResumen_deberiaLanzarExcepcion_siEstadiaNoExiste() {
        when(estadiaDaoDB.findById(ESTADIA_ID)).thenReturn(null);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            gestorFactura.generarResumen(ESTADIA_ID, HUESPED_ID, null);
        });

        assertEquals("Estadía con ID 1 no encontrada.", exception.getMessage());
    }

    // test lanza excepcion si faltan datos responsable 
    @Test
    void generarResumen_deberiaLanzarExcepcion_siFaltanDatosResponsable() {
        when(estadiaDaoDB.findById(ESTADIA_ID)).thenReturn(estadiaEjemplo);
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            gestorFactura.generarResumen(ESTADIA_ID, null, null);
        });

        assertEquals("Faltan datos de Huésped o Responsable de Pago.", exception.getMessage());
    }
    
    // --- Tests para persistirFactura ---
    // test persistir factura y actualizar consumos con huesped nuevo
    @Test
    void persistirFactura_deberiaCrearNuevoResponsableFacturarYActualizarConsumos_conHuespedNuevo() {
        List<Long> idsSeleccionados = Arrays.asList(CONSUMO_ID_1, CONSUMO_ID_2);
        List<Consumo> consumosSeleccionados = Arrays.asList(consumo1, consumo2);

        when(consumoDaoDB.findByIds(idsSeleccionados)).thenReturn(consumosSeleccionados);

        when(huespedDaoDB.buscarPorId(HUESPED_ID)).thenReturn(huespedEjemplo);

        when(responsableDaoDB.findByFullIdentity("Juan Perez")).thenReturn(responsableEjemploCF); 

        Factura facturaGuardada = new Factura();
        facturaGuardada.setId(500L);
        when(facturaDaoDB.save(any(Factura.class))).thenReturn(facturaGuardada);

        Long facturaId = gestorFactura.persistirFactura(ESTADIA_ID, HUESPED_ID, null, idsSeleccionados);

        assertEquals(500L, facturaId);
        verify(direccionDaoDB, never()).save(any(Direccion.class));
        verify(responsableDaoDB, never()).save(any(Responsable_de_pago.class)); 
        verify(facturaDaoDB, times(1)).save(any(Factura.class));
        verify(estadiaDaoDB, times(1)).asociarFacturaAEstadia(ESTADIA_ID, facturaGuardada);
        verify(consumoDaoDB, times(2)).actualizar(any(Consumo.class)); 

        assertEquals("FACTURADO", consumo1.getEstado());
        assertEquals("FACTURADO", consumo2.getEstado());
    }

    // test persistir factura con tercero existente
    @Test
    void persistirFactura_deberiaUsarResponsableExistenteYFacturar_conTerceroExistente() {
        List<Long> idsSeleccionados = Arrays.asList(CONSUMO_ID_1);
        List<Consumo> consumosSeleccionados = Collections.singletonList(consumo1);

        when(consumoDaoDB.findByIds(idsSeleccionados)).thenReturn(consumosSeleccionados);

        when(responsableDaoDB.findById(RESPONSABLE_ID)).thenReturn(responsableEjemploRI);

        Factura facturaGuardada = new Factura();
        facturaGuardada.setId(501L);
        when(facturaDaoDB.save(any(Factura.class))).thenReturn(facturaGuardada);

        Long facturaId = gestorFactura.persistirFactura(ESTADIA_ID, null, RESPONSABLE_ID, idsSeleccionados);

        assertEquals(501L, facturaId);

        verify(responsableDaoDB, never()).findByFullIdentity(anyString());
        verify(responsableDaoDB, never()).save(any(Responsable_de_pago.class));
        verify(facturaDaoDB, times(1)).save(any(Factura.class));
        verify(consumoDaoDB, times(1)).actualizar(consumo1);
        
        assertEquals("FACTURADO", consumo1.getEstado());
    }

    // test lanza excepcion si no hay responsable
    @Test
    void persistirFactura_deberiaLanzarExcepcion_siNoHayResponsable() {
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            gestorFactura.persistirFactura(ESTADIA_ID, null, null, Collections.emptyList());
        });

        assertEquals("No se especificó un responsable de pago.", exception.getMessage());
    }

    // Tests para generarConsumoEstadiaSiNoExiste 
    // test genera consumo alojamiento si no existe
    @Test
    void generarConsumoEstadiaSiNoExiste_deberiaCrearYAsociarConsumo_siNoExiste() {
        when(consumoDaoDB.findByEstadiaIdAndTipo(ESTADIA_ID, "ALOJAMIENTO")).thenReturn(null);
        when(consumoDaoDB.save(any(Consumo.class))).thenReturn(consumo1);

        Consumo resultado = gestorFactura.generarConsumoEstadiaSiNoExiste(estadiaEjemplo);

        assertNotNull(resultado);
        assertEquals("ALOJAMIENTO", resultado.getTipo());
        assertEquals(estadiaEjemplo.getValor_estadia(), resultado.getValor(), 0.01);
        
        verify(consumoDaoDB, times(1)).save(any(Consumo.class));
        verify(estadiaDaoDB, times(1)).actualizar(estadiaEjemplo); 
        assertTrue(estadiaEjemplo.getLista_consumos().contains(resultado));
    }
    
    //test retorna consumo existente si ya existe
    @Test
    void generarConsumoEstadiaSiNoExiste_deberiaRetornarConsumoExistente_siYaExiste() {
        Consumo alojamientoExistente = new Consumo(200L, "ALOJAMIENTO", "PENDIENTE", 100.0, estadiaEjemplo);
        when(consumoDaoDB.findByEstadiaIdAndTipo(ESTADIA_ID, "ALOJAMIENTO")).thenReturn(alojamientoExistente);

        Consumo resultado = gestorFactura.generarConsumoEstadiaSiNoExiste(estadiaEjemplo);

        assertNotNull(resultado);
        assertEquals(alojamientoExistente.getId(), resultado.getId());
        
        verify(consumoDaoDB, never()).save(any(Consumo.class));
        verify(estadiaDaoDB, never()).actualizar(any(Estadia.class));
    }

    // Tests para generarResumenConConsumos (Lógica de IVA)
    //test calcula resumen con responsable RI (Factura A)
    @Test
    void generarResumenConConsumos_deberiaCalcularTipoAFactura() {
        List<Consumo> consumos = Arrays.asList(consumo1, consumo2);
        double subtotalBruto = 150.0;
        final double IVA_RATE = 0.21;
        double subtotalNetoEsperado = subtotalBruto / (1 + IVA_RATE);
        double montoIVAEsperado = subtotalBruto - subtotalNetoEsperado;
        when(responsableDaoDB.findById(RESPONSABLE_ID)).thenReturn(responsableEjemploRI);
        
        FacturaResumenDTO resumen = gestorFactura.generarResumenConConsumos(
            consumos, RESPONSABLE_ID, false); 
        assertNotNull(resumen);
        assertEquals("A", resumen.getTipoFactura());
        assertEquals(subtotalBruto, resumen.getTotalAPagar(), 0.01);
        assertEquals(subtotalNetoEsperado, resumen.getSubtotalNeto(), 0.01);
        assertEquals(montoIVAEsperado, resumen.getMontoIVA(), 0.01);
    }
    
    //test calcula resumen con responsable CF (Factura B)
    @Test
    void generarResumenConConsumos_deberiaCalcularTipoBFactura() {
        when(responsableDaoDB.findById(RESPONSABLE_ID + 1)).thenReturn(responsableEjemploCF);
        
        List<Consumo> consumos = Arrays.asList(consumo1, consumo2);

        FacturaResumenDTO resumen = gestorFactura.generarResumenConConsumos(
            consumos, RESPONSABLE_ID + 1, false);
        assertNotNull(resumen);
        assertEquals("B", resumen.getTipoFactura());
        assertEquals(150.0, resumen.getTotalAPagar(), 0.01);
        assertEquals(150.0, resumen.getSubtotalNeto(), 0.01);
        assertEquals(0.0, resumen.getMontoIVA(), 0.01);
    }
}