package tp.desarrollo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
