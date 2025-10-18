package tp.desarrollo.dao;
import tp.desarrollo.interfaces.HuespedDAO;
import tp.desarrollo.modelo.TipoDocumento;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import tp.desarrollo.clases.Huesped;
import tp.desarrollo.dto.HuespedDTO;

public class HuespedDaoArchivos implements HuespedDAO{
    @Override
    public void modificar_huesped(HuespedDTO huesped){
        
    }
    public List<Huesped> buscarHuespedes(HuespedDTO huesped){
        String archivo = "huespedes.csv";
        String linea;
        List<Huesped> resultado = new ArrayList<>();
        //Lógica para buscar huéspedes en el archivo CSV
        try (BufferedReader br = new BufferedReader(new FileReader(archivo))) {
            while ((linea = br.readLine()) != null) {
                String[] datos = linea.split(",");
                // Comparar los datos con los del objeto huesped
                    String apellido = datos[3];
                    String nombre = datos[4];
                    String tipoDoc = datos[5];
                    int numDoc = Integer.parseInt(datos[6]);
                    boolean coincide = true;

                    if (nombre != null && !nombre.isBlank()) {
                        coincide &= huesped.getNombre().equalsIgnoreCase(nombre);
                    }
                    if (apellido != null && !apellido.isBlank()) {
                        coincide &= huesped.getApellido().equalsIgnoreCase(apellido);
                    }
                    if (tipoDoc != null ) {
                       coincide &= huesped.getTipoDocumento().toString().equalsIgnoreCase(tipoDoc);                            
                    }
                    if (numDoc > 0) {
                        coincide &= huesped.getNumeroDocumento() == numDoc;
                    }
                    if(coincide){
                        // Si coincide, crear un objeto Huesped y agregarlo a la lista de resultados
                        TipoDocumento tipo = TipoDocumento.valueOf(datos[5].toUpperCase());
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                        LocalDate fechaLocal = LocalDate.parse(datos[8], formatter);
                        // Crear objeto Direccion
                        tp.desarrollo.clases.Direccion direccion = new tp.desarrollo.clases.Direccion(
                            datos[9],
                            Integer.parseInt(datos[10]),
                            datos[11],
                            Integer.parseInt(datos[12]),
                            Integer.parseInt(datos[13]),
                            datos[14],
                            datos[15],
                            datos[16]
                        );
                        Huesped huespedEncontrado = new Huesped(datos[0], // telefono
                            datos[1], // email
                            datos[2], // ocupacion
                            datos[3], // apellido
                            datos[4], // nombre
                            tipo, // tipo_documento
                            Integer.parseInt(datos[6]), // num_documento
                            Integer.parseInt(datos[7]), // cuit
                            fechaLocal, // fecha_nacimiento
                            direccion, // direccion
                            datos[17] // nacionalidad
                        );
                        resultado.add(huespedEncontrado);
                    }
                }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return resultado;
    }
}
