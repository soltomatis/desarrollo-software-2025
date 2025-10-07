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
public class Persona {
    String apellido;
    String nombre;
    String tipo_documento;
    int num_documento;
    int cuit;
    LocalDate fecha_nacimiento;
    Direccion direccion;
    String nacionalidad;

    public Persona(String apellido, String nombre, String tipo_documento, int num_documento, int cuit, LocalDate fecha_nacimiento, Direccion direccion, String nacionalidad) {
        this.apellido = apellido;
        this.nombre = nombre;
        this.tipo_documento = tipo_documento;
        this.num_documento = num_documento;
        this.cuit = cuit;
        this.fecha_nacimiento = fecha_nacimiento;
        this.direccion = direccion;
        this.nacionalidad = nacionalidad;
    }
   
    
}
