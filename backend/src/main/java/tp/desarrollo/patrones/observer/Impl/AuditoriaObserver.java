package tp.desarrollo.patrones.observer.Impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import tp.desarrollo.clases.EventoCambioEstadoHabitacion;
import tp.desarrollo.patrones.observer.HabitacionObserver;

@Service
public class AuditoriaObserver implements HabitacionObserver {

    private static final Logger logger = LoggerFactory.getLogger(AuditoriaObserver.class);

    @Override
    public void actualizar(EventoCambioEstadoHabitacion evento) {
        try {
            // SIMULACIÓN: En producción, guardaría en BD
            System.out.println(" AUDITORÍA REGISTRADA:");
            System.out.println("   Habitación: #" + evento.getHabitacionId());
            System.out.println("   Transición: " + evento.getEstadoAnterior() + " → " + evento.getEstadoNuevo());
            System.out.println("   Motivo: " + evento.getDescripcion());
            System.out.println("   Fecha/Hora: " + evento.getTimestamp());
            System.out.println("   Usuario: " + evento.getUsuario());
            System.out.println();

            logger.info("AUDITORIA: Hab {} cambió de {} a {}",
                    evento.getHabitacionId(),
                    evento.getEstadoAnterior(),
                    evento.getEstadoNuevo());

        } catch (Exception e) {
            logger.error("Error al registrar auditoría", e);
        }
    }

    @Override
    public String getNombre() {
        return "AuditoriaObserver";
    }
}