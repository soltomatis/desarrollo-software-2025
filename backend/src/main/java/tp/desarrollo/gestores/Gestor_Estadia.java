package tp.desarrollo.gestores;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import tp.desarrollo.clases.Estadia;
import tp.desarrollo.clases.Habitacion;
import tp.desarrollo.dao.EstadiaDaoDB;
import tp.desarrollo.dao.HabitacionDaoDB;
@Service
public class Gestor_Estadia {
    @Autowired
    EstadiaDaoDB estadiaDaoDB;
    @Autowired
    HabitacionDaoDB habitacionDaoDB;
    public Estadia buscarEstadia(String numeroHabitacion, String horaMinutoSalida) {
    long numeroHabitacionLong = Long.parseLong(numeroHabitacion);
    LocalDate fechaHoy = LocalDate.now(); 
    LocalTime horaSalida = LocalTime.parse(horaMinutoSalida); 
    LocalDateTime checkOut = LocalDateTime.of(fechaHoy, horaSalida);

    Habitacion habitacion = habitacionDaoDB.buscarPorNumero(numeroHabitacionLong);
    
    if (habitacion == null) {
        throw new EntityNotFoundException("No se encontró la habitación con el número: " + numeroHabitacion);
    }
    Estadia estadiaActiva = estadiaDaoDB.buscarEstadiaActivaPorHabitacionId(habitacion.getNumeroHabitacion());
    
    if (estadiaActiva == null) {
        throw new EntityNotFoundException("No se encontró ninguna estadía activa en la habitación " + numeroHabitacion);
    }


    estadiaActiva.setFecha_check_out(checkOut);

    estadiaDaoDB.actualizar(estadiaActiva); 
    
    return estadiaActiva;
}
    
}
