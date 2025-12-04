package tp.desarrollo.gestores;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.stereotype.Service;

import tp.desarrollo.clases.EstadoHabitacion;
import tp.desarrollo.clases.Habitacion;
import tp.desarrollo.dao.HabitacionDaoDB;
import tp.desarrollo.dto.EstadoHabitacionDTO;
import tp.desarrollo.dto.HabitacionDTO;
import tp.desarrollo.enums.Estado;

@Service
public class Gestor_Habitacion {
    @Autowired
    HabitacionDaoDB habitacionDAO;

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
    public void crearEstadoHabitacion(Habitacion habitacion, LocalDate fecha_inicio, LocalDate fecha_fin) {
        EstadoHabitacion nuevoEstado = new EstadoHabitacion();
        nuevoEstado.setEstado(Estado.RESERVADA); 
        nuevoEstado.setFechaInicio(fecha_inicio);
        nuevoEstado.setFechaFin(fecha_fin);

        List<EstadoHabitacion> historiaEstados = habitacion.getHistoriaEstados();
        if (historiaEstados == null) {
            historiaEstados = new ArrayList<>();
            habitacion.setHistoriaEstados(historiaEstados);
        }
        historiaEstados.add(nuevoEstado);

        habitacionDAO.actualizarHabitacion(habitacion);
    }
    public void eliminarEstadoHabitacion(Long numeroHabitacion, LocalDate fecha_inicio, LocalDate fecha_fin) {
        Habitacion habitacion = habitacionDAO.buscarPorNumero(numeroHabitacion);
        if (habitacion != null) {
            List<EstadoHabitacion> historiaEstados = habitacion.getHistoriaEstados();
            if (historiaEstados != null) {
                historiaEstados.removeIf(estado -> 
                    estado.getFechaInicio().equals(fecha_inicio) && 
                    estado.getFechaFin().equals(fecha_fin) && 
                    estado.getEstado() == Estado.RESERVADA
                );
                habitacionDAO.actualizarHabitacion(habitacion);
            }
        }
    }
}
