/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package tp.desarrollo.servicios;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import tp.desarrollo.clases.Factura;
import tp.desarrollo.patrones.factory.PagoFactory;
import tp.desarrollo.patrones.factory.PagoStrategy;
import tp.desarrollo.repositorio.FacturaDaoDB;

import java.util.Map;

public class Gestor_Pago {

    @Autowired
    private PagoFactory pagoFactory;

    @Autowired
    private FacturaDaoDB facturaDaoDB;

    @Transactional
    public boolean procesarPago(Long facturaId, String tipoPago, Map<String, Object> datosPago) {

        Factura factura = facturaDaoDB.buscarPorId(facturaId);

        if (factura == null) {
            throw new RuntimeException("Factura no encontrada");
        }

        try {
            PagoStrategy pago = pagoFactory.crearPago(tipoPago, datosPago);

            if (pago.procesar()) {
                factura.setEstado("PAGADA");
                facturaDaoDB.save(factura);
                return true;
            } else {
                factura.setEstado("ERROR_PAGO");
                facturaDaoDB.save(factura);
                return false;
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Error al crear pago: " + e.getMessage());
            throw e;
        }
    }
}
