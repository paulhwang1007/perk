package com.perk.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
public class WalletDto {
    private UUID id;
    private CardDefinitionDto card;
    private LocalDate openedDate;
    private String nickname;
    private BigDecimal creditLimit;
    private Boolean isActive;
}
