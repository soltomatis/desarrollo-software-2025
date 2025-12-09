package tp.desarrollo.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import tp.desarrollo.clases.*;
import tp.desarrollo.dto.HabitacionDTO;
import tp.desarrollo.dto.HuespedDTO;
import tp.desarrollo.dto.ReservaDTO;
import tp.desarrollo.dto.ReservaHabitacionDTO;
import tp.desarrollo.enums.Estado;
import tp.desarrollo.repository.HabitacionDaoDB;
import tp.desarrollo.repository.HuespedDaoDB;
import tp.desarrollo.repository.ReservaDaoDB;
import tp.desarrollo.repository.ReservaHabitacionDaoDB;

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

    public List<ReservaDTO> buscarReservas(String apellido, String nombre,
                                           Long numeroHabitacion, String tipoHabitacion,
                                           String fechaInicio, String fechaFin) {

        List<Reserva> reservasEncontradas = reservaDaoDB.buscarReservasPorCriterios(
                apellido, nombre, numeroHabitacion, tipoHabitacion, fechaInicio, fechaFin);

        List<ReservaDTO> reservasDTO = new ArrayList<>();
        for (Reserva reserva : reservasEncontradas) {
            ReservaDTO dto = convertirReservaADTO(reserva);
            reservasDTO.add(dto);
        }

        return reservasDTO;
    }

    @Transactional
    public List<Integer> cancelarReservas(List<Integer> idsReservas) throws Exception {
        List<Integer> reservasCanceladas = new ArrayList<>();

        for (Integer idReserva : idsReservas) {
            try {
                cancelarReserva(idReserva);
                reservasCanceladas.add(idReserva);
            } catch (Exception e) {
                System.err.println("Error al cancelar reserva " + idReserva + ": " + e.getMessage());
            }
        }

        if (reservasCanceladas.isEmpty()) {
            throw new Exception("No se pudo cancelar ninguna reserva");
        }

        return reservasCanceladas;
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

        System.out.println("Reserva " + idReserva + " cancelada exitosamente. Habitaciones liberadas.");
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

    private ReservaDTO convertirReservaADTO(Reserva reserva) {
        ReservaDTO dto = new ReservaDTO();

        dto.setId(reserva.getId());

        if (reserva.getHuespedPrincipal() != null) {
            HuespedDTO huespedDTO = new HuespedDTO(reserva.getHuespedPrincipal());
            dto.setHuespedPrincipal(huespedDTO);
        }

        if (reserva.getListaHabitacionesRerservadas() != null) {
            List<ReservaHabitacionDTO> habitacionesDTO = reserva.getListaHabitacionesRerservadas()
                    .stream()
                    .map(this::convertirReservaHabitacionADTO)
                    .collect(Collectors.toList());
            dto.setListaHabitacionesReservadas(habitacionesDTO);
        }

        return dto;
    }

    private ReservaHabitacionDTO convertirReservaHabitacionADTO(ReservaHabitacion reservaHab) {
        ReservaHabitacionDTO dto = new ReservaHabitacionDTO();
        dto.setFecha_inicio(reservaHab.getFecha_inicio());
        dto.setFecha_fin(reservaHab.getFecha_fin());

        if (reservaHab.getHabitacion() != null) {
            Habitacion hab = reservaHab.getHabitacion();
            HabitacionDTO habDTO = new HabitacionDTO(
                    hab.getNumeroHabitacion(),
                    hab.getTipo(),
                    hab.getCantidadHuespedes(),
                    hab.getCantidadCamaI(),
                    hab.getCantidadCamaD(),
                    hab.getCantidadCamaKS(),
                    null
            );
            dto.setHabitacion(habDTO);
        }

        return dto;
    }
}
