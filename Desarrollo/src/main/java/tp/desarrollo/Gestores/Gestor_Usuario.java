/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package tp.desarrollo.Gestores;

import java.util.List;

import tp.desarrollo.clases.*;
import tp.desarrollo.dao.HuespedDaoArchivos;
import tp.desarrollo.dto.*;
import tp.desarrollo.modelo.TipoDocumento;

/**
 *
 * @author juanc
 */
public class Gestor_Usuario{
    private HuespedDaoArchivos huespedDao;

    public Gestor_Usuario(HuespedDaoArchivos dao) {
        this.huespedDao = dao;
    }

    public void modificar_huesped(HuespedDTO huesped){
        
    }

    public void buscar_huespedes(String nombre, String apellido, TipoDocumento tipoDocumento, String numeroDocumento){
        if(nombre == null){
            nombre = "";
        }
        if(apellido == null){
            apellido = "";
        }
        if(numeroDocumento == null){
            numeroDocumento = "-1";
        }
        HuespedDTO huespedBusqueda = new HuespedDTO(nombre, apellido, tipoDocumento, numeroDocumento);
        List<Huesped> h = huespedDao.buscar_huespedes(huespedBusqueda);
        System.out.println("Huéspedes encontrados: " + h.size());
        for (Huesped huésped : h) {     
            System.out.println("Nombre: " + huésped.getNombre() + ", Apellido: " + huésped.getApellido());
        }
    }
    
}
