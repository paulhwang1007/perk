package com.perk.service;

import com.perk.dto.BonusDto;
import com.perk.dto.CreateBonusDto;
import com.perk.entity.SignUpBonus;
import com.perk.entity.UserWallet;
import com.perk.entity.enums.BonusStatus;
import com.perk.repository.SignUpBonusRepository;
import com.perk.repository.UserWalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BonusService {

    private final SignUpBonusRepository bonusRepository;
    private final UserWalletRepository walletRepository;

    @Transactional(readOnly = true)
    public List<BonusDto> getBonuses(UUID userId) {
        return bonusRepository.findByWalletUserId(userId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public BonusDto createBonus(UUID userId, CreateBonusDto dto) {
        UserWallet wallet = walletRepository.findByIdAndUserId(dto.getWalletId(), userId)
            .orElseThrow(() -> new RuntimeException("Wallet not found or not owned by user"));

        SignUpBonus bonus = SignUpBonus.builder()
            .wallet(wallet)
            .requiredSpend(dto.getRequiredSpend())
            .deadline(dto.getDeadline())
            .bonusPoints(dto.getBonusPoints())
            .currentSpend(BigDecimal.ZERO)
            .status(BonusStatus.IN_PROGRESS)
            .build();

        return toDto(bonusRepository.save(bonus));
    }

    @Transactional
    public BonusDto logSpend(UUID userId, UUID bonusId, BigDecimal amount) {
        SignUpBonus bonus = bonusRepository.findByIdAndUserId(bonusId, userId)
            .orElseThrow(() -> new RuntimeException("Bonus not found"));

        bonus.setCurrentSpend(bonus.getCurrentSpend().add(amount));
        
        // Auto-complete if spend met
        if (bonus.getCurrentSpend().compareTo(bonus.getRequiredSpend()) >= 0) {
            bonus.setStatus(BonusStatus.COMPLETED);
        }

        return toDto(bonusRepository.save(bonus));
    }

    private BonusDto toDto(SignUpBonus entity) {
        return BonusDto.builder()
            .id(entity.getId())
            .walletId(entity.getWallet().getId())
            .requiredSpend(entity.getRequiredSpend())
            .deadline(entity.getDeadline())
            .bonusPoints(entity.getBonusPoints())
            .currentSpend(entity.getCurrentSpend())
            .status(entity.getStatus())
            .build();
    }
}
