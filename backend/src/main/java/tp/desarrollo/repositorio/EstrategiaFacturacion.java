package tp.desarrollo.repositorio;

public interface EstrategiaFacturacion {

    double calcularTotal(double subtotalBruto);

    String getTipoFactura();

    double calcularIVA(double subtotalBruto);
}
