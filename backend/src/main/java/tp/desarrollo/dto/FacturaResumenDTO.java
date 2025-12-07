package tp.desarrollo.dto;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FacturaResumenDTO {

    private String nombreResponsable;

    private List<ConsumoDTO> items; 

    private String tipoFactura; 
    private double subtotalNeto;
    private double montoIVA;
    private double totalAPagar;

} 
