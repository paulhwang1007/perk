package com.perk.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateWalletRecordDto {
    
    @NotNull(message = "Card Definition ID is required")
    private Long cardDefinitionId;

    @NotNull(message = "Opened date is required")
    @PastOrPresent(message = "Opened date cannot be in the future")
    private LocalDate openedDate;

    private String nickname;

    @Positive(message = "Credit limit must be positive")
    private BigDecimal creditLimit;
}
