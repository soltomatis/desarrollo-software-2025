package tp.desarrollo.clases;

import java.time.LocalDate;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import tp.desarrollo.enums.TipoDocumento;


@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Responsable_de_pago extends Persona {
    private String razonSocial;
    
}
