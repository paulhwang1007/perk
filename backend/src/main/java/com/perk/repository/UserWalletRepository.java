package com.perk.repository;

import com.perk.entity.UserWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserWalletRepository extends JpaRepository<UserWallet, UUID> {
    List<UserWallet> findByUserId(UUID userId);
    Optional<UserWallet> findByIdAndUserId(UUID id, UUID userId);
    boolean existsByUserIdAndCardDefinitionId(UUID userId, Long cardDefinitionId);
}
