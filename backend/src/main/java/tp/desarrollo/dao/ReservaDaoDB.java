package tp.desarrollo.dao;

import java.util.List;

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

    public List<Reserva> buscarPorHuespedPrincipalId(Long id) {

    String jpql = "SELECT DISTINCT r FROM Reserva r " +
                  "LEFT JOIN FETCH r.listaHabitacionesRerservadas det " + 
                  "LEFT JOIN FETCH det.habitacion " + 
                  "WHERE r.huespedPrincipal.id = :huespedId";

    return em.createQuery(jpql, Reserva.class)
             .setParameter("huespedId", id)
             .getResultList();
}
    
}
