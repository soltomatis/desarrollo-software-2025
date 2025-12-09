package tp.desarrollo.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import tp.desarrollo.model.Estadia;
import tp.desarrollo.model.Habitacion;
import tp.desarrollo.repository.EstadiaDaoDB;
import tp.desarrollo.repository.HabitacionDaoDB;
@Service
public class Gestor_Estadia {
    @Autowired
    EstadiaDaoDB estadiaDaoDB;
    @Autowired
    HabitacionDaoDB habitacionDaoDB;
    public Estadia buscarEstadia(String numeroHabitacion) {

        long numeroHabitacionLong = Long.parseLong(numeroHabitacion);
        
        Habitacion habitacion = habitacionDaoDB.buscarPorNumero(numeroHabitacionLong);
        
        if (habitacion == null) {
            throw new EntityNotFoundException("No se encontró la habitación con el número: " + numeroHabitacion);
        }
        System.out.println("Habitación encontrada: " + habitacion.getNumeroHabitacion());
        
        Estadia estadiaActiva = estadiaDaoDB.buscarEstadiaActivaPorHabitacionId(habitacion.getNumeroHabitacion()); 
        
        if (estadiaActiva == null) {
            throw new EntityNotFoundException("No se encontró ninguna estadía activa en la habitación " + numeroHabitacion);
        }

        return estadiaActiva;
    }
    
    @Transactional
    public Estadia actualizarCheckOut(Long estadiaId, String horaMinutoSalida) throws EntityNotFoundException, IllegalArgumentException {

        Estadia estadia = estadiaDaoDB.findById(estadiaId);
        if (estadia == null) {
            throw new EntityNotFoundException("Estadía no encontrada con ID: " + estadiaId);
        }

        LocalDate fechaSalida = LocalDate.now();

        LocalTime horaSalida;
        try {

            horaSalida = LocalTime.parse(horaMinutoSalida); 
        } catch (Exception e) {
            throw new IllegalArgumentException("Formato de hora de salida incorrecto. Se espera HH:mm.");
        }

        LocalDateTime fechaHoraSalida = LocalDateTime.of(fechaSalida, horaSalida);

        estadia.setFecha_check_out(fechaHoraSalida);
        estadiaDaoDB.actualizar(estadia);
        return estadia;
    }
    
}
