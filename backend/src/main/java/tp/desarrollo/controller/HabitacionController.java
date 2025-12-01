package tp.desarrollo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RestController;

import tp.desarrollo.dto.HabitacionDTO;
import tp.desarrollo.gestores.Gestor_Habitacion;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habitaciones")
@CrossOrigin(origins = "http://localhost:3000") 
public class HabitacionController {
    private final Gestor_Habitacion gestorHabitacion;
    public HabitacionController(Gestor_Habitacion gestorHabitacion) {
        this.gestorHabitacion = gestorHabitacion;
    }
    @GetMapping("/estado") 
    public List<HabitacionDTO> getEstadoHabitacionesPorRango( 
        @RequestParam("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaDesde,
        @RequestParam("hasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaHasta) {  

            return gestorHabitacion.mostrarEstadoHabitaciones(fechaDesde, fechaHasta);
        }
}
