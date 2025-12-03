package tp.desarrollo.dao;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import tp.desarrollo.clases.Reserva;
import tp.desarrollo.interfaces.ReservaDAO;

@Repository
public class ReservaDaoDB implements ReservaDAO {

    @PersistenceContext

    private EntityManager em;

    public Reserva guardarReserva(Reserva reservaPrincipal) {
        em.persist(reservaPrincipal);
        return reservaPrincipal; 
    }

    @Override
    public Reserva buscarReservaPorId(int id) {
        return em.find(Reserva.class, id);
    }

    @Override
    public void eliminarReserva(Reserva reserva) {
        if (!em.contains(reserva)) {
            reserva = em.merge(reserva);
        }
        em.remove(reserva);
    }
    
}
