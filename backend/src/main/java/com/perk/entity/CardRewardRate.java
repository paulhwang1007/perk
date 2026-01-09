package com.perk.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "card_reward_rates", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"card_definition_id", "category"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardRewardRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_definition_id", nullable = false)
    private CardDefinition cardDefinition;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal multiplier;
}
