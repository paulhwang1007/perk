package com.perk.entity;

import com.perk.entity.enums.ResetPeriod;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "benefit_trackers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BenefitTracker extends BaseEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id")
    private UserWallet wallet;

    @Column(name = "benefit_name", nullable = false)
    private String benefitName;

    @Enumerated(EnumType.STRING)
    @Column(name = "reset_period", nullable = false)
    private ResetPeriod resetPeriod;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "used_amount")
    @Builder.Default
    private BigDecimal usedAmount = BigDecimal.ZERO;

    @Column(name = "next_reset_date", nullable = false)
    private LocalDate nextResetDate;
}
