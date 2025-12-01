package tp.desarrollo.dto;
import java.time.LocalDate;

import tp.desarrollo.enums.Estado;
import lombok.Data;
import lombok.AllArgsConstructor; 
import lombok.NoArgsConstructor; 

@Data
@AllArgsConstructor 
@NoArgsConstructor
public class EstadoHabitacionDTO {
    private Estado estado;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}
