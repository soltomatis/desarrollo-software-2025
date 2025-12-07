package tp.desarrollo.dao;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import tp.desarrollo.clases.Responsable_de_pago;

@Repository
public class ResponsableDaoDB {
    @PersistenceContext
    private EntityManager entityManager;

    public Responsable_de_pago save(Responsable_de_pago responsable) {
        entityManager.persist(responsable);
        return responsable;
    }

    public Responsable_de_pago findByFullIdentity(String razonSocialCalculada) {
        String queryStr = "SELECT r FROM Responsable_de_pago r WHERE r.razonSocial = :razonSocial";
        return entityManager.createQuery(queryStr, Responsable_de_pago.class)
                .setParameter("razonSocial", razonSocialCalculada)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }
    public Responsable_de_pago findByCuit(String cuit) {
        return entityManager.createQuery("SELECT r FROM Responsable_de_pago r WHERE r.cuit = :cuit", Responsable_de_pago.class)
                 .setParameter("cuit", cuit)
                 .getSingleResult();
    }

    public Responsable_de_pago findById(Long id) {
        return entityManager.find(Responsable_de_pago.class, id);
    }

}
