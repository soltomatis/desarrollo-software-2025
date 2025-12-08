package tp.desarrollo.repositorio.Impl;

import tp.desarrollo.repositorio.PagoStrategy;

import java.time.LocalDate;

public class PagoCheque implements PagoStrategy {

    private Long numeroCheque;
    private String banco;
    private String plaza;
    private LocalDate fechaCobro;
    private double monto;

    public PagoCheque(Long numeroCheque, String banco, String plaza,
                      LocalDate fechaCobro, double monto) {
        this.numeroCheque = numeroCheque;
        this.banco = banco;
        this.plaza = plaza;
        this.fechaCobro = fechaCobro;
        this.monto = monto;
    }

    @Override
    public boolean procesar() {

        if (fechaCobro.isBefore(LocalDate.now())) {
            System.err.println("Cheque vencido");
            return false;
        }

        if (numeroCheque <= 0) {
            System.err.println("Número de cheque inválido");
            return false;
        }

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
        return "CHEQUE";
    }
}