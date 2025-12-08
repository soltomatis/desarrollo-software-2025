package tp.desarrollo.patrones.strategy;

public interface EstrategiaFacturacion {

    double calcularTotal(double subtotalBruto);

    String getTipoFactura();

    double calcularIVA(double subtotalBruto);
}
