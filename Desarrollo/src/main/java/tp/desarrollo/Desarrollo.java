/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package tp.desarrollo;

import tp.desarrollo.Gestores.Gestor_Usuario;
import tp.desarrollo.dao.HuespedDaoArchivos;
import tp.desarrollo.dao.UsuarioDaoArchivos;

/**
 *
 * @author juanc
 */
public class Desarrollo {

    public static void main(String[] args) {
        System.out.println("Hello World!");
        HuespedDaoArchivos huespedDao = new HuespedDaoArchivos();
        UsuarioDaoArchivos usuarioDao = new UsuarioDaoArchivos();
        Gestor_Usuario gestorUsuario = new Gestor_Usuario(huespedDao, usuarioDao);

        boolean autenticado = false;
        gestorUsuario.buscar_huespedes("Carlos", null, null, null);
        gestorUsuario.dar_alta_huesped();
        while (!autenticado) {
            autenticado = gestorUsuario.autenticar_conserje();

            if (!autenticado) {
                System.out.println("Intentar nuevamente? (S/N): ");
                java.util.Scanner sc = new java.util.Scanner(System.in);
                String opcion = sc.nextLine().trim().toUpperCase();
                if (!opcion.equals("S")) {
                    System.out.println("Fin del programa");
                    return;
                }
            }
        }

        System.out.println("Acceso concedido");

    }
}
