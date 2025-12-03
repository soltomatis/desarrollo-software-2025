package tp.desarrollo.gestores;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tp.desarrollo.clases.*;
import tp.desarrollo.dao.HabitacionDaoDB;
import tp.desarrollo.dao.HuespedDaoDB;
import tp.desarrollo.dao.ReservaDaoDB;
import tp.desarrollo.dao.ReservaHabitacionDaoDB;
import tp.desarrollo.dto.HuespedDTO;
import tp.desarrollo.dto.ReservaDTO;
import tp.desarrollo.dto.ReservaHabitacionDTO;
import tp.desarrollo.enums.Estado;

@Service
public class Gestor_Reserva {

    @Autowired
    ReservaDaoDB reservaDao;

    @Autowired
    HuespedDaoDB huespedDaoDB;

    @Autowired
    ReservaDaoDB reservaDaoDB;

    @Autowired
    HabitacionDaoDB habitacionDaoDB;

    @Autowired
    Gestor_Habitacion gestorHabitacion;

    @Autowired
    ReservaHabitacionDaoDB reservaHabitacionDaoDB;

    @Transactional
    public Long confirmarReserva(ReservaDTO reservaDTO) throws Exception {

        HuespedDTO huespedDTO = reservaDTO.getHuespedPrincipal();
        Huesped huespedPrincipal;
        Huesped huespedExistente = huespedDaoDB.buscarHuespedPorDatos(
            huespedDTO.getNombre(),
            huespedDTO.getApellido(),
            huespedDTO.getTelefono()
        );

        if (huespedExistente != null) {
            huespedPrincipal = huespedExistente;
            System.out.println("DEBUG: Huésped encontrado y reutilizado: ID " + huespedPrincipal.getId());
        } else {
            System.out.println("DEBUG: Huésped no encontrado. Creando nuevo huésped.");
            Direccion direccion = new Direccion();
            Huesped huespedNuevo = new Huesped();

            huespedNuevo.setNombre(huespedDTO.getNombre());
            huespedNuevo.setApellido(huespedDTO.getApellido());
            huespedNuevo.setTelefono(huespedDTO.getTelefono());
            huespedNuevo.setNum_documento(0);
            huespedNuevo.setEmail(huespedDTO.getEmail());
            huespedNuevo.setFecha_nacimiento(huespedDTO.getFecha_nacimiento());
            huespedNuevo.setDireccion(direccion); 
            huespedNuevo.setOcupacion(huespedDTO.getOcupacion());
            huespedNuevo.setNacionalidad(huespedDTO.getNacionalidad());
            huespedNuevo.setCondicionIVA(huespedDTO.getCondicionIVA());
            huespedNuevo.setTipoDocumento(huespedDTO.getTipo_documento());
            huespedNuevo.setCUIT(0);

            huespedPrincipal = huespedDaoDB.saveHuesped(huespedNuevo);
        }
        Reserva reservaPrincipal = new Reserva();

        reservaPrincipal.setHuespedPrincipal(huespedPrincipal);
        List<ReservaHabitacionDTO> ReservasHabitacionesDTO = reservaDTO.getListaHabitacionesReservadas();
        Reserva reservaPersistida = reservaDaoDB.guardarReserva(reservaPrincipal);

        for (ReservaHabitacionDTO itemDTO : ReservasHabitacionesDTO) {
            ReservaHabitacion item = new ReservaHabitacion(); 
            
            item.setReserva(reservaPersistida);
            item.setFecha_inicio(itemDTO.getFecha_inicio());
            item.setFecha_fin(itemDTO.getFecha_fin());

            Long idHabitacion = itemDTO.getHabitacion().getNumeroHabitacion();
            
            Habitacion habitacion = habitacionDaoDB.buscarId(idHabitacion);
            
            item.setHabitacion(habitacion);
            
            gestorHabitacion.crearEstadoHabitacion(
            habitacion, 
            item.getFecha_inicio(),
            item.getFecha_fin()
            );

            reservaHabitacionDaoDB.save(item);
        }
        return Long.valueOf(reservaPersistida.getId());
    }

    @Transactional
    public void cancelarReserva(int idReserva) throws Exception {

        Reserva reserva = reservaDaoDB.buscarReservaPorId(idReserva);

        if (reserva == null) {
            throw new Exception("No se encontró la reserva con ID: " + idReserva);
        }

        List<ReservaHabitacion> habitacionesReservadas = reserva.getListaHabitacionesRerservadas();

        if (habitacionesReservadas != null && !habitacionesReservadas.isEmpty()) {
            for (ReservaHabitacion reservaHab : habitacionesReservadas) {
                Habitacion habitacion = reservaHab.getHabitacion();
                LocalDate fechaInicio = reservaHab.getFecha_inicio();
                LocalDate fechaFin = reservaHab.getFecha_fin();

                eliminarEstadoReservada(habitacion, fechaInicio, fechaFin);
            }
        }

        reservaDaoDB.eliminarReserva(reserva);
    }

    private void eliminarEstadoReservada(Habitacion habitacion, LocalDate fechaInicio, LocalDate fechaFin) {
        List<EstadoHabitacion> historiaEstados = habitacion.getHistoriaEstados();

        if (historiaEstados != null) {
            historiaEstados.removeIf(estado ->
                    estado.getEstado() == Estado.RESERVADA &&
                            estado.getFechaInicio().equals(fechaInicio) &&
                            estado.getFechaFin().equals(fechaFin)
            );

            habitacionDaoDB.actualizarHabitacion(habitacion);
        }
    }
}
