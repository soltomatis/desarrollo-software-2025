package tp.desarrollo.repositorio.Impl;

import tp.desarrollo.repositorio.PagoStrategy;

import java.util.Arrays;
import java.util.List;

public class PagoMonedaExtranjera implements PagoStrategy {

    private double monto;
    private String moneda;
    private double cotizacion;

    public PagoMonedaExtranjera(double monto, String moneda, double cotizacion) {
        this.monto = monto;
        this.moneda = moneda;
        this.cotizacion = cotizacion;
    }

    @Override
    public boolean procesar() {
        List<String> monedasValidas = Arrays.asList("USD", "EUR", "BRL", "UYU", "JPY");
        return monedasValidas.contains(moneda);
    }

    @Override
    public String getMoneda() {
        return moneda;
    }

    @Override
    public double getMonto() {
        return monto * cotizacion;
    }

    @Override
    public String getTipo() {
        return "MONEDA_EXTRANJERA";
    }
}