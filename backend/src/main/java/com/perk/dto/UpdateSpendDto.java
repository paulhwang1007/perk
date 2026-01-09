package com.perk.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class UpdateSpendDto {
    @NotNull
    @Positive
    private BigDecimal amount;
}
