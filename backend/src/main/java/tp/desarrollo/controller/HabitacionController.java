package tp.desarrollo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RestController;

import tp.desarrollo.dto.EstadoHabitacionDTO;
import tp.desarrollo.dto.HabitacionDTO;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/habitaciones")
@CrossOrigin(origins = "http://localhost:3000") 
public class HabitacionController {
    @GetMapping("/estado") 
    public List<HabitacionDTO> getEstadoHabitacionesPorRango( 
        @RequestParam("desde") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaDesde,
        @RequestParam("hasta") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaHasta) {  

        EstadoHabitacionDTO estadoMock = new EstadoHabitacionDTO(
            tp.desarrollo.enums.Estado.OCUPADA, 
            LocalDate.of(2025, 3, 1), 
            LocalDate.of(2025, 3, 5)
        );
        HabitacionDTO habitacionMock = new HabitacionDTO(
            (long) 101, 
            "Doble Premium", 
            4, 
            1, 
            1, 
            0, 
            List.of(estadoMock)
        );
        return List.of(habitacionMock);
        }
}
