package tp.desarrollo.patrones.observer;

import tp.desarrollo.clases.EventoCambioEstadoHabitacion;

public interface HabitacionObserver {

    void actualizar(EventoCambioEstadoHabitacion evento);

    String getNombre();
}
