package tp.desarrollo.dto;
import java.util.List;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor; 

@Data
@AllArgsConstructor 
@NoArgsConstructor
public class HabitacionDTO {
    private Long numeroHabitacion;
    private String tipo;
    private int cantidadHuespedes;
    private int cantidadCamaI;
    private int cantidadCamaD;
    private int cantidadCamaKS;
    private List<EstadoHabitacionDTO> historiaEstados;
}
