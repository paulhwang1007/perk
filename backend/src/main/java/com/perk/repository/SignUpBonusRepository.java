package com.perk.repository;

import com.perk.entity.SignUpBonus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SignUpBonusRepository extends JpaRepository<SignUpBonus, UUID> {
    List<SignUpBonus> findByWalletUserId(UUID userId);
    
    // Ensure we can only access bonuses belonging to the user's wallet
    @Query("SELECT b FROM SignUpBonus b WHERE b.id = :id AND b.wallet.userId = :userId")
    Optional<SignUpBonus> findByIdAndUserId(UUID id, UUID userId);
}
