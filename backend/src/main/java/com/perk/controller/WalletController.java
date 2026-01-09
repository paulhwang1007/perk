package com.perk.controller;

import com.perk.dto.CreateWalletRecordDto;
import com.perk.dto.WalletDto;
import com.perk.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<List<WalletDto>> getWallet(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(walletService.getUserWallet(userId));
    }

    @PostMapping
    public ResponseEntity<WalletDto> addToWallet(
            @AuthenticationPrincipal Jwt jwt, 
            @Valid @RequestBody CreateWalletRecordDto dto) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(walletService.addCardToWallet(userId, dto));
    }
}
