package com.perk.dto;

import com.perk.entity.enums.ResetPeriod;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class BenefitDto {
    private UUID id;
    private UUID walletId;
    private String benefitName;
    private ResetPeriod resetPeriod;
    private BigDecimal totalAmount;
    private BigDecimal usedAmount;
    private LocalDate nextResetDate;
}
