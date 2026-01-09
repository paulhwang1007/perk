package com.perk.controller;

import com.perk.dto.BonusDto;
import com.perk.dto.CreateBonusDto;
import com.perk.dto.UpdateSpendDto;
import com.perk.service.BonusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bonuses")
@RequiredArgsConstructor
public class BonusController {

    private final BonusService bonusService;

    @GetMapping
    public ResponseEntity<List<BonusDto>> getBonuses(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(bonusService.getBonuses(userId));
    }

    @PostMapping
    public ResponseEntity<BonusDto> createBonus(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateBonusDto dto) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(bonusService.createBonus(userId, dto));
    }

    @PostMapping("/{id}/spend")
    public ResponseEntity<BonusDto> logSpend(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSpendDto dto) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(bonusService.logSpend(userId, id, dto.getAmount()));
    }
}
