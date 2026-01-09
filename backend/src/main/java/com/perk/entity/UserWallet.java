package com.perk.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "user_wallet", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "card_definition_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserWallet extends BaseEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_definition_id")
    private CardDefinition cardDefinition;

    @Column(name = "opened_date", nullable = false)
    private LocalDate openedDate;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    private String nickname;

    @Column(name = "credit_limit")
    private BigDecimal creditLimit;
}
