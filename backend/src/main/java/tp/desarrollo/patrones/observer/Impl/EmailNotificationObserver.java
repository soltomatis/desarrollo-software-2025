package tp.desarrollo.patrones.observer.Impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import tp.desarrollo.clases.EventoCambioEstadoHabitacion;
import tp.desarrollo.enums.Estado;
import tp.desarrollo.patrones.observer.HabitacionObserver;

public class EmailNotificationObserver implements HabitacionObserver {

    private static final Logger logger = LoggerFactory.getLogger(EmailNotificationObserver.class);

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void actualizar(EventoCambioEstadoHabitacion evento) {

        if (evento.getEstadoNuevo() == Estado.OCUPADA ||
                evento.getEstadoNuevo() == Estado.FUERA_DE_SERVICIO) {

            String asunto = "Cambio de estado Habitación " + evento.getHabitacionId();
            String cuerpo = String.format(
                    "Habitación %d cambió de %s a %s\nMotivo: %s",
                    evento.getHabitacionId(),
                    evento.getEstadoAnterior(),
                    evento.getEstadoNuevo(),
                    evento.getDescripcion()
            );

            logger.info("Email enviado: {} - {}", asunto, cuerpo);
        }
    }

    @Override
    public String getNombre() {
        return "EmailNotificationObserver";
    }
}
