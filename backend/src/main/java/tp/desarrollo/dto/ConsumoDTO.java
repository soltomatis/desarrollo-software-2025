package tp.desarrollo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsumoDTO {
    private Long id;
    private String descripcion;
    private double valor;
}
