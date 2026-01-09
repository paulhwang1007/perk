package com.perk.entity;

import com.perk.entity.enums.BonusStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "sign_up_bonuses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpBonus extends BaseEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id")
    private UserWallet wallet;

    @Column(name = "required_spend", nullable = false)
    private BigDecimal requiredSpend;

    @Column(nullable = false)
    private LocalDate deadline;

    @Column(name = "bonus_points", nullable = false)
    private Integer bonusPoints;

    @Column(name = "current_spend")
    @Builder.Default
    private BigDecimal currentSpend = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BonusStatus status = BonusStatus.IN_PROGRESS;
}
