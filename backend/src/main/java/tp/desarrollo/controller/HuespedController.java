package tp.desarrollo.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tp.desarrollo.dto.HuespedDTO;
import tp.desarrollo.gestores.Gestor_Usuario;

@RestController
@RequestMapping("/api/huespedes")
@CrossOrigin(origins = "http://localhost:3000") 
public class HuespedController {
    @Autowired
    Gestor_Usuario gestorHuesped;

    @GetMapping("/buscar")
    public ResponseEntity<List<HuespedDTO>> buscarHuespedesApi(
            @RequestParam(value = "nombre", required = false) String nombre,
            @RequestParam(value = "apellido", required = false) String apellido,
            @RequestParam(value = "tipo_documento", required = false) String tipoDocumento,
            @RequestParam(value = "num_documento", required = false) String numDocumento) {
        try {
            List<HuespedDTO> resultados = gestorHuesped.buscarHuespedes(
                nombre, apellido, tipoDocumento, numDocumento); 
            
            return ResponseEntity.ok(resultados);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }
    @GetMapping("/buscarPorId")
    public ResponseEntity<HuespedDTO> buscarHuespedPorIdApi(
            @RequestParam(value = "id") Long id) {
        try {
            HuespedDTO huesped = gestorHuesped.buscarHuespedPorId(id); 
            if (huesped != null) {
                return ResponseEntity.ok(huesped);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    @DeleteMapping("/borrar")
    public ResponseEntity<String> borrarHuesped(@RequestParam(value = "id") Long id) {
        try {
            gestorHuesped.borrarHuesped(id);
            return ResponseEntity.noContent().build(); 
        } catch (Exception e) {
            System.err.println("------ ERROR CRÍTICO EN EL BACK-END ------");
            e.printStackTrace(); // ¡FUERZA LA IMPRESIÓN DEL STACK TRACE!
            System.err.println("------------------------------------------");
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno del servidor al intentar borrar.");
        }
    }
}
