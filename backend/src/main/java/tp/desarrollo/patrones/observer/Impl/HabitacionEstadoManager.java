package tp.desarrollo.patrones.observer.Impl;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tp.desarrollo.model.EstadoHabitacion;
import tp.desarrollo.model.EventoCambioEstadoHabitacion;
import tp.desarrollo.model.Habitacion;
import tp.desarrollo.enums.Estado;
import tp.desarrollo.patrones.observer.HabitacionObserver;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class HabitacionEstadoManager {

    private List<HabitacionObserver> observers = new ArrayList<>();
    private static final Logger logger = LoggerFactory.getLogger(HabitacionEstadoManager.class);

    public void attach(HabitacionObserver observer) {
        if (!observers.contains(observer)) {
            observers.add(observer);
            logger.info("Observer registrado: {}", observer.getNombre());
        }
    }

    public void detach(HabitacionObserver observer) {
        observers.remove(observer);
        logger.info("Observer removido: {}", observer.getNombre());
    }

    private void notifyObservers(EventoCambioEstadoHabitacion evento) {
        for (HabitacionObserver observer : observers) {
            observer.actualizar(evento);
        }
    }

    private Estado obtenerEstadoActual(Habitacion habitacion) {
        if (habitacion.getHistoriaEstados() == null ||
                habitacion.getHistoriaEstados().isEmpty()) {
            return Estado.LIBRE;
        }

        int lastIndex = habitacion.getHistoriaEstados().size() - 1;
        return habitacion.getHistoriaEstados()
                .get(lastIndex)
                .getEstado();
    }

    @Transactional
    public void cambiarEstado(
            Habitacion habitacion,
            Estado nuevoEstado,
            String descripcion) {

        Estado estadoAnterior = obtenerEstadoActual(habitacion);

        if (estadoAnterior != nuevoEstado) {

            EstadoHabitacion nuevoRegistroEstado = new EstadoHabitacion();
            nuevoRegistroEstado.setEstado(nuevoEstado);
            nuevoRegistroEstado.setFechaInicio(LocalDate.now());

            if (habitacion.getHistoriaEstados() == null) {
                habitacion.setHistoriaEstados(new ArrayList<>());
            }

            habitacion.getHistoriaEstados().add(nuevoRegistroEstado);

            EventoCambioEstadoHabitacion evento =
                    new EventoCambioEstadoHabitacion(
                            habitacion.getNumeroHabitacion(),
                            estadoAnterior,
                            nuevoEstado,
                            descripcion
                    );

            try {
                String usuario = SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getName();
                evento.setUsuario(usuario);
            } catch (Exception e) {
                evento.setUsuario("SISTEMA");
            }

            notifyObservers(evento);
        }
    }

    public int getObserverCount() {
        return observers.size();
    }
}