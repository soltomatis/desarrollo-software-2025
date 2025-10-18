package tp.desarrollo.dao;
import tp.desarrollo.interfaces.HuespedDAO;
import tp.desarrollo.enums.TipoDocumento;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.File;
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
    public void registrar_huesped(HuespedDTO huesped){
        String archivo = "src/main/java/tp/desarrollo/db/huespedes.csv";
        //Lógica para registrar un nuevo huésped en el archivo CSV
        try (java.io.FileWriter fw = new java.io.FileWriter(archivo, true)) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String fechaNacimiento = huesped.getFecha_nacimiento().format(formatter);
            tp.desarrollo.clases.Direccion direccion = huesped.getDireccion();
            String nuevaLinea = String.join(",",
                huesped.getTelefono(),
                huesped.getEmail(),
                huesped.getOcupacion(),
                huesped.getApellido(),
                huesped.getNombre(),
                huesped.getTipoDocumento().toString(),
                String.valueOf(huesped.getNumeroDocumento()),
                String.valueOf(huesped.getCuit()),
                fechaNacimiento,
                direccion.getCalle(),
                String.valueOf(direccion.getNumero()),
                String.valueOf(direccion.getPiso()),
                String.valueOf(direccion.getDepartamento()),
                String.valueOf(direccion.getCodigoPostal()),
                direccion.getLocalidad(),
                direccion.getProvincia(),
                direccion.getPais(),
                huesped.getNacionalidad()
            ) + "\n";
            fw.write(nuevaLinea);
            System.out.println("Huésped registrado exitosamente.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public boolean existe_documento(TipoDocumento tipoDocumento, int numeroDocumento){
        String archivo = "src/main/java/tp/desarrollo/db/huespedes.csv";
        String linea;
        boolean existe = false;
        //Lógica para buscar huéspedes en el archivo CSV
        try (BufferedReader br = new BufferedReader(new FileReader(archivo))) {
            linea = br.readLine(); // salta el encabezado
            while ((linea = br.readLine()) != null) {
                String[] datos = linea.split(",");
                String tipoDoc = datos[5];
                int numDoc = Integer.parseInt(datos[6]);
                if(tipoDocumento.toString().equalsIgnoreCase(tipoDoc) && numeroDocumento == numDoc){
                    System.out.println("El documento ya existe en el sistema.");
                    existe = true;
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return existe;
    }
    public List<Huesped> buscar_huespedes(HuespedDTO huesped){
        String archivo = "src/main/java/tp/desarrollo/db/huespedes.csv";

        String linea;
        List<Huesped> resultado = new ArrayList<>();
        //Lógica para buscar huéspedes en el archivo CSV
        System.out.println("Directorio actual: " + System.getProperty("user.dir"));
        try (BufferedReader br = new BufferedReader(new FileReader(archivo))) {
            linea = br.readLine(); // salta el encabezado
            while ((linea = br.readLine()) != null) {
                String[] datos = linea.split(",");
                // Comparar los datos con los del objeto huesped
                    String apellido = datos[3];
                    String nombre = datos[4];
                    String tipoDoc = datos[5];
                    int numDoc = Integer.parseInt(datos[6]);
                    boolean coincide = true;

                    if (huesped.getNombre() != null && !huesped.getNombre().isBlank()) {
                        coincide &= huesped.getNombre().equalsIgnoreCase(nombre);
                    }
                    if (huesped.getApellido() != null && !huesped.getApellido().isBlank()) {
                        coincide &= huesped.getApellido().equalsIgnoreCase(apellido);
                    }
                    if (huesped.getTipoDocumento() != null) {
                        coincide &= huesped.getTipoDocumento().toString().equalsIgnoreCase(tipoDoc);
                    }
                    if (huesped.getNumeroDocumento() > 0) {
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
    
    public void eliminar(Huesped huespedAEliminar) {
        String archivo = "src/main/java/tp/desarrollo/db/huespedes.csv";
        File archivoOriginal = new File(archivo);
        // Creamos un archivo temporal en el mismo directorio que el original.
        File archivoTemporal = new File(archivoOriginal.getParent(), "temp_huespedes.csv");
        
        try (BufferedReader br = new BufferedReader(new FileReader(archivoOriginal));
             BufferedWriter bw = new BufferedWriter(new FileWriter(archivoTemporal))) {

            String linea;
            
            if ((linea = br.readLine()) != null) {
                bw.write(linea + System.lineSeparator());
            }

            while ((linea = br.readLine()) != null) {
                String[] datos = linea.split(",");
                // Asumimos que las columnas 5 y 6 contienen el tipo y nro de documento.
                String tipoDocArchivo = datos[5].trim();
                int numDocArchivo = Integer.parseInt(datos[6].trim());

                // Si la línea actual NO corresponde al huesped a eliminar la escribimos en el temporal.
                if (!(huespedAEliminar.getTipoDocumento().toString().equalsIgnoreCase(tipoDocArchivo) &&
                      huespedAEliminar.getNumDocumento() == numDocArchivo)) {
                    bw.write(linea + System.lineSeparator());
                }
            }
        } catch (IOException | NumberFormatException e) {
            System.err.println("Error durante la operación de eliminación de huésped: " + e.getMessage());
            return;
        }

        // Una vez que el archivo temporal está completo reemplazamos el original.
        if (archivoOriginal.delete()) {
            if (!archivoTemporal.renameTo(archivoOriginal)) {
                System.err.println("Error crítico: No se pudo renombrar el archivo temporal. Los datos originales pueden estar en 'temp_huespedes.csv'");
            }
        } else {
            System.err.println("Error crítico: No se pudo borrar el archivo original.");
        }
    }
}
