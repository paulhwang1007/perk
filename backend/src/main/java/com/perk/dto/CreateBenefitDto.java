package com.perk.dto;

import com.perk.entity.enums.ResetPeriod;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateBenefitDto {

    @NotNull(message = "Wallet ID is required")
    private UUID walletId;

    @NotBlank(message = "Benefit name is required")
    private String benefitName;

    @NotNull(message = "Reset period is required")
    private ResetPeriod resetPeriod;

    @NotNull(message = "Total amount is required")
    @Positive
    private BigDecimal totalAmount;

    private BigDecimal usedAmount;

    @NotNull(message = "Next reset date is required")
    @Future
    private LocalDate nextResetDate;
}
