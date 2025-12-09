/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package tp.desarrollo.interfaces;

import tp.desarrollo.model.Reserva;

/**
 *
 * @author juanc
 */
public interface ReservaDAO {

    Reserva guardarReserva(Reserva reserva);
    Reserva buscarReservaPorId(int id);
    void eliminarReserva(Reserva reserva);
}
