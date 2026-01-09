package com.perk.dto;

import com.perk.entity.enums.BonusStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class BonusDto {
    private UUID id;
    private UUID walletId;
    private BigDecimal requiredSpend;
    private LocalDate deadline;
    private Integer bonusPoints;
    private BigDecimal currentSpend;
    private BonusStatus status;
}
