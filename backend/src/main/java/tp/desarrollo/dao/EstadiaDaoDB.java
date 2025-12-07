package tp.desarrollo.dao;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import tp.desarrollo.clases.Estadia;
import tp.desarrollo.clases.Factura;
import tp.desarrollo.interfaces.EstadiaDAO;
@Repository
public class EstadiaDaoDB implements EstadiaDAO {
    @PersistenceContext
    private EntityManager em;
    @Override
    public boolean elHuespedSeHaAlojado(Long huespedId) {
    String jpql = "SELECT COUNT(e) FROM Estadia e JOIN e.huespedes h WHERE h.id = :id";
    Long conteo = em.createQuery(jpql, Long.class)
                    .setParameter("id", huespedId)
                    .getSingleResult();
    
    return conteo > 0;
    }
    @Transactional
    public Estadia buscarEstadiaActivaPorHabitacionId(Long numeroHabitacion) {
    String jpql = "SELECT e FROM Estadia e WHERE e.habitacion.numeroHabitacion = :numeroHabitacion AND e.fecha_check_out IS NULL";
    return em.createQuery(jpql, Estadia.class)
             .setParameter("numeroHabitacion", numeroHabitacion)
             .getResultStream()
             .findFirst()
             .orElse(null);
    }
    @Transactional
    public void actualizar(Estadia estadiaActiva) {
    em.merge(estadiaActiva);
    }
    public Estadia findById(Long estadiaId) {
        return em.find(Estadia.class, estadiaId);
    }
    public void asociarFacturaAEstadia(Long estadiaId, Factura nuevaFactura) {
        Estadia estadia = em.find(Estadia.class, estadiaId);
        if (estadia != null) {
            estadia.getLista_facturas().add(nuevaFactura);
            em.merge(estadia);
        }
    }

    
}
