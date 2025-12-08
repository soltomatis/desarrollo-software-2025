package tp.desarrollo.patrones.factory;

import tp.desarrollo.patrones.factory.Impl.PagoCheque;
import tp.desarrollo.patrones.factory.Impl.PagoEfectivo;
import tp.desarrollo.patrones.factory.Impl.PagoMonedaExtranjera;
import tp.desarrollo.patrones.factory.Impl.PagoTarjeta;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

public class PagoFactory {

    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public PagoStrategy crearPago(String tipoPago, Map<String, Object> datos) {

        if (tipoPago == null || tipoPago.isEmpty()) {
            throw new IllegalArgumentException("Tipo de pago no especificado");
        }

        switch (tipoPago.toUpperCase()) {
            case "TARJETA":
                return crearPagoTarjeta(datos);

            case "CHEQUE":
                return crearPagoCheque(datos);

            case "EFECTIVO":
                return crearPagoEfectivo(datos);

            case "MONEDA_EXTRANJERA":
                return crearPagoMonedaExtranjera(datos);

            default:
                throw new IllegalArgumentException("Tipo de pago desconocido: " + tipoPago);
        }
    }

    private PagoStrategy crearPagoTarjeta(Map<String, Object> datos) {
        String numeroTarjeta = (String) datos.get("numeroTarjeta");
        String redPago = (String) datos.get("redPago");
        String nombreTitular = (String) datos.get("nombreTitular");
        Double monto = (Double) datos.get("monto");

        if (numeroTarjeta == null || redPago == null || monto == null) {
            throw new IllegalArgumentException("Datos incompletos para pago con tarjeta");
        }

        return new PagoTarjeta(numeroTarjeta, redPago, nombreTitular, monto);
    }

    private PagoStrategy crearPagoCheque(Map<String, Object> datos) {
        Long numeroCheque = ((Number) datos.get("numeroCheque")).longValue();
        String banco = (String) datos.get("banco");
        String plaza = (String) datos.get("plaza");
        String fechaCobroStr = (String) datos.get("fechaCobro");
        Double monto = (Double) datos.get("monto");

        if (numeroCheque == null || banco == null || monto == null) {
            throw new IllegalArgumentException("Datos incompletos para pago con cheque");
        }

        LocalDate fechaCobro = LocalDate.parse(fechaCobroStr, dateFormatter);
        return new PagoCheque(numeroCheque, banco, plaza, fechaCobro, monto);
    }

    private PagoStrategy crearPagoEfectivo(Map<String, Object> datos) {
        Double monto = (Double) datos.get("monto");
        String moneda = (String) datos.get("moneda");

        if (monto == null) {
            throw new IllegalArgumentException("Monto no especificado");
        }

        moneda = moneda != null ? moneda : "ARS";
        return new PagoEfectivo(monto, moneda);
    }

    private PagoStrategy crearPagoMonedaExtranjera(Map<String, Object> datos) {
        Double monto = (Double) datos.get("monto");
        String moneda = (String) datos.get("moneda");
        Double cotizacion = (Double) datos.get("cotizacion");

        if (monto == null || moneda == null || cotizacion == null) {
            throw new IllegalArgumentException("Datos incompletos para moneda extranjera");
        }

        return new PagoMonedaExtranjera(monto, moneda, cotizacion);
    }
}
