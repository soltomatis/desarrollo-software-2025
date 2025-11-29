/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package tp.desarrollo;

import tp.desarrollo.gestores.Gestor_Usuario;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import tp.desarrollo.dao.HuespedDaoArchivos;
import tp.desarrollo.dao.UsuarioDaoArchivos;
import tp.desarrollo.dao.ReservaDaoArchivos;
import java.util.Scanner;
import tp.desarrollo.enums.TipoDocumento;

@SpringBootApplication
public class Desarrollo {
    
    public static void main(String[] args) {
        System.out.println("TP ACTUAL (1) - TP ANTERIOR (2): ");
        java.util.Scanner sc1 = new java.util.Scanner(System.in);
        String op = sc1.nextLine().trim().toUpperCase();
        if(op.equals("1")) {
            SpringApplication.run(Desarrollo.class, args);
        } else if(op.equals("2")) {
        System.out.println("=== Sistema de Gestión de Huéspedes ===");

        HuespedDaoArchivos huespedDao = new HuespedDaoArchivos();
        UsuarioDaoArchivos usuarioDao = new UsuarioDaoArchivos();
        ReservaDaoArchivos reservaDao = new ReservaDaoArchivos();
        Gestor_Usuario gestorUsuario = new Gestor_Usuario(huespedDao, usuarioDao, reservaDao);

        Scanner sc = new Scanner(System.in);

        // --- Autenticación primero ---
        boolean autenticado = false;
        while (!autenticado) {
            autenticado = gestorUsuario.autenticar_conserje();

            if (!autenticado) {
                System.out.print("Intentar nuevamente? (S/N): ");
                String opcion = sc.nextLine().trim().toUpperCase();
                if (!opcion.equals("S")) {
                    System.out.println("Fin del programa");
                    return;
                }
            }
        }
        System.out.println("Acceso concedido\n");

        // --- Menú principal ---
        boolean salir = false;
        while (!salir) {
            System.out.println("\nSeleccione una opción:");
            System.out.println("1 - Buscar huésped");
            System.out.println("2 - Dar de alta un huésped");
            System.out.println("3 - Salir");
            System.out.print("Opción: ");

            String opcion = sc.nextLine().trim();

            switch (opcion) {
                case "1":
                    // --- Ingreso de parámetros de búsqueda ---
                    System.out.println("\nIngrese los datos del huésped a buscar (puede dejar campos vacíos):");

                    System.out.print("Nombre: ");
                    String nombre = sc.nextLine().trim();
                    if (nombre.isEmpty()) nombre = null;

                    System.out.print("Apellido: ");
                    String apellido = sc.nextLine().trim();
                    if (apellido.isEmpty()) apellido = null;

                    System.out.print("Tipo de Documento (ej: DNI, LC, LE) o vacío: ");
                    String tipoDocStr = sc.nextLine().trim();
                    TipoDocumento tipoDocumento = null;
                    if (!tipoDocStr.isEmpty()) {
                        try {
                            tipoDocumento = TipoDocumento.valueOf(tipoDocStr.toUpperCase());
                        } catch (IllegalArgumentException e) {
                            System.out.println("Tipo de documento inválido, se ignora.");
                        }
                    }

                    System.out.print("Número de Documento: ");
                    String numeroDocumento = sc.nextLine().trim();
                    if (numeroDocumento.isEmpty()) numeroDocumento = null;

                    // --- Llamada a búsqueda ---
                    gestorUsuario.buscar_huespedes(nombre, apellido, tipoDocumento, numeroDocumento);
                    break;

                case "2":
                    // --- Alta directa ---
                    gestorUsuario.dar_alta_huesped();
                    break;

                case "3":
                    System.out.println("Saliendo del sistema...");
                    salir = true;
                    break;

                default:
                    System.out.println("Opción inválida, intente nuevamente.");
            }
        }

        System.out.println("\nFin de la ejecución de prueba.");
    }
}
}
