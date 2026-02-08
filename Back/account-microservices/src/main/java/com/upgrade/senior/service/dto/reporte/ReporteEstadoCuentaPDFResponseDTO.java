package com.upgrade.senior.service.dto.reporte;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class ReporteEstadoCuentaPDFResponseDTO {
    private String pdfBase64;
}
