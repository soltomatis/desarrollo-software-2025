package tp.desarrollo.gestores;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import tp.desarrollo.clases.EstadoHabitacion;
import tp.desarrollo.clases.Habitacion;
import tp.desarrollo.dao.HabitacionDaoDB;
import tp.desarrollo.dto.EstadoHabitacionDTO;
import tp.desarrollo.dto.HabitacionDTO;

@Service
public class Gestor_Habitacion {
    private final HabitacionDaoDB habitacionDAO;

    public Gestor_Habitacion(HabitacionDaoDB habitacionDAO) {
        this.habitacionDAO = habitacionDAO;
    }
    public List<HabitacionDTO> mostrarEstadoHabitaciones(LocalDate fechaDesde, LocalDate fechaHasta) {
        List<Habitacion> habitaciones = habitacionDAO.listarHabitaciones();
        List<HabitacionDTO> habitacionesDTO = new ArrayList<>();

        for (Habitacion habitacion : habitaciones) {
            List<EstadoHabitacion> estadosSolapados = habitacion.getHistoriaEstados().stream()
                .filter(estado -> {
                    boolean solapamiento = estado.getFechaInicio().isBefore(fechaHasta) && 
                                           estado.getFechaFin().isAfter(fechaDesde);
                    return solapamiento;
                })
                .collect(Collectors.toList());
            
            List<EstadoHabitacionDTO> historiaEstadosDTO = estadosSolapados.stream()
                .map(estadoHabitacion -> new EstadoHabitacionDTO(
                    estadoHabitacion.getEstado(),
                    estadoHabitacion.getFechaInicio(),
                    estadoHabitacion.getFechaFin()
                ))
                .collect(Collectors.toList());

            HabitacionDTO habitacionDTO = new HabitacionDTO(
                habitacion.getNumeroHabitacion(),
                habitacion.getTipo(),
                habitacion.getCantidadHuespedes(),
                habitacion.getCantidadCamaI(),
                habitacion.getCantidadCamaD(),
                habitacion.getCantidadCamaKS(),
                historiaEstadosDTO
            );
            habitacionesDTO.add(habitacionDTO);
        }

        return habitacionesDTO;
    }
}
