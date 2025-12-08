package tp.desarrollo.patrones.strategy.Impl;

import tp.desarrollo.patrones.strategy.EstrategiaFacturacion;

public class FacturaCMonotributista implements EstrategiaFacturacion {

    private static final double IVA_RATE = 0.10;

    @Override
    public double calcularTotal(double subtotalBruto) {
        return subtotalBruto * (1 + IVA_RATE);
    }

    @Override
    public double calcularIVA(double subtotalBruto) {
        return subtotalBruto * IVA_RATE;
    }

    @Override
    public String getTipoFactura() {
        return "C";
    }
}