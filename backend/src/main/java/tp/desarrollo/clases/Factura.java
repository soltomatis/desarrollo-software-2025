package tp.desarrollo.clases;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Factura {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "responsable_de_pago_id", nullable = false)
    private Responsable_de_pago responsableDePago;
    private String tipoFactura;
    private double total;
    private String estado;
    @OneToMany
    @JoinColumn(name = "factura_id")
    private List<Pago> listaPagos;
}
