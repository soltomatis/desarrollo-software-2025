/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package tp.desarrollo.Gestores;

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

    private void dar_alta_huesped(){
        System.out.println("Ejecutando alta de huésped...");
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

    public boolean autenticar_conserje() {
        java.util.Scanner sc = new java.util.Scanner(System.in);

        System.out.print("Usuario (CONSERJE): ");
        String user = sc.nextLine().trim();

        System.out.print("Contraseña: ");
        String pass = sc.nextLine();

        String ruta = "C:\\Users\\Maria Sol\\Desarrollo\\usuarios.csv";

        java.io.BufferedReader br = null;
        try {
            br = new java.io.BufferedReader(new java.io.FileReader(ruta));
            String linea;
            while ((linea = br.readLine()) != null) {
                if (linea.isBlank() || linea.startsWith("#")) continue;
                String[] cols = linea.split(";");
                if (cols.length < 3) continue;

                String u = cols[0].trim();
                String p = cols[1].trim();
                boolean activo = Boolean.parseBoolean(cols[2].trim());

                if (u.equalsIgnoreCase(user)) {
                    if (!activo) {
                        System.out.println("El conserje está inactivo.");
                        return false;
                    }
                    if (p.equals(pass)) {
                        System.out.println("Conserje autenticado.");
                        return true;
                    } else {
                        System.out.println("Contraseña incorrecta.");
                        return false;
                    }
                }
            }
            System.out.println("Conserje no encontrado.");
            return false;
        } catch (java.io.IOException e) {
            System.out.println("Error leyendo credenciales: " + e.getMessage());
            return false;
        } finally {
            if (br != null) {
                try {
                    br.close();
                } catch (java.io.IOException ignore) {
                }
            }
        }
    }
}
