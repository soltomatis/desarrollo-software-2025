package tp.desarrollo.patrones.observer.Impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import tp.desarrollo.model.EventoCambioEstadoHabitacion;
import tp.desarrollo.patrones.observer.HabitacionObserver;

@Service
public class LogginObserver  implements HabitacionObserver {

    private static final Logger logger = LoggerFactory.getLogger(LogginObserver.class);

    @Override
    public void actualizar(EventoCambioEstadoHabitacion evento) {
        logger.info("CAMBIO_ESTADO - Hab: {}, {} -> {}, Motivo: {}",
                evento.getHabitacionId(),
                evento.getEstadoAnterior(),
                evento.getEstadoNuevo(),
                evento.getDescripcion()
        );
    }

    @Override
    public String getNombre() {
        return "LoggingObserver";
    }
}