package tp.desarrollo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import tp.desarrollo.dto.CancelarReservaDTO;
import tp.desarrollo.dto.ReservaDTO;
import tp.desarrollo.gestores.Gestor_Reserva;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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


    @GetMapping("/buscar")
    public ResponseEntity<?> buscarReservas(
            @RequestParam(required = false) String apellido,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Long numeroHabitacion,
            @RequestParam(required = false) String tipoHabitacion,
            @RequestParam(required = false) String fechaInicio,
            @RequestParam(required = false) String fechaFin) {

        try {
            if ((apellido == null || apellido.trim().isEmpty())) {
                Map<String, String> error = new HashMap<>();
                error.put("mensaje", "El campo apellido no puede estar vacío");
                return ResponseEntity.badRequest().body(error);
            }

            List<ReservaDTO> reservas = gestorReserva.buscarReservas(
                    apellido, nombre, numeroHabitacion, tipoHabitacion, fechaInicio, fechaFin);

            if (reservas.isEmpty()) {
                Map<String, String> mensaje = new HashMap<>();
                mensaje.put("mensaje", "No existen reservas para los criterios de búsqueda");
                return ResponseEntity.ok(mensaje);
            }

            return ResponseEntity.ok(reservas);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error al buscar reservas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/cancelar")
    public ResponseEntity<?> cancelarReservas(
            @RequestBody CancelarReservaDTO request) {

        try {

            List<Integer> reservasCanceladas = gestorReserva.cancelarReservas(request.getIdsReservas());

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Reservas canceladas PRESIONE UNA TECLA PARA CONTINUAR...");
            respuesta.put("reservasCanceladas", reservasCanceladas);
            respuesta.put("cantidad", reservasCanceladas.size());
            respuesta.put("habitacionesLiberadas", true); // Las habitaciones quedan disponibles

            return ResponseEntity.ok(respuesta);

        } catch (Exception e) {

            Map<String, String> error = new HashMap<>();
            error.put("mensaje", "Error al cancelar reservas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/cancelar/{id}")
    public ResponseEntity<?> cancelarReserva(@PathVariable int id) {
        try {
            gestorReserva.cancelarReserva(id);

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Reserva cancelada con éxito");
            respuesta.put("reservaId", id);
            respuesta.put("habitacionesLiberadas", true);

            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error al cancelar la reserva: " + e.getMessage());
        }
    }

}
