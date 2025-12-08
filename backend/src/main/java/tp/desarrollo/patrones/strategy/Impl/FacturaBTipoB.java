package tp.desarrollo.patrones.strategy.Impl;

import tp.desarrollo.patrones.strategy.EstrategiaFacturacion;

public class FacturaBTipoB implements EstrategiaFacturacion {

    @Override
    public double calcularTotal(double subtotalBruto) {
        return subtotalBruto;
    }

    @Override
    public double calcularIVA(double subtotalBruto) {
        return 0.00; // No discriminar IVA
    }

    @Override
    public String getTipoFactura() {
        return "B";
    }
}