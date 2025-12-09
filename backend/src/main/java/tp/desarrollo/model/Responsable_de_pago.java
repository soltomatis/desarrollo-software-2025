package tp.desarrollo.model;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import tp.desarrollo.enums.CondicionIVA;

@Entity
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Responsable_de_pago extends Persona {
    private String razonSocial;
    private CondicionIVA condicionIVA;
    public Responsable_de_pago(Huesped huesped) {
        super(huesped.getApellido(), huesped.getNombre(), huesped.getTipo_documento(),
              huesped.getNum_documento(), huesped.getCUIT(), huesped.getFecha_nacimiento(),
              null, huesped.getNacionalidad());
        this.razonSocial = huesped.getApellido() + ", " + huesped.getNombre();
        this.condicionIVA = huesped.getCondicionIVA();
    }
}
