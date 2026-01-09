"use client";

import { useQuery } from "@tanstack/react-query";
import { walletApi } from "@/lib/api/wallet";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  DollarSign,
  Gift,
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function DashboardPage() {
  const { data: cards, isLoading, error } = useQuery({
    queryKey: ["wallet"],
    queryFn: walletApi.getWallet,
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-red-500">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p>Failed to load dashboard. Please try again later.</p>
      </div>
    );
  }

  const activeCards = cards?.filter(c => c.isActive) || [];
  const totalCards = activeCards.length;
  const totalCreditLimit = activeCards.reduce((sum, c) => sum + (c.creditLimit || 0), 0);
  const activeBonuses = cards?.filter(c => c.hasActiveBonus)?.length || 0;
  
  // 5/24 Logic (Simplified count of cards opened in last 24 months)
  const today = new Date();
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(today.getFullYear() - 2);
  
  const cardsOpenedLast24Mo = (cards || []).filter(c => {
    const opened = new Date(c.openedDate);
    return opened >= twoYearsAgo;
  }).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your credit card portfolio at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-delay-1">
        <Card className="card-glow border-border/50 bg-card/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total Cards
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {totalCards}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow border-border/50 bg-card/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Credit Limit
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  ${totalCreditLimit.toLocaleString()}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow border-border/50 bg-card/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Active Bonuses
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {activeBonuses}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Gift className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow border-border/50 bg-card/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  5/24 Status
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {cardsOpenedLast24Mo}/5
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {Math.max(0, 5 - cardsOpenedLast24Mo)} slots remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Placeholder for Bonuses List */}
        <div className="lg:col-span-2 space-y-4 animate-fade-in-delay-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Active Sign-Up Bonuses
            </h2>
            <Link
              href="/wallet"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
               <div className="text-center py-8 border border-dashed border-border rounded-lg bg-card/30">
                 <p className="text-muted-foreground text-sm">Bonus tracking implementation pending.</p>
               </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 animate-fade-in-delay-3">
          {/* Quick Recommendation */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Quick Recommend
            </h2>
            <Card className="card-glow border-border/50 bg-card/50">
               <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
                  Smart recommendations coming soon
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
