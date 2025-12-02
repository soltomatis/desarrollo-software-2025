
package tp.desarrollo.dto;

import java.time.LocalDate;

import lombok.Data;
import lombok.NoArgsConstructor;
import tp.desarrollo.enums.TipoDocumento;

@NoArgsConstructor
@Data
public class PersonaDTO {
    private String apellido;
    private String nombre;
    private TipoDocumento tipo_documento;
    private long num_documento;
    private long cuit;
    private LocalDate fecha_nacimiento;
    private DireccionDTO direccion;
    private String nacionalidad;

    public PersonaDTO(String apellido, String nombre, TipoDocumento tipo_documento, String num_documento) {
        this.apellido = apellido;
        this.nombre = nombre;
        this.tipo_documento = tipo_documento;
        this.num_documento = Integer.parseInt(num_documento);
    }
    public PersonaDTO(String apellido, String nombre, TipoDocumento tipo_documento, long num_documento, long cuit, LocalDate fecha_nacimiento, DireccionDTO direccion, String nacionalidad) {
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
    public long getNum_documento() {
        return num_documento;
    }
    public long getCuit() {
        return this.cuit;
    }
    public LocalDate getFecha_nacimiento() {
        return fecha_nacimiento;
    }
    public DireccionDTO getDireccion() {
        return direccion;
    }
    public String getNacionalidad() {
        return nacionalidad;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public void setTipo_documento(TipoDocumento tipo_documento) {
        this.tipo_documento = tipo_documento;
    }
    public void setNum_documento(long num_documento) {
        this.num_documento = num_documento;
    }
    public void setCuit(long cuit) {
        this.cuit = cuit;
    }
    public void setFecha_nacimiento(LocalDate fecha) {
        this.fecha_nacimiento = fecha;
    }
    public void setDireccion(DireccionDTO direccion) {
        this.direccion = direccion;
    }
    public void setNacionalidad(String nacionalidad) {
        this.nacionalidad = nacionalidad;
    }
}
