package tp.desarrollo.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import tp.desarrollo.model.Huesped;
import tp.desarrollo.dto.HuespedDTO;
import tp.desarrollo.enums.TipoDocumento;
import tp.desarrollo.interfaces.HuespedDAO;

@Repository
public class HuespedDaoDB implements HuespedDAO {
    @PersistenceContext
    private EntityManager em;
    public void modificar_huesped(HuespedDTO huespedOriginal, HuespedDTO huespedModificado){
    
    }
    public List<Huesped> buscar_huespedes(HuespedDTO huesped){
        StringBuilder jpql = new StringBuilder("SELECT h FROM Huesped h WHERE 1=1");
        
        if (huesped.getNombre() != null && !huesped.getNombre().isEmpty()) {
            jpql.append(" AND LOWER(h.nombre) LIKE LOWER(:nombre)");
        }
        if (huesped.getApellido() != null && !huesped.getApellido().isEmpty()) {
            jpql.append(" AND LOWER(h.apellido) LIKE LOWER(:apellido)");
        }
        if (huesped.getTipo_documento() != null) {
            jpql.append(" AND h.tipoDocumento = :tipoDocumento");
        }
        if (huesped.getNum_documento() > 0) {
            jpql.append(" AND h.numDocumento = :numDocumento");
        }

        TypedQuery<Huesped> query = em.createQuery(jpql.toString(), Huesped.class);
        
        if (huesped.getNombre() != null && !huesped.getNombre().isEmpty()) {
            query.setParameter("nombre", "%" + huesped.getNombre() + "%");
        }
        if (huesped.getApellido() != null && !huesped.getApellido().isEmpty()) {
            query.setParameter("apellido", "%" + huesped.getApellido() + "%");
        }
        if (huesped.getTipo_documento() != null) {
            query.setParameter("tipoDocumento", huesped.getTipo_documento());
        }
        if (huesped.getNum_documento() > 0) {
            query.setParameter("numDocumento", huesped.getNum_documento());
        }

        return query.getResultList();
    }

    public boolean existe_documento(TipoDocumento tipoDocumento, long numeroDocumento){
        return false;
    }
public Huesped buscarHuespedPorDatos(String nombre, String apellido, String telefono) {
        String jpql = "SELECT h FROM Huesped h WHERE h.nombre = :nombre AND h.apellido = :apellido AND h.telefono = :telefono";
    
        TypedQuery<Huesped> query = em.createQuery(jpql, Huesped.class);
        

        query.setParameter("nombre", nombre);
        query.setParameter("apellido", apellido);
        query.setParameter("telefono", telefono);

        query.setMaxResults(1); 
        
        List<Huesped> results = query.getResultList();
        
        if (results.isEmpty()) {
            return null;
        } else {
            return results.get(0);
        }

    }
    @Transactional
    public Huesped saveHuesped(Huesped huespedNuevo) {
    em.persist(huespedNuevo);
    return huespedNuevo;
}
    public Huesped buscarPorId(Long id) {
        return em.find(Huesped.class, id);
    }
    @Transactional
    public void eliminar(Huesped huesped) {
        em.remove(em.contains(huesped) ? huesped : em.merge(huesped));
    }
    @Transactional
    public void actualizar(Huesped huespedOriginal) {
        em.merge(huespedOriginal);
    }
}
