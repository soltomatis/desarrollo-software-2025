package tp.desarrollo.dto;

import java.util.List;
import lombok.Data;

@Data
public class ReservaDTO {

    private Integer id;

    private List<ReservaHabitacionDTO> listaHabitacionesReservadas;

    private HuespedDTO huespedPrincipal;

}
