package tp.desarrollo.dto;

import java.util.List;
import lombok.Data;

@Data
public class ReservaDTO {
    private List<ReservaHabitacionDTO> listaHabitacionesReservadas;
    private HuespedDTO huespedPrincipal;
}
