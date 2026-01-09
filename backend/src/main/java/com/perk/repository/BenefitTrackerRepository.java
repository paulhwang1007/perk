package com.perk.repository;

import com.perk.entity.BenefitTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BenefitTrackerRepository extends JpaRepository<BenefitTracker, UUID> {
    List<BenefitTracker> findByWalletUserId(UUID userId);

    @Query("SELECT b FROM BenefitTracker b WHERE b.id = :id AND b.wallet.userId = :userId")
    Optional<BenefitTracker> findByIdAndUserId(UUID id, UUID userId);
}
