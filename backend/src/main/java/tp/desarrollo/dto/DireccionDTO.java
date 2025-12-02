package tp.desarrollo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
@NoArgsConstructor
@Data
public class DireccionDTO {

    String calle;
    int numero;
    String departamento;
    int piso;
    Integer codigoPostal;
    String localidad;
    String provincia;
    String pais;

    public DireccionDTO(String calle2, int numero2, String departamento2, int piso2, Integer codigoPostal2,
        String localidad2, String provincia2, String pais2) {
        this.calle = calle2;
        this.numero = numero2;
        this.departamento = departamento2;
        this.piso = piso2;
        this.codigoPostal = codigoPostal2;
        this.localidad = localidad2;
        this.provincia = provincia2;
        this.pais = pais2;
    }

}
