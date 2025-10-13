/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package tp.desarrollo;

import tp.desarrollo.Gestores.Gestor_Usuario;
import tp.desarrollo.dao.HuespedDaoArchivos;

/**
 *
 * @author juanc
 */
public class Desarrollo {

    public static void main(String[] args) {
        System.out.println("Hello World!");
        HuespedDaoArchivos huespedDao = new HuespedDaoArchivos();
        Gestor_Usuario gestorUsuario = new Gestor_Usuario(huespedDao);
    }
}
