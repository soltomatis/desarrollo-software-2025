/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package tp.desarrollo.dto;

import java.time.LocalDate;
import tp.desarrollo.clases.Direccion;
import tp.desarrollo.modelo.TipoDocumento;

/**
 *
 * @author juanc
 */
public class PersonaDTO {
    private String apellido;
    private String nombre;
    private TipoDocumento tipo_documento;
    private int num_documento;
    private int cuit;
    private LocalDate fecha_nacimiento;
    private Direccion direccion;
    private String nacionalidad;

    public PersonaDTO(String apellido, String nombre, TipoDocumento tipo_documento, String num_documento) {
        this.apellido = apellido;
        this.nombre = nombre;
        this.tipo_documento = tipo_documento;
        this.num_documento = Integer.parseInt(num_documento);
    }
    public PersonaDTO(String apellido, String nombre, TipoDocumento tipo_documento, int num_documento, int cuit, LocalDate fecha_nacimiento, Direccion direccion, String nacionalidad) {
        this.apellido = apellido;
        this.nombre = nombre;
        this.tipo_documento = tipo_documento;
        this.num_documento = num_documento;
        this.cuit = cuit;
        this.fecha_nacimiento = fecha_nacimiento;
        this.direccion = direccion;
        this.nacionalidad = nacionalidad;
    }
    public String getApellido() {
        return apellido;
    }
    public String getNombre() {
        return nombre;
    }
    public TipoDocumento getTipo_documento() {
        return tipo_documento;
    }
    public int getNum_documento() {
        return num_documento;
    }
}
