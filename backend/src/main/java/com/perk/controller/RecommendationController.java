package com.perk.controller;

import com.perk.dto.RecommendationDto;
import com.perk.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recommend")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping
    public ResponseEntity<RecommendationDto> getRecommendation(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam String category) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(recommendationService.getBestCard(userId, category));
    }

    // TODO: Move Insights to separate controller or service if it grows
}
