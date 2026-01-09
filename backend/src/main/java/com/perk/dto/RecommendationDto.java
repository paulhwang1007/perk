package com.perk.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RecommendationDto {
    private CardDefinitionDto card;
    private BigDecimal multiplier;
    private String reasoning;
    private String category;
}
