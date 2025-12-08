package tp.desarrollo.patrones.strategy.Impl;

import tp.desarrollo.patrones.strategy.EstrategiaFacturacion;

public class FacturaATipoA implements EstrategiaFacturacion {

    private static final double IVA_RATE = 0.21;

    @Override
    public double calcularTotal(double subtotalBruto) {
        return subtotalBruto;
    }

    @Override
    public double calcularIVA(double subtotalBruto) {
        return subtotalBruto - (subtotalBruto / (1 + IVA_RATE));
    }

    @Override
    public String getTipoFactura() {
        return "A";
    }
}