package com.perk.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateBonusDto {
    
    @NotNull(message = "Wallet ID is required")
    private UUID walletId;

    @NotNull(message = "Required spend is required")
    @Positive
    private BigDecimal requiredSpend;

    @NotNull(message = "Deadline is required")
    @Future(message = "Deadline must be in the future")
    private LocalDate deadline;

    @NotNull(message = "Bonus points is required")
    @Positive
    private Integer bonusPoints;
}
