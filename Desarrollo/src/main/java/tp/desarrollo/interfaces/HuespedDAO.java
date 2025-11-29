/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package tp.desarrollo.interfaces;

import java.util.List;

import tp.desarrollo.clases.*;
import tp.desarrollo.dto.*;
import tp.desarrollo.enums.*;

/**
 *
 * @author juanc
 */
public interface HuespedDAO {
    void modificar_huesped(HuespedDTO huespedOriginal, HuespedDTO huespedModificado);
    List<Huesped> buscar_huespedes(HuespedDTO huesped);
    boolean existe_documento(TipoDocumento tipoDocumento, int numeroDocumento);
}
