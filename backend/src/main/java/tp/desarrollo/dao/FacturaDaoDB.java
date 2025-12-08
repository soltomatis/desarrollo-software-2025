package tp.desarrollo.dao;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import tp.desarrollo.clases.Factura;

@Repository
public class FacturaDaoDB {

    @PersistenceContext
    private EntityManager em;

    public Factura save(Factura nuevaFactura) {
        em.persist(nuevaFactura);
        return nuevaFactura;
    }

    public Factura buscarPorId(Long facturaId) {
        return em.find(Factura.class, facturaId);
    }
}
