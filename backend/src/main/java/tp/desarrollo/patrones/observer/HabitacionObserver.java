package tp.desarrollo.patrones.observer;

import tp.desarrollo.model.EventoCambioEstadoHabitacion;

public interface HabitacionObserver {

    void actualizar(EventoCambioEstadoHabitacion evento);

    String getNombre();
}
