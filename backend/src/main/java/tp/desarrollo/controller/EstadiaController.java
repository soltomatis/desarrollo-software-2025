package tp.desarrollo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityNotFoundException;
import tp.desarrollo.clases.Estadia;
import tp.desarrollo.dto.CheckOutRequest;
import tp.desarrollo.services.Gestor_Estadia;

@RestController
@RequestMapping("api/estadia")
@CrossOrigin(origins = "http://localhost:3000")
public class EstadiaController { 
    @Autowired
    private Gestor_Estadia gestorEstadia;

    @GetMapping("/buscar")
    public ResponseEntity<?> buscarEstadiaPorHabitacionYSalida(
        @RequestParam String numeroHabitacion,
        @RequestParam String horaMinutoSalida
    ) {
        try {
            Estadia estadia = gestorEstadia.buscarEstadia(numeroHabitacion);
            
            return ResponseEntity.ok(estadia);

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al buscar la estadía: " + e.getMessage());
        }
    }
    @PutMapping("/checkout/{id}")
    public ResponseEntity<?> actualizarCheckOut(
        @PathVariable Long id,
        @RequestBody CheckOutRequest request
    ) {
        try {
            Estadia estadiaActualizada = gestorEstadia.actualizarCheckOut(
                id,
                request.getHoraSalida()
            );
            return ResponseEntity.ok(estadiaActualizada); 

        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al realizar el check-out: " + e.getMessage());
        }
    }
}