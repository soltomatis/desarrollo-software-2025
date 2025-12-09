package tp.desarrollo.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import tp.desarrollo.model.Consumo;
import tp.desarrollo.interfaces.ConsumoDAO;

@Repository
public class ConsumoDaoDB implements ConsumoDAO{
    @PersistenceContext
    private EntityManager em;

    public List<Consumo> findByIds(List<Long> idsConsumosSeleccionados) {
        return em.createQuery("SELECT c FROM Consumo c WHERE c.id IN :ids", Consumo.class)
                 .setParameter("ids", idsConsumosSeleccionados)
                 .getResultList();
    }


    public void actualizar(Consumo consumo) {
        em.merge(consumo);  
    }

    @Transactional
    public Consumo save(Consumo alojamiento) {
        em.persist(alojamiento);
        return alojamiento;
    }


    public Consumo findByEstadiaIdAndTipo(Long id, String string) {
        List<Consumo> resultados = em.createQuery("SELECT c FROM Consumo c WHERE c.estadia.id = :estadiaId AND c.tipo = :tipo", Consumo.class)
                                    .setParameter("estadiaId", id)
                                    .setParameter("tipo", string)
                                    .getResultList();
        return resultados.isEmpty() ? null : resultados.get(0);
    }
    
}
