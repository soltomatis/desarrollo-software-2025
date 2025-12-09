package tp.desarrollo.repository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import jakarta.persistence.TypedQuery;
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

    public List<Reserva> buscarReservasPorCriterios(String apellido, String nombre,
                                                    Long numeroHabitacion, String tipoHabitacion,
                                                    String fechaInicio, String fechaFin) {

        StringBuilder jpql = new StringBuilder(
                "SELECT DISTINCT r FROM Reserva r " +
                        "LEFT JOIN FETCH r.listaHabitacionesRerservadas rh " +
                        "LEFT JOIN FETCH rh.habitacion h " +
                        "LEFT JOIN FETCH r.huespedPrincipal hp " +
                        "WHERE 1=1"
        );

        if (apellido != null && !apellido.trim().isEmpty()) {
            jpql.append(" AND LOWER(hp.apellido) LIKE LOWER(:apellido)");
        }

        if (nombre != null && !nombre.trim().isEmpty()) {
            jpql.append(" AND LOWER(hp.nombre) LIKE LOWER(:nombre)");
        }

        if (numeroHabitacion != null) {
            jpql.append(" AND h.numeroHabitacion = :numeroHabitacion");
        }

        if (tipoHabitacion != null && !tipoHabitacion.trim().isEmpty()) {
            jpql.append(" AND LOWER(h.tipo) LIKE LOWER(:tipoHabitacion)");
        }

        if (fechaInicio != null && !fechaInicio.trim().isEmpty()) {
            jpql.append(" AND rh.fecha_inicio >= :fechaInicio");
        }

        if (fechaFin != null && !fechaFin.trim().isEmpty()) {
            jpql.append(" AND rh.fecha_fin <= :fechaFin");
        }

        TypedQuery<Reserva> query = em.createQuery(jpql.toString(), Reserva.class);

        if (apellido != null && !apellido.trim().isEmpty()) {
            query.setParameter("apellido", "%" + apellido + "%");
        }

        if (nombre != null && !nombre.trim().isEmpty()) {
            query.setParameter("nombre", "%" + nombre + "%");
        }

        if (numeroHabitacion != null) {
            query.setParameter("numeroHabitacion", numeroHabitacion);
        }

        if (tipoHabitacion != null && !tipoHabitacion.trim().isEmpty()) {
            query.setParameter("tipoHabitacion", "%" + tipoHabitacion + "%");
        }

        if (fechaInicio != null && !fechaInicio.trim().isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate fecha = LocalDate.parse(fechaInicio, formatter);
            query.setParameter("fechaInicio", fecha);
        }

        if (fechaFin != null && !fechaFin.trim().isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate fecha = LocalDate.parse(fechaFin, formatter);
            query.setParameter("fechaFin", fecha);
        }

        return query.getResultList();
    }
    
}
