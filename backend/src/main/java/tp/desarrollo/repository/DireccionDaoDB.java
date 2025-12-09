package tp.desarrollo.repository;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import tp.desarrollo.clases.Direccion;
import tp.desarrollo.interfaces.DireccionDAO;

@Repository
public class DireccionDaoDB implements DireccionDAO {
    @PersistenceContext
    private EntityManager em;
    public Direccion save(Direccion nuevaDireccion) {
        em.persist(nuevaDireccion);
        return nuevaDireccion;
    }
    
}
