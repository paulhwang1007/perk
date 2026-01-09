package com.perk.repository;

import com.perk.entity.CardDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CardDefinitionRepository extends JpaRepository<CardDefinition, Long> {
    List<CardDefinition> findByNameContainingIgnoreCaseOrIssuerContainingIgnoreCase(String name, String issuer);
}
