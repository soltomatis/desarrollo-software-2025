/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package tp.desarrollo.interfaces;

import java.util.List;

import tp.desarrollo.clases.*;
import tp.desarrollo.dto.*;

/**
 *
 * @author juanc
 */
public interface HuespedDAO {
    void modificar_huesped(HuespedDTO huesped);
    List<Huesped> buscar_huespedes(HuespedDTO huesped);
}
