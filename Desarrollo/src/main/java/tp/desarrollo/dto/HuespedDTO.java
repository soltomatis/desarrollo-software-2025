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
public class HuespedDTO extends PersonaDTO{
    
    private String telefono;
    private String email;
    private String ocupacion;
    public HuespedDTO(String nombre, String apellido, TipoDocumento tipoDocumento, String numeroDocumento) {
        super(apellido, nombre, tipoDocumento, numeroDocumento);
    }
    public HuespedDTO(String telefono, String email, String ocupacion, String apellido, String nombre, TipoDocumento tipo_documento, int num_documento, int cuit, LocalDate fecha_nacimiento, Direccion direccion, String nacionalidad) {
        super(apellido, nombre, tipo_documento, num_documento, cuit, fecha_nacimiento, direccion, nacionalidad);
        this.telefono = telefono;
        this.email = email;
        this.ocupacion = ocupacion;
    }
    
    //GETTERS
    public String getTelefono(){
        return  this.telefono;
    }
    public String getEmail(){
        return  this.email;
    }
    public String getOcupacion(){
        return  this.ocupacion;
    }
    public String getNombre(){
        return  super.getNombre();
    }
    public String getApellido(){
        return  super.getApellido();
    }
    public TipoDocumento getTipoDocumento(){
        return  super.getTipo_documento();
    }
    public Integer getNumeroDocumento(){
        return  super.getNum_documento();
    }
    public LocalDate getFecha_nacimiento(){
        return  super.getFecha_nacimiento();
    }
    public Direccion getDireccion(){
        return  super.getDireccion();
    }
    public String getNacionalidad(){
        return  super.getNacionalidad();
    }
    public int getCuit(){
        return  super.getCuit();
    }
    
    //SETTERS
    public void setTelefono(String telefono){
        this.telefono = telefono;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public void setOcupacion(String ocupacion){
        this.ocupacion = ocupacion;
    }
    public void setNombre(String nombre){
        super.setNombre(nombre);
    }
    public void setApellido(String apellido){
        super.setApellido(apellido);
    }
    public void setTipoDocumento(TipoDocumento tipoDocumento){
        super.setTipo_documento(tipoDocumento);
    }
    public void setNumeroDocumento(Integer numeroDocumento){
        super.setNum_documento(numeroDocumento);
    }

}
