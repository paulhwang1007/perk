package com.perk.service;

import com.perk.dto.CardDefinitionDto;
import com.perk.dto.RewardRateDto;
import com.perk.entity.CardDefinition;
import com.perk.repository.CardDefinitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardDefinitionRepository cardRepository;

    @Transactional(readOnly = true)
    public List<CardDefinitionDto> getAllCards() {
        return cardRepository.findAll().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CardDefinitionDto getCardById(Long id) {
        return cardRepository.findById(id)
            .map(this::toDto)
            .orElseThrow(() -> new RuntimeException("Card not found"));
    }
    
    // Mapper methods (could use MapStruct, but manual is fine for this size)
    private CardDefinitionDto toDto(CardDefinition entity) {
        return CardDefinitionDto.builder()
            .id(entity.getId())
            .name(entity.getName())
            .issuer(entity.getIssuer())
            .network(entity.getNetwork())
            .imageUrl(entity.getImageUrl())
            .annualFee(entity.getAnnualFee())
            .rewardRates(entity.getRewardRates().stream()
                .map(r -> RewardRateDto.builder()
                    .category(r.getCategory())
                    .multiplier(r.getMultiplier())
                    .build())
                .collect(Collectors.toList()))
            .build();
    }
}
