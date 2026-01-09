package com.perk.entity;

import com.perk.entity.enums.CardNetwork;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "card_definitions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardDefinition extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String issuer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardNetwork network;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "annual_fee")
    private BigDecimal annualFee;

    // One CardDefinition has many RewardRates
    @OneToMany(mappedBy = "cardDefinition", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CardRewardRate> rewardRates = new ArrayList<>();
}
