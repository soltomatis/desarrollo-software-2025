package tp.desarrollo.dao;

import java.util.List;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import tp.desarrollo.clases.Habitacion;
import tp.desarrollo.interfaces.HabitacionDAO;

@Repository
public class HabitacionDaoDB implements HabitacionDAO {
@PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Habitacion> listarHabitaciones() {
        String jpql = "SELECT h FROM Habitacion h LEFT JOIN FETCH h.historiaEstados";
        List<Habitacion> habitaciones = entityManager.createQuery(jpql, Habitacion.class)
                                                   .getResultList();
        
        return habitaciones;
    }

    public Habitacion buscarId(Long idHabitacion) {
        return entityManager.find(Habitacion.class, idHabitacion);
    }

    public void actualizarHabitacion(Habitacion habitacion) {
        entityManager.merge(habitacion);
    }

    public Habitacion buscarPorNumero(Long numeroHabitacion) {
        String jpql = "SELECT h FROM Habitacion h LEFT JOIN FETCH h.historiaEstados WHERE h.numeroHabitacion = :numero";
        List<Habitacion> resultados = entityManager.createQuery(jpql, Habitacion.class)
                                                  .setParameter("numero", numeroHabitacion)
                                                  .getResultList();
        return resultados.isEmpty() ? null : resultados.get(0);
    }
}
