package tp.desarrollo.dao;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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
    
}
