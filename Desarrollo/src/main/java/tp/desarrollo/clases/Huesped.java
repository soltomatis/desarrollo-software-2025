/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package tp.desarrollo.clases;

import java.time.LocalDate;

/**
 *
 * @author Cesar
 */
public class Huesped extends Persona{
    String telefono;
    String email;
    String ocupacion;

    public Huesped(String telefono, String email, String ocupacion, String apellido, String nombre, String tipo_documento, int num_documento, int cuit, LocalDate fecha_nacimiento, Direccion direccion, String nacionalidad) {
        super(apellido, nombre, tipo_documento, num_documento, cuit, fecha_nacimiento, direccion, nacionalidad);
        this.telefono = telefono;
        this.email = email;
        this.ocupacion = ocupacion;
    }

    @Override
    public String toString() {
        return apellido + ", " + nombre;
    }
    
    
}
