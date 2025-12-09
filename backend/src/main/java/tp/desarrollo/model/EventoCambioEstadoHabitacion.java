package tp.desarrollo.model;

import lombok.Getter;
import lombok.Setter;
import tp.desarrollo.enums.Estado;

import java.time.LocalDateTime;

@Getter
@Setter
public class EventoCambioEstadoHabitacion {

    private Long habitacionId;

    private Estado estadoAnterior;

    private Estado estadoNuevo;

    private LocalDateTime timestamp;

    private String descripcion;

    private String usuario;

    public EventoCambioEstadoHabitacion(
            Long habitacionId,
            Estado anterior,
            Estado nuevo,
            String descripcion) {

        this.habitacionId = habitacionId;
        this.estadoAnterior = anterior;
        this.estadoNuevo = nuevo;
        this.timestamp = LocalDateTime.now();
        this.descripcion = descripcion;
    }

}
