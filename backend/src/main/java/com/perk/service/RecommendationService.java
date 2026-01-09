package com.perk.service;

import com.perk.dto.RecommendationDto;
import com.perk.entity.CardRewardRate;
import com.perk.entity.SignUpBonus;
import com.perk.entity.UserWallet;
import com.perk.entity.enums.BonusStatus;
import com.perk.repository.SignUpBonusRepository;
import com.perk.repository.UserWalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserWalletRepository walletRepository;
    private final SignUpBonusRepository bonusRepository;
    private final CardService cardService;

    @Transactional(readOnly = true)
    public RecommendationDto getBestCard(UUID userId, String category) {
        List<UserWallet> wallet = walletRepository.findByUserId(userId);
        List<SignUpBonus> bonuses = bonusRepository.findByWalletUserId(userId);

        // Filter active cards
        List<UserWallet> activeCards = wallet.stream()
            .filter(w -> Boolean.TRUE.equals(w.getIsActive()))
            .toList();

        if (activeCards.isEmpty()) {
            throw new RuntimeException("No active cards in wallet");
        }

        // Calculate score for each card
        Optional<UserWallet> bestCard = activeCards.stream()
            .max(Comparator
                .comparing((UserWallet w) -> getMultiplier(w, category)) // 1. Multiplier
                .thenComparing(w -> hasActiveBonus(w, bonuses))          // 2. Active SUB ? (Boolean compares False < True)
                .thenComparing(w -> w.getCardDefinition().getAnnualFee()) // 3. Annual Fee
                .thenComparing(UserWallet::getOpenedDate)                 // 4. Recency (Newer date > Older date? Actually newer is larger value, so yes)
            );

        UserWallet winner = bestCard.orElseThrow();
        BigDecimal multiplier = getMultiplier(winner, category);
        boolean hasBonus = hasActiveBonus(winner, bonuses);

        String reasoning = String.format("Earns %.0fx points on %s", multiplier, category);
        if (hasBonus) {
            reasoning += " + Active Sign-up Bonus!";
        }

        return RecommendationDto.builder()
            .card(cardService.getCardById(winner.getCardDefinition().getId()))
            .category(category)
            .multiplier(multiplier)
            .reasoning(reasoning)
            .build();
    }

    private BigDecimal getMultiplier(UserWallet wallet, String category) {
        return wallet.getCardDefinition().getRewardRates().stream()
            .filter(r -> r.getCategory().equalsIgnoreCase(category))
            .findFirst()
            .map(CardRewardRate::getMultiplier)
            .orElse(BigDecimal.ONE); // Base rate 1.0 (assuming most cards have 1x base, or we should check 'Everything Else')
            // Optimally we check for specific "Everything Else" category if specific category fails, but 1.0 is safe fallback.
    }

    private boolean hasActiveBonus(UserWallet wallet, List<SignUpBonus> bonuses) {
        return bonuses.stream()
            .anyMatch(b -> b.getWallet().getId().equals(wallet.getId()) 
                        && b.getStatus() == BonusStatus.IN_PROGRESS);
    }
}
