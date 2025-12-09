package tp.desarrollo.model;

import java.util.List;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.CascadeType;
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
public class Reserva {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToMany(mappedBy = "reserva", 
               cascade = CascadeType.ALL, 
               orphanRemoval = true)
    private List<ReservaHabitacion> listaHabitacionesRerservadas;

    @ManyToOne
    @JoinColumn(name = "huesped_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Huesped huespedPrincipal;

}
