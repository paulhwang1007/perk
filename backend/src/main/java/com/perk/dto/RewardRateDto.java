package com.perk.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RewardRateDto {
    private String category;
    private BigDecimal multiplier;
}
