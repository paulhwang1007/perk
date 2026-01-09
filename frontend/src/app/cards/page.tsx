"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cardsApi, CardDefinition } from "@/lib/api/cards";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Star,
  DollarSign,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { CreditCardVisual } from "@/components/credit-card-visual";

// Helper function
function getCardGradient(issuer: string = "", network: string = ""): string {
  const i = issuer.toLowerCase();
  if (i.includes("chase")) return "from-blue-600 to-blue-800";
  if (i.includes("amex") || i.includes("american")) return "from-amber-500 to-amber-700";
  if (i.includes("citi")) return "from-cyan-600 to-cyan-800";
  if (i.includes("discover")) return "from-orange-500 to-orange-700";
  if (i.includes("capital")) return "from-slate-500 to-slate-700";
  if (i.includes("wells")) return "from-red-600 to-red-800";
  return "from-slate-600 to-slate-800";
}

const issuers = ["All", "Chase", "American Express", "Citi", "Capital One", "Discover"];

export default function CardsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssuer, setSelectedIssuer] = useState("All");

  const { data: allCards, isLoading, error } = useQuery({
    queryKey: ["cards", "all"],
    queryFn: cardsApi.getAll,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-red-500">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>Failed to load cards. Please try again later.</p>
      </div>
    );
  }

  const filteredCards = (allCards || []).filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIssuer =
      selectedIssuer === "All" || card.issuer.toLowerCase().includes(selectedIssuer.toLowerCase());
    return matchesSearch && matchesIssuer;
  });

  const popularNames = ["Sapphire Preferred", "Gold", "Platinum", "Venture X"];
  
  const popularCards = filteredCards.filter((c) => 
    popularNames.some(p => c.name.includes(p))
  );
  
  const otherCards = filteredCards.filter((c) => 
    !popularNames.some(p => c.name.includes(p))
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">All Cards</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse available credit cards database
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center animate-fade-in-delay-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary/50"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {issuers.map((issuer) => (
            <Button
              key={issuer}
              variant={selectedIssuer === issuer ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedIssuer(issuer)}
              className="shrink-0"
            >
              {issuer}
            </Button>
          ))}
        </div>
      </div>

      {filteredCards.length === 0 && (
         <div className="py-12 text-center border border-dashed border-border rounded-lg">
           <p className="text-muted-foreground">No cards found matching your search.</p>
         </div>
      )}

      {/* Popular Cards */}
      {popularCards.length > 0 && (
        <div className="space-y-4 animate-fade-in-delay-2">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Popular Cards
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularCards.map((card) => (
              <CardListItem key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}

      {/* Other Cards */}
      {otherCards.length > 0 && (
        <div className="space-y-4 animate-fade-in-delay-3">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {popularCards.length > 0 ? "Other Cards" : "Results"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherCards.map((card) => (
              <CardListItem key={card.id} card={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface CardListItemProps {
  card: CardDefinition;
}

function CardListItem({ card }: CardListItemProps) {
  const gradient = getCardGradient(card.issuer, card.network);
  const topRewardKey = card.rewardRates && Object.keys(card.rewardRates).reduce((a, b) => 
    card.rewardRates[a] > card.rewardRates[b] ? a : b
  , Object.keys(card.rewardRates)[0] || "");
  
  const topRewardVal = card.rewardRates ? card.rewardRates[topRewardKey] : 0;

  return (
    <Card className="card-glow overflow-hidden border-border/50 bg-card/50">
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Card Visual */}
          <div className="shrink-0">
            <CreditCardVisual
              cardName={card.name}
              gradient={gradient}
              size="sm"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium truncate">{card.name}</h3>
                <p className="text-sm text-muted-foreground">{card.issuer}</p>
              </div>
            </div>

            {/* Rewards */}
            <div className="mt-3 flex flex-wrap gap-1.5">
               {topRewardKey && (
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    {topRewardVal}x {topRewardKey}
                  </Badge>
               )}
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {card.annualFee > 0 ? `$${card.annualFee}/yr` : "No fee"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
