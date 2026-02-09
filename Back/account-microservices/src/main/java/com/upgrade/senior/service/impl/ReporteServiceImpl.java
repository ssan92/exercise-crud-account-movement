package com.upgrade.senior.service.impl;


import com.upgrade.senior.enums.TipoMovimiento;
import com.upgrade.senior.exception.ClienteNotFoundException;
import com.upgrade.senior.exception.GeneralException;
import com.upgrade.senior.persistence.Cliente;
import com.upgrade.senior.persistence.Cuenta;
import com.upgrade.senior.persistence.Movimiento;
import com.upgrade.senior.repository.ClienteRepository;
import com.upgrade.senior.repository.CuentaRepository;
import com.upgrade.senior.repository.MovimientoRepository;
import com.upgrade.senior.service.ReporteService;
import com.upgrade.senior.service.dto.reporte.CuentaReporteDTO;
import com.upgrade.senior.service.dto.reporte.MovimientoReporteDTO;
import com.upgrade.senior.service.dto.reporte.ReporteEstadoCuentaPDFResponseDTO;
import com.upgrade.senior.service.dto.reporte.ReporteEstadoCuentaResponseDTO;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.BaseColor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteServiceImpl implements ReporteService {

    private final ClienteRepository clienteRepository;
    private final CuentaRepository cuentaRepository;
    private final MovimientoRepository movimientoRepository;

    @Override
    public ReporteEstadoCuentaResponseDTO generarEstadoCuenta(Long clienteId, LocalDate fechaInicio, LocalDate fechaFin) {
        Cliente cliente = clienteRepository.findById(clienteId).orElseThrow(() -> new ClienteNotFoundException(clienteId));
        List<Cuenta> cuentas = cuentaRepository.findAll().stream()
                .filter(c -> c.getCliente().getClienteId().equals(clienteId))
                .collect(Collectors.toList());
        
        LocalDate now = LocalDate.now();
        if (fechaInicio == null) fechaInicio = now;
        if (fechaFin == null) fechaFin = now;
        
        final java.time.LocalDateTime inicio = fechaInicio.atStartOfDay();
        final java.time.LocalDateTime fin = fechaFin.plusDays(1).atStartOfDay();
        
        List<CuentaReporteDTO> cuentasReporte = new ArrayList<>();
        for (Cuenta cuenta : cuentas) {
            List<Movimiento> movimientos = movimientoRepository.findByCuenta_NumeroCuenta(cuenta.getNumeroCuenta())
                    .stream()
                    .filter(m -> !m.getFecha().isBefore(inicio) && m.getFecha().isBefore(fin))
                    .collect(Collectors.toList());
            List<MovimientoReporteDTO> movimientosDTO = new ArrayList<>();
            double totalCreditos = 0;
            double totalDebitos = 0;
            double saldo = cuenta.getSaldoInicial();
            if(movimientos.isEmpty()){
                throw new GeneralException("No existen movimientos para filtro de fechas seleccionados", 404);
            }
            for (Movimiento mov : movimientos) {
                MovimientoReporteDTO movDTO = MovimientoReporteDTO.builder()
                        .fecha(mov.getFecha().toLocalDate())
                        .tipoMovimiento(mov.getTipoMovimiento())
                        .valor(mov.getTipoMovimiento() == TipoMovimiento.CREDITO ? Double.parseDouble("+" + mov.getValor()) :
                                mov.getTipoMovimiento() == TipoMovimiento.DEBITO ? Double.parseDouble("-" + Math.abs(mov.getValor())) : mov.getValor())
                        .saldoDisponible(mov.getSaldo())
                        .build();
                movimientosDTO.add(movDTO);
                if (mov.getTipoMovimiento() == TipoMovimiento.CREDITO) {
                    totalCreditos += mov.getValor();
                } else if (mov.getTipoMovimiento() == TipoMovimiento.DEBITO) {
                    totalDebitos += mov.getValor();
                }
                saldo = mov.getSaldo();
            }
            CuentaReporteDTO cuentaDTO = CuentaReporteDTO.builder()
                    .numeroCuenta(cuenta.getNumeroCuenta())
                    .tipo(cuenta.getTipoCuenta().name())
                    .saldoInicial(cuenta.getSaldoInicial())
                    .estado(cuenta.getEstado())
                    .movimientos(movimientosDTO)
                    .totalCreditos(totalCreditos)
                    .totalDebitos(totalDebitos)
                    .saldoFinal(saldo)
                    .build();
            cuentasReporte.add(cuentaDTO);
        }
        ReporteEstadoCuentaResponseDTO response = ReporteEstadoCuentaResponseDTO.builder()
                .fechaReporte(LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .cliente(cliente.getNombre())
                .cuentas(cuentasReporte)
                .build();
        return response;
    }

    @Override
    public ReporteEstadoCuentaPDFResponseDTO generarEstadoCuentaPDF(Long clienteId, LocalDate fechaInicio, LocalDate fechaFin) {
        ReporteEstadoCuentaResponseDTO data = generarEstadoCuenta(clienteId, fechaInicio, fechaFin);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();
            Font tituloFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLACK);
            Font seccionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.DARK_GRAY);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.BLACK);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);
            document.add(new Paragraph("Reporte Estado de Cuenta", tituloFont));
            document.add(new Paragraph("Fecha de reporte: " + data.getFechaReporte(), labelFont));
            document.add(new Paragraph("Cliente: " + data.getCliente(), labelFont));
            for (var cuenta : data.getCuentas()) {
                document.add(new Paragraph("\nCuenta: " + cuenta.getNumeroCuenta(), seccionFont));
                document.add(new Paragraph("Tipo: " + cuenta.getTipo(), labelFont));
                document.add(new Paragraph("Saldo Inicial: " + cuenta.getSaldoInicial(), labelFont));
                document.add(new Paragraph("Estado: " + cuenta.getEstado(), labelFont));
                document.add(new Paragraph("Total Créditos: " + cuenta.getTotalCreditos(), labelFont));
                document.add(new Paragraph("Total Débitos: " + cuenta.getTotalDebitos(), labelFont));
                document.add(new Paragraph("Saldo Final: " + cuenta.getSaldoFinal(), labelFont));
                document.add(new Paragraph("Movimientos:", labelFont));
                for (var mov : cuenta.getMovimientos()) {
                    document.add(new Paragraph(
                            "  - Fecha: " + mov.getFecha() +
                                    ", Tipo: " + mov.getTipoMovimiento() +
                                    ", Valor: " + mov.getValor() +
                                    ", Saldo: " + mov.getSaldoDisponible(),
                            normalFont));
                }
            }
            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error generando PDF", e);
        }
        String pdfBase64 = Base64.getEncoder().encodeToString(baos.toByteArray());
        ReporteEstadoCuentaPDFResponseDTO response = ReporteEstadoCuentaPDFResponseDTO.builder()
                .pdfBase64(pdfBase64)
                .build();
        return response;
    }
}
