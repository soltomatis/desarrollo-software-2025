/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package tp.desarrollo.Gestores;

import java.time.LocalDate;
import java.util.List;
import java.util.Scanner;

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
    private HuespedDTO ingresar_datos_huesped(){
        String apellido;
        String nombre;
        TipoDocumento tipoDocumento;
        String numeroDocumento;
        int cuit = -1;
        LocalDate fechaNacimiento;
        String calle;
        int numero;
        String departamento = "";
        int piso = 0;
        int codigoPostal;
        String localidad ;
        String provincia;
        String pais;
        String telefono;
        String email = "";
        String ocupacion ;
        String nacionalidad;
        //ingreso de datos por consola y validacion basica
        Scanner scanner = new Scanner(System.in);
        System.out.println("Ingrese el apellido del huésped:");

        apellido = scanner.nextLine();
        while (apellido.isBlank()) {
        System.out.print("Apellido no puede estar vacío. Ingrese apellido: ");
        apellido = scanner.nextLine();
        }

        System.out.println("Ingrese el nombre del huésped:");
        nombre = scanner.nextLine();
        while (nombre.isBlank()) {
        System.out.print("Nombre no puede estar vacío. Ingrese nombre: ");
        nombre = scanner.nextLine();
        }

        System.out.println("Ingrese el tipo de documento del huésped (DNI, LE, LC, PASAPORTE, OTRO):");
        while(true) {
            String tipoDocInput = scanner.nextLine().toUpperCase();
            try {
                tipoDocumento = TipoDocumento.valueOf(tipoDocInput);
                break; // Salir del bucle si la conversión es exitosa
            } catch (IllegalArgumentException e) {
                System.out.print("Tipo de documento inválido. Ingrese un tipo válido (DNI, LE, LC, PASAPORTE, OTRO): ");
            }
        }

        System.out.println("Ingrese el número de documento del huésped:");
        numeroDocumento = scanner.nextLine();
        while(numeroDocumento.isBlank()) {
        System.out.print("Número de documento no puede estar vacío. Ingrese número de documento: ");
        numeroDocumento = scanner.nextLine();
        }

        System.out.println("Ingrese el CUIT del huésped (opcional):");
        String cuitInput = scanner.nextLine();
        if (!cuitInput.isBlank()) {
            cuit = Integer.parseInt(cuitInput);
        }

        System.out.println("Ingrese la fecha de nacimiento del huésped (YYYY-MM-DD):");
        while(true) {
            String fechaInput = scanner.nextLine();
            try {
                fechaNacimiento = LocalDate.parse(fechaInput);
                if (fechaNacimiento.isAfter(LocalDate.now()) || fechaNacimiento.toString().isBlank()) {
                    System.out.print("Fecha de nacimiento inválida. Ingrese una fecha válida (YYYY-MM-DD): ");
                } else {
                    break; // Salir del bucle si la fecha es válida
                }
            } catch (Exception e) {
                System.out.print("Formato inválido. Ingrese la fecha de nacimiento en formato YYYY-MM-DD: ");
            }
        }
        System.out.println("Ingrese la calle del huésped:");
        calle = scanner.nextLine();
        while (calle.isBlank()) {
        System.out.print("Calle no puede estar vacío. Ingrese calle: ");
        calle = scanner.nextLine();
        }

        System.out.println("Ingrese el número de la calle del huésped:");
        String numeroInput = scanner.nextLine();
        while(true) {
            try {
                numero = Integer.parseInt(numeroInput);
                if (numero <= 0) {
                    System.out.print("Número inválido. Ingrese un número de calle válido: ");
                    numeroInput = scanner.nextLine();
                } else {
                    break; // Salir del bucle si el número es válido
                }
            } catch (NumberFormatException e) {
                System.out.print("Entrada inválida. Ingrese un número de calle válido: ");
                numeroInput = scanner.nextLine();
            }
        }
        
        System.out.println("Ingrese el departamento del huésped (opcional):");
        departamento = scanner.nextLine();

        System.out.println("Ingrese el piso del huésped (opcional):");
        String pisoInput = scanner.nextLine();
        if (!pisoInput.isBlank()) {
            piso = Integer.parseInt(pisoInput);
        }

        System.out.println("Ingrese el código postal del huésped:");
        String codigoPostalInput = scanner.nextLine();
        while(true) {
            try {
                codigoPostal = Integer.parseInt(codigoPostalInput);
                if (codigoPostal <= 0 || Integer.toString(codigoPostal).isBlank()) {
                    System.out.print("Código postal inválido. Ingrese un código postal válido: ");
                    codigoPostalInput = scanner.nextLine();
                } else {
                    break; // Salir del bucle si el código postal es válido
                }
            } catch (NumberFormatException e) {
                System.out.print("Entrada inválida. Ingrese un código postal válido: ");
                codigoPostalInput = scanner.nextLine();
            }
        }
        System.out.println("Ingrese la localidad del huésped:");
        localidad = scanner.nextLine();
        while (localidad.isBlank()) {
        System.out.print("Localidad no puede estar vacío. Ingrese localidad: ");    
        localidad = scanner.nextLine();
        }
        System.out.println("Ingrese la provincia del huésped:");
        provincia = scanner.nextLine();
        while(provincia.isBlank()) {
        System.out.print("Provincia no puede estar vacío. Ingrese provincia: ");
        provincia = scanner.nextLine();
        }

        System.out.println("Ingrese el país del huésped:");
        pais = scanner.nextLine();
        while(pais.isBlank()) {
        System.out.print("País no puede estar vacío. Ingrese país: ");
        pais = scanner.nextLine();
        }

        System.out.println("Ingrese el teléfono del huésped:");
        telefono = scanner.nextLine();
        while(telefono.isBlank()) {
        System.out.print("Teléfono no puede estar vacío. Ingrese teléfono: ");
        telefono = scanner.nextLine();
        }

        System.out.println("Ingrese el email del huésped (opcional):");
        email = scanner.nextLine();

        System.out.println("Ingrese la ocupación del huésped:");
        ocupacion = scanner.nextLine();
        while(ocupacion.isBlank()) {
        System.out.print("Ocupación no puede estar vacío. Ingrese ocupación: ");
        ocupacion = scanner.nextLine();
        }

        System.out.println("Ingrese la nacionalidad del huésped:");
        nacionalidad = scanner.nextLine();
        while(nacionalidad.isBlank()) {
        System.out.print("Nacionalidad no puede estar vacío. Ingrese nacionalidad: ");
        nacionalidad = scanner.nextLine();
        }

        HuespedDTO nuevoHuesped = new HuespedDTO(telefono, email, ocupacion, apellido, nombre, tipoDocumento, Integer.parseInt(numeroDocumento), cuit, fechaNacimiento, new Direccion(calle, numero, departamento, piso, codigoPostal, localidad, provincia, pais), nacionalidad);
        return nuevoHuesped;
    }
    public void dar_alta_huesped(){
        while(true){
        HuespedDTO nuevoHuesped = ingresar_datos_huesped();
        while(huespedDao.existe_documento(nuevoHuesped.getTipoDocumento(), nuevoHuesped.getNumeroDocumento())){
            System.out.println("¡CUIDADO! El tipo y número de documento ya existen en el sistema");
            System.out.println("Aceptar igualmente o Corregir (S/N):");
            String decision;
            Scanner scanner = new Scanner(System.in);
            decision = scanner.nextLine();
            if(decision.equalsIgnoreCase("S")){
                
            }
            else{
                System.out.println("Corrija los datos del huésped.");
                        System.out.println("Ingrese el tipo de documento del huésped (DNI, LE, LC, PASAPORTE, OTRO):");
                        while(true) {
                            String tipoDocInput = scanner.nextLine().toUpperCase();
                            try {
                                nuevoHuesped.setTipoDocumento(TipoDocumento.valueOf(tipoDocInput));
                                break; // Salir del bucle si la conversión es exitosa
                            } catch (IllegalArgumentException e) {
                                System.out.print("Tipo de documento inválido. Ingrese un tipo válido (DNI, LE, LC, PASAPORTE, OTRO): ");
                            }
                        }
                        
                        System.out.println("Ingrese el número de documento del huésped:");
                        String numeroDocumento = scanner.nextLine();
                            while(numeroDocumento.isBlank()) {
                                System.out.print("Número de documento no puede estar vacío. Ingrese número de documento: ");
                                numeroDocumento = scanner.nextLine(); 
                            }
                        nuevoHuesped.setNumeroDocumento(Integer.parseInt(numeroDocumento));

            }
        }  
    }    
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
        List<Huesped> lista_huespedes = huespedDao.buscar_huespedes(huespedBusqueda);
        if(lista_huespedes == null || lista_huespedes.isEmpty()){
        dar_alta_huesped();
        }
        else{
        System.out.println("Huéspedes encontrados: " + lista_huespedes.size());
        int i = 1;
        for (Huesped huesped : lista_huespedes) {
            System.out.println(i + ". " + huesped.getNombre() + " " + huesped.getApellido() + " - " + huesped.getTipoDocumento() + " " + huesped.getNumDocumento());
            i++;
        }
        System.out.println("Seleccione el número del huésped o presione ENTER para dar de alta uno nuevo:");
        String entrada;
        try (Scanner scanner = new Scanner(System.in)) {
            entrada = scanner.nextLine();
        }

        if (entrada.isBlank()) {
            System.out.println("No se seleccionó ningún huésped. Ejecutando alta...");
            dar_alta_huesped(); // CU11
            return;
        }
         try {
        int seleccion = Integer.parseInt(entrada);
        if (seleccion >= 1 && seleccion <= lista_huespedes.size()) {
            Huesped huespedSeleccionado = lista_huespedes.get(seleccion - 1);
            System.out.println("Huésped seleccionado: " + huespedSeleccionado.getNombre() + " " + huespedSeleccionado.getApellido());
            //modificar_huesped(); // CU10
        } else {
            System.out.println("Selección fuera de rango. Ejecutando alta...");
            dar_alta_huesped(); // CU11
        }
        } catch (NumberFormatException e) {
            System.out.println("Entrada inválida. Ejecutando alta...");
            dar_alta_huesped(); // CU11
        }
        }
    }
    
}
