package com.perk.service;

import com.perk.dto.BenefitDto;
import com.perk.dto.CreateBenefitDto;
import com.perk.entity.BenefitTracker;
import com.perk.entity.UserWallet;
import com.perk.repository.BenefitTrackerRepository;
import com.perk.repository.UserWalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BenefitService {

    private final BenefitTrackerRepository benefitRepository;
    private final UserWalletRepository walletRepository;

    @Transactional(readOnly = true)
    public List<BenefitDto> getBenefits(UUID userId) {
        return benefitRepository.findByWalletUserId(userId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public BenefitDto createBenefit(UUID userId, CreateBenefitDto dto) {
        UserWallet wallet = walletRepository.findByIdAndUserId(dto.getWalletId(), userId)
            .orElseThrow(() -> new RuntimeException("Wallet not found or not owned by user"));

        BenefitTracker benefit = BenefitTracker.builder()
            .wallet(wallet)
            .benefitName(dto.getBenefitName())
            .resetPeriod(dto.getResetPeriod())
            .totalAmount(dto.getTotalAmount())
            .usedAmount(Optional.ofNullable(dto.getUsedAmount()).orElse(BigDecimal.ZERO))
            .nextResetDate(dto.getNextResetDate())
            .build();

        return toDto(benefitRepository.save(benefit));
    }

    @Transactional
    public BenefitDto useBenefit(UUID userId, UUID benefitId, BigDecimal amount) {
        BenefitTracker benefit = benefitRepository.findByIdAndUserId(benefitId, userId)
            .orElseThrow(() -> new RuntimeException("Benefit tracker not found"));

        benefit.setUsedAmount(benefit.getUsedAmount().add(amount));
        
        // Could add validation if used > total, but sometimes people overspend

        return toDto(benefitRepository.save(benefit));
    }

    private BenefitDto toDto(BenefitTracker entity) {
        return BenefitDto.builder()
            .id(entity.getId())
            .walletId(entity.getWallet().getId())
            .benefitName(entity.getBenefitName())
            .resetPeriod(entity.getResetPeriod())
            .totalAmount(entity.getTotalAmount())
            .usedAmount(entity.getUsedAmount())
            .nextResetDate(entity.getNextResetDate())
            .build();
    }
}
