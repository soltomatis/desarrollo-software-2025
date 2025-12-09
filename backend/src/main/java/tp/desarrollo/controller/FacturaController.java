package tp.desarrollo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tp.desarrollo.clases.Responsable_de_pago;
import tp.desarrollo.dto.CalculoFacturaRequest;
import tp.desarrollo.dto.FacturaResumenDTO;
import tp.desarrollo.services.Gestor_Factura;

@RestController
@RequestMapping("api/factura")
@CrossOrigin(origins = "http://localhost:3000")
public class FacturaController {
    
    @Autowired
    Gestor_Factura gestorFactura;
    @Autowired
    tp.desarrollo.repository.ResponsableDaoDB responsableDaoDB;

    @PostMapping(value = "/resumen")
    public ResponseEntity<?> obtenerResumenConMap(@RequestBody CalculoFacturaRequest request) {

        Long estadiaId = request.getEstadiaId();
        Long huespedId = request.getHuespedId();
        Long responsableId = request.getResponsableId();

        FacturaResumenDTO resumen = gestorFactura.generarResumen(estadiaId, huespedId,responsableId);
        
        return ResponseEntity.ok(resumen);
    }

    @PostMapping("/generar")
    public ResponseEntity<Long> generarFacturaFinal(@RequestBody CalculoFacturaRequest request) {
        if (request.getEstadiaId() == null) {
            return ResponseEntity.badRequest().body(-1L); 
        }

        boolean tieneResponsable = request.getHuespedId() != null || request.getResponsableId() != null;
        if (!tieneResponsable || 
            request.getIdsConsumosSeleccionados() == null || 
            request.getIdsConsumosSeleccionados().isEmpty()) 
        {
            return ResponseEntity.badRequest().body(-1L);
        }

        Long nuevaFacturaId = gestorFactura.persistirFactura(
            request.getEstadiaId(), 
            request.getHuespedId(),
            request.getResponsableId(),
            request.getIdsConsumosSeleccionados()
        );
        
        return ResponseEntity.ok(nuevaFacturaId);
    }

    @GetMapping("/buscar-cuit")
    public ResponseEntity<?> buscarPorCuit(@RequestParam String cuit) {
        Responsable_de_pago responsable = responsableDaoDB.findByCuit(cuit);
        if (responsable != null) {
            return ResponseEntity.ok(Map.of(
                "id", responsable.getId(),
                "razonSocial", responsable.getRazonSocial(),
                "cuit", responsable.getCUIT()
            ));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
