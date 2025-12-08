package tp.desarrollo.patrones.factory.Impl;

import tp.desarrollo.patrones.factory.PagoStrategy;

public class PagoTarjeta  implements PagoStrategy {

    private String numeroTarjeta;
    private String redPago;
    private String nombreTitular;
    private double monto;

    public PagoTarjeta(String numeroTarjeta, String redPago, String nombreTitular, double monto) {
        this.numeroTarjeta = numeroTarjeta;
        this.redPago = redPago;
        this.nombreTitular = nombreTitular;
        this.monto = monto;
    }

    @Override
    public boolean procesar() {

        if (!esNumeroTarjetaValido(numeroTarjeta)) {
            return false;
        }

        System.out.println("Procesando tarjeta: " + redPago);
        return true;
    }

    @Override
    public String getMoneda() {
        return "ARS";
    }

    @Override
    public double getMonto() {
        return monto;
    }

    @Override
    public String getTipo() {
        return "TARJETA";
    }

    private boolean esNumeroTarjetaValido(String numero) {
        return numero.length() >= 13 && numero.length() <= 19;
    }
}