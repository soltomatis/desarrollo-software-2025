/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package tp.desarrollo.clases;


/**
 *
 * @author Cesar
 */
public class Direccion {
    String calle;
    int numero;
    String departamento;
    int piso;
    int codigo_postal;
    String localidad;
    String provincia;
    String pais;

    public Direccion(String calle, int numero, String departamento, int piso, int codigo_postal, String localidad, String provincia, String pais) {
        this.calle = calle;
        this.numero = numero;
        this.departamento = departamento;
        this.piso = piso;
        this.codigo_postal = codigo_postal;
        this.localidad = localidad;
        this.provincia = provincia;
        this.pais = pais;
    }
    
   
}
