/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package tp.desarrollo.dto;

import java.time.LocalDate;

import lombok.*;
import tp.desarrollo.model.Huesped;
import tp.desarrollo.enums.CondicionIVA;
import tp.desarrollo.enums.TipoDocumento;

@NoArgsConstructor
@Setter
@Getter
public class HuespedDTO extends PersonaDTO{

    private Long id;

    private String telefono;

    private String email;

    private String ocupacion;

    private CondicionIVA condicionIVA;
    
    //Constructores
    public HuespedDTO(String nombre, String apellido, TipoDocumento tipoDocumento, String numeroDocumento) {
        super(apellido, nombre, tipoDocumento, numeroDocumento);
    }
    public HuespedDTO(String telefono, String email, String ocupacion, String apellido, String nombre, TipoDocumento tipo_documento, int num_documento, long cuit, LocalDate fecha_nacimiento, DireccionDTO direccion, String nacionalidad) {
        super(apellido, nombre, tipo_documento, num_documento, cuit, fecha_nacimiento, direccion, nacionalidad);
        this.telefono = telefono;
        this.email = email;
        this.ocupacion = ocupacion;
    }
    public HuespedDTO(Huesped huesped){
        super(
            huesped.getApellido(),
            huesped.getNombre(),
            huesped.getTipoDocumento(),
            huesped.getNumDocumento(),
            huesped.getCUIT(),
            huesped.getFechaNacimiento(),
            new DireccionDTO(
                huesped.getDIRECCION().getCalle(),
                huesped.getDIRECCION().getNumero(),
                huesped.getDIRECCION().getDepartamento(),
                huesped.getDIRECCION().getPiso(),
                huesped.getDIRECCION().getCodigoPostal(),
                huesped.getDIRECCION().getLocalidad(),
                huesped.getDIRECCION().getProvincia(),
                huesped.getDIRECCION().getPais()
            ),
            huesped.getNacionalidad()
        );
        this.telefono = huesped.getTelefono();
        this.email = huesped.getEmail();
        this.ocupacion = huesped.getOcupacion();
    }


    public HuespedDTO(String apellido, String nombre, TipoDocumento tipo_documento, long num_documento, long cuit,
            LocalDate fecha_nacimiento, DireccionDTO direccionDTO, String nacionalidad) {
        //TODO Auto-generated constructor stub
    }
}
