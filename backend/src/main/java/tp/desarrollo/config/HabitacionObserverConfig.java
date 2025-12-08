package tp.desarrollo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tp.desarrollo.patrones.observer.Impl.AuditoriaObserver;
import tp.desarrollo.patrones.observer.Impl.EmailNotificationObserver;
import tp.desarrollo.patrones.observer.Impl.HabitacionEstadoManager;
import tp.desarrollo.patrones.observer.Impl.LogginObserver;

@Configuration
public class HabitacionObserverConfig {

    @Bean
    public HabitacionEstadoManager habitacionEstadoManager(
            AuditoriaObserver auditoriaObserver,
            LogginObserver loggingObserver,
            @Autowired(required = false) EmailNotificationObserver emailObserver
    ) {

        HabitacionEstadoManager manager = new HabitacionEstadoManager();

        System.out.println("REGISTRANDO OBSERVADORES:");

        manager.attach(auditoriaObserver);
        System.out.println("Auditoría");

        manager.attach(loggingObserver);
        System.out.println("Logging");

        if (emailObserver != null) {
            manager.attach(emailObserver);
            System.out.println("Email Notifications");
        } else {
            System.out.println("Email Notifications (no disponible)");
        }

        System.out.println("Total observadores: " + manager.getObserverCount() + "\n");

        return manager;
    }
}