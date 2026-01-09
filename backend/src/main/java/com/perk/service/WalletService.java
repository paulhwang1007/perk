package com.perk.service;

import com.perk.dto.CreateWalletRecordDto;
import com.perk.dto.WalletDto;
import com.perk.entity.CardDefinition;
import com.perk.entity.UserWallet;
import com.perk.repository.CardDefinitionRepository;
import com.perk.repository.UserWalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final UserWalletRepository walletRepository;
    private final CardDefinitionRepository cardRepository;
    private final CardService cardService; // Reusing mapper logic if strictly separated, or we can duplicate simplistic mapping here for now.

    @Transactional(readOnly = true)
    public List<WalletDto> getUserWallet(UUID userId) {
        return walletRepository.findByUserId(userId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public WalletDto addCardToWallet(UUID userId, CreateWalletRecordDto dto) {
        if (walletRepository.existsByUserIdAndCardDefinitionId(userId, dto.getCardDefinitionId())) {
            throw new RuntimeException("Card already exists in wallet");
        }

        CardDefinition card = cardRepository.findById(dto.getCardDefinitionId())
            .orElseThrow(() -> new RuntimeException("Card definition not found"));

        UserWallet wallet = UserWallet.builder()
            .userId(userId)
            .cardDefinition(card)
            .openedDate(dto.getOpenedDate())
            .nickname(dto.getNickname())
            .creditLimit(dto.getCreditLimit())
            .isActive(true)
            .build();

        return toDto(walletRepository.save(wallet));
    }

    private WalletDto toDto(UserWallet entity) {
        return WalletDto.builder()
            .id(entity.getId())
            // We need to map the card definition to DTO. 
            // In a real app we might fetch it eagerly or use Hibernate proxy.
            .card(cardService.getCardById(entity.getCardDefinition().getId())) 
            .openedDate(entity.getOpenedDate())
            .nickname(entity.getNickname())
            .creditLimit(entity.getCreditLimit())
            .isActive(entity.getIsActive())
            .build();
    }
}
