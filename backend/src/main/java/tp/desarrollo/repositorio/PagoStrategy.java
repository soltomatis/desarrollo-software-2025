package tp.desarrollo.repositorio;

public interface PagoStrategy {

    boolean procesar();

    String getMoneda();

    double getMonto();

    String getTipo();
}