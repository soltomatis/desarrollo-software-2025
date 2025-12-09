package tp.desarrollo.repository;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import tp.desarrollo.model.ReservaHabitacion;

@Repository
public class ReservaHabitacionDaoDB {
    @PersistenceContext
    private EntityManager entityManager;
    public void save(ReservaHabitacion item) {
        entityManager.persist(item);
    }
    
}
