package com.perk.controller;

import com.perk.dto.BenefitDto;
import com.perk.dto.CreateBenefitDto;
import com.perk.dto.UpdateSpendDto;
import com.perk.service.BenefitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/benefits")
@RequiredArgsConstructor
public class BenefitController {

    private final BenefitService benefitService;

    @GetMapping
    public ResponseEntity<List<BenefitDto>> getBenefits(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(benefitService.getBenefits(userId));
    }

    @PostMapping
    public ResponseEntity<BenefitDto> createBenefit(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateBenefitDto dto) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(benefitService.createBenefit(userId, dto));
    }

    @PostMapping("/{id}/use")
    public ResponseEntity<BenefitDto> useBenefit(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSpendDto dto) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(benefitService.useBenefit(userId, id, dto.getAmount()));
    }
}
