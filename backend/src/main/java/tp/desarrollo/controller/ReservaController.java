package tp.desarrollo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tp.desarrollo.dto.ReservaDTO;
import tp.desarrollo.gestores.Gestor_Reserva;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "http://localhost:3000") 
public class ReservaController {

    @Autowired
    Gestor_Reserva gestorReserva;

    @PostMapping("/crear")
    public ResponseEntity<?> crearReserva(@RequestBody ReservaDTO reservaDTO) throws Exception {
        gestorReserva.confirmarReserva(reservaDTO);
        return ResponseEntity.ok("Reserva creada con éxito");
    }

    @DeleteMapping("/cancelar/{id}")
    public ResponseEntity<?> cancelarReserva(@PathVariable int id) {
        try {
            gestorReserva.cancelarReserva(id);
            return ResponseEntity.ok("Reserva cancelada con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error al cancelar la reserva: " + e.getMessage());
        }
    }

}
