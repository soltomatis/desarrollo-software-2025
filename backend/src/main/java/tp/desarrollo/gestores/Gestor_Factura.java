package tp.desarrollo.gestores;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tp.desarrollo.clases.Consumo;
import tp.desarrollo.clases.Direccion;
import tp.desarrollo.clases.Estadia;
import tp.desarrollo.clases.Factura;
import tp.desarrollo.clases.Huesped;
import tp.desarrollo.clases.Responsable_de_pago;
import tp.desarrollo.dao.ConsumoDaoDB;
import tp.desarrollo.dao.DireccionDaoDB;
import tp.desarrollo.dao.EstadiaDaoDB;
import tp.desarrollo.dao.FacturaDaoDB;
import tp.desarrollo.dao.HuespedDaoDB;
import tp.desarrollo.dao.ResponsableDaoDB;
import tp.desarrollo.dto.ConsumoDTO;
import tp.desarrollo.dto.FacturaResumenDTO;
import tp.desarrollo.enums.CondicionIVA;
import tp.desarrollo.repositorio.EstrategiaFacturacion;
import tp.desarrollo.repositorio.Impl.FacturaATipoA;
import tp.desarrollo.repositorio.Impl.FacturaBTipoB;
import tp.desarrollo.repositorio.Impl.FacturaCMonotributista;

@Service
public class Gestor_Factura {

    @Autowired
    ConsumoDaoDB consumoDaoDB;
    @Autowired
    HuespedDaoDB huespedDaoDB;
    @Autowired
    EstadiaDaoDB estadiaDaoDB;
    @Autowired
    FacturaDaoDB facturaDaoDB;
    @Autowired
    ResponsableDaoDB responsableDaoDB;
    @Autowired
    DireccionDaoDB direccionDaoDB;

    @Transactional
    public FacturaResumenDTO generarResumen(Long estadiaId, Long huespedId , Long responsableId) {
        
        Estadia estadia = estadiaDaoDB.findById(estadiaId);
        if (estadia == null) {
            throw new RuntimeException("Estadía con ID " + estadiaId + " no encontrada."); 
        }

        Long idResponsableFinal;
        boolean esHuesped;

        if (huespedId != null && responsableId == null) {
            idResponsableFinal = huespedId;
            esHuesped = true;
        } else if (responsableId != null) {

            idResponsableFinal = responsableId; 
            esHuesped = false;
        } else {
            throw new IllegalArgumentException("Faltan datos de Huésped o Responsable de Pago.");
        }

        if (huespedId != null && responsableId == null) {
            generarConsumoEstadiaSiNoExiste(estadia);
        }

        List<Consumo> consumosPendientes = new ArrayList<>();

        for (Consumo consumo : estadia.getLista_consumos()) {
            if ("PENDIENTE".equals(consumo.getEstado())) { 
                consumosPendientes.add(consumo);
            }
        }

        return this.generarResumenConConsumos(consumosPendientes, idResponsableFinal, esHuesped);
    }

    @Transactional
    public Long persistirFactura(Long estadiaId, Long huespedId, Long responsableId, List<Long> idsConsumosSeleccionados) {
    
        boolean esHuesped = huespedId != null;
        Long idResponsableFinal = esHuesped ? huespedId : responsableId;
        
        if (idResponsableFinal == null) {
            throw new RuntimeException("No se especificó un responsable de pago.");
        }
        
        List<Long> idsConsumosReales = idsConsumosSeleccionados.stream()
            .filter(id -> id > 0) 
            .collect(Collectors.toList());

        List<Consumo> consumosSeleccionados = consumoDaoDB.findByIds(idsConsumosReales);

        FacturaResumenDTO resumen = generarResumenConConsumos(consumosSeleccionados, idResponsableFinal, esHuesped);

        Responsable_de_pago responsable;

        if (esHuesped) {
            Huesped huespedResponsable = huespedDaoDB.buscarPorId(huespedId);
            String razonSocialCalculada = huespedResponsable.getNombre() + " " + huespedResponsable.getApellido();
            
            responsable = responsableDaoDB.findByFullIdentity(razonSocialCalculada);

            if (responsable == null) {

                responsable = new Responsable_de_pago(huespedResponsable);
                responsable.setRazonSocial(razonSocialCalculada);
                responsable.setCondicionIVA(huespedResponsable.getCondicionIVA());
                Direccion dirOriginal = huespedResponsable.getDIRECCION();
                Direccion nuevaDireccion = new Direccion();

                if (dirOriginal != null) {
                    nuevaDireccion.setCalle(dirOriginal.getCalle());
                    nuevaDireccion.setNumero(dirOriginal.getNumero());
                    nuevaDireccion.setLocalidad(dirOriginal.getLocalidad());
                    nuevaDireccion.setProvincia(dirOriginal.getProvincia());
                    nuevaDireccion.setCodigoPostal(dirOriginal.getCodigoPostal());
                    nuevaDireccion.setPais(dirOriginal.getPais());
                    nuevaDireccion = direccionDaoDB.save(nuevaDireccion);
                }
                
                responsable.setDireccion(nuevaDireccion);
                responsable = responsableDaoDB.save(responsable); 
                
            } 
        }else {
        responsable = responsableDaoDB.findById(responsableId);
        if (responsable == null) {
            throw new RuntimeException("Responsable de pago (Tercero) con ID " + responsableId + " no encontrado al persistir.");
        }
        }
        Factura nuevaFactura = new Factura();
        nuevaFactura.setTipoFactura(resumen.getTipoFactura());
        nuevaFactura.setTotal(resumen.getTotalAPagar()); 
        nuevaFactura.setEstado("EMITIDA");
        nuevaFactura.setResponsableDePago(responsable); 

        nuevaFactura = facturaDaoDB.save(nuevaFactura); 
        estadiaDaoDB.asociarFacturaAEstadia(estadiaId, nuevaFactura);

        for (Consumo consumo : consumosSeleccionados) {
            consumo.setEstado("FACTURADO"); 
            consumoDaoDB.actualizar(consumo); 
        }
        
        return nuevaFactura.getId(); 
    }

