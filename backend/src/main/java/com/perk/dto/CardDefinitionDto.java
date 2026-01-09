package com.perk.dto;

import com.perk.entity.enums.CardNetwork;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CardDefinitionDto {
    private Long id;
    private String name;
    private String issuer;
    private CardNetwork network;
    private String imageUrl;
    private BigDecimal annualFee;
    private List<RewardRateDto> rewardRates;
}
