package tp.desarrollo.patrones.factory;

public interface PagoStrategy {

    boolean procesar();

    String getMoneda();

    double getMonto();

    String getTipo();
}