    public Consumo generarConsumoEstadiaSiNoExiste(Estadia estadia) {
    
        Consumo consumoEstadiaExistente = consumoDaoDB.findByEstadiaIdAndTipo(estadia.getId(), "ALOJAMIENTO");

        if (consumoEstadiaExistente != null) {
            return consumoEstadiaExistente; 
        }
        Consumo alojamiento = new Consumo();;
        alojamiento.setValor(estadia.getValor_estadia()); 
        alojamiento.setEstado("PENDIENTE");
        alojamiento.setTipo("ALOJAMIENTO");
        alojamiento.setEstadia(estadia);
        consumoDaoDB.save(alojamiento);
        estadia.agregarConsumo(alojamiento);
        estadiaDaoDB.actualizar(estadia);

        return alojamiento;
    }

    private EstrategiaFacturacion seleccionarEstrategia(CondicionIVA condicion) {
        switch (condicion) {
            case RESPONSABLE_INSCRIPTO:
                return new FacturaATipoA();
            case MONOTRIBUTO:
                return new FacturaCMonotributista();
            case CONSUMIDOR_FINAL:
            default:
                return new FacturaBTipoB();
        }
    }


    public FacturaResumenDTO generarResumenConConsumos(
        List<Consumo> consumosAFacturar, Long idResponsable, boolean esHuesped) {
        
        Responsable_de_pago responsable = obtenerResponsablePago(idResponsable, esHuesped);

        // Seleccionar estrategia
        EstrategiaFacturacion estrategia = seleccionarEstrategia(responsable.getCondicionIVA());

        List<ConsumoDTO> items = new ArrayList<>();
        double subtotalBruto = 0.0;

        for (Consumo consumo : consumosAFacturar) {
            Long itemId = consumo.getId();
            String descripcion = consumo.getTipo();
            items.add(new ConsumoDTO(itemId, descripcion, consumo.getValor()));
            subtotalBruto += consumo.getValor();
        }

        final double IVA_RATE = 0.21;
        double subtotalNeto = subtotalBruto / (1 + IVA_RATE);
        double montoIVA = subtotalBruto - subtotalNeto;

        CondicionIVA posicionIVA = responsable.getCondicionIVA(); 
        String tipoFactura = posicionIVA.equals(CondicionIVA.RESPONSABLE_INSCRIPTO) ? "A" : "B";    
        
        FacturaResumenDTO resumen = new FacturaResumenDTO();
        resumen.setNombreResponsable(responsable.getRazonSocial());
        resumen.setItems(items);
        resumen.setTipoFactura(tipoFactura);

        /* Es lo mismo que lo proximo
        if (tipoFactura.equals("A")) {
            resumen.setSubtotalNeto(subtotalNeto);
            resumen.setMontoIVA(montoIVA);
            resumen.setTotalAPagar(subtotalBruto); 
        } else {
            resumen.setSubtotalNeto(subtotalBruto); 
            resumen.setMontoIVA(0.00); 
            resumen.setTotalAPagar(subtotalBruto); 
        }
         */

        //Realizado con patrón STRATEGY PATTERN
        resumen.setTotalAPagar(estrategia.calcularTotal(subtotalBruto));
        resumen.setMontoIVA(estrategia.calcularIVA(subtotalBruto));
        resumen.setSubtotalNeto(subtotalBruto - resumen.getMontoIVA());

        return resumen;
    }

    private Responsable_de_pago obtenerResponsablePago(Long id, boolean esHuesped) {
        if (esHuesped) {
            Huesped huesped = huespedDaoDB.buscarPorId(id);
            if (huesped == null) {
                throw new RuntimeException("Huésped responsable con ID " + id + " no encontrado.");
            }

            String razonSocial = huesped.getNombre() + " " + huesped.getApellido();
            Responsable_de_pago responsable = responsableDaoDB.findByFullIdentity(razonSocial);

            if (responsable == null) {
                Responsable_de_pago nuevoResponsable = new Responsable_de_pago(huesped);
                responsable = responsableDaoDB.save(nuevoResponsable);
            }
            return responsable;

        } else {
            Responsable_de_pago responsable = responsableDaoDB.findById(id);
            if (responsable == null) {
                throw new RuntimeException("Responsable de pago externo con ID " + id + " no encontrado.");
            }
            return responsable;
        }
    }

}
