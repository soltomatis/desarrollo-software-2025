package tp.desarrollo.repositorio.Impl;

import tp.desarrollo.repositorio.PagoStrategy;

public class PagoEfectivo implements PagoStrategy {

    private double monto;
    private String moneda;

    public PagoEfectivo(double monto, String moneda) {
        this.monto = monto;
        this.moneda = moneda;
    }

    @Override
    public boolean procesar() {
        return true;
    }

    @Override
    public String getMoneda() {
        return moneda;
    }

    @Override
    public double getMonto() {
        return monto;
    }

    @Override
    public String getTipo() {
        return "EFECTIVO";
    }
}
