"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletApi, WalletEntry } from "@/lib/api/wallet";
import { cardsApi } from "@/lib/api/cards";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Plus,
  Calendar,
  DollarSign,
  MoreVertical,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export default function WalletPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: cards, isLoading, error } = useQuery({
    queryKey: ["wallet"],
    queryFn: walletApi.getWallet,
  });

  const deleteMutation = useMutation({
    mutationFn: walletApi.deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
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
        <p>Failed to load wallet. Please try again later.</p>
      </div>
    );
  }

  const activeCards = cards?.filter((c) => c.isActive) || [];
  const inactiveCards = cards?.filter((c) => !c.isActive) || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Wallet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your credit cards and track their status
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Card to Wallet</DialogTitle>
              <DialogDescription>
                Add a new credit card to your portfolio to track rewards and benefits.
              </DialogDescription>
            </DialogHeader>
            <AddCardForm onClose={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {(!cards || cards.length === 0) && (
        <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card/50">
          <p className="text-muted-foreground mb-4">You have no cards in your wallet yet.</p>
          <Button variant="outline" onClick={() => setIsAddDialogOpen(true)}>
            Add your first card
          </Button>
        </div>
      )}

      {/* Active Cards */}
      {activeCards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Active Cards
            </h2>
            <Badge variant="secondary" className="text-xs">
              {activeCards.length}
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeCards.map((card) => (
              <WalletCard 
                key={card.id} 
                card={card} 
                onDelete={() => deleteMutation.mutate(card.id)} 
              />
            ))}
          </div>
        </div>
      )}

      {/* Inactive Cards */}
      {inactiveCards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Inactive Cards
            </h2>
            <Badge variant="secondary" className="text-xs">
              {inactiveCards.length}
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inactiveCards.map((card) => (
              <WalletCard 
                key={card.id} 
                card={card} 
                onDelete={() => deleteMutation.mutate(card.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface WalletCardProps {
  card: WalletEntry;
  onDelete: () => void;
}

function WalletCard({ card, onDelete }: WalletCardProps) {
  const openedDate = new Date(card.openedDate);
  const formattedDate = openedDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
  
  const gradient = getCardGradient(card.card.issuer, card.card.network);

  return (
    <Card
      className={`card-glow overflow-hidden border-border/50 bg-card/50 transition-opacity ${
        !card.isActive ? "opacity-60" : ""
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <CreditCardVisual
            cardName={card.card.name}
            gradient={gradient}
            size="sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{card.nickname || card.card.name}</h3>
            {card.hasActiveBonus && (
              <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-0 text-[10px] px-1.5">
                SUB
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{card.card.issuer}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Opened
            </p>
            <p className="mt-0.5 font-medium">{formattedDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Limit
            </p>
            <p className="mt-0.5 font-medium tabular-nums">
              ${card.creditLimit?.toLocaleString() ?? 0}
            </p>
          </div>
        </div>

        {card.card.annualFee > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              ${card.card.annualFee}/year annual fee
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddCardForm({ onClose }: { onClose: () => void }) {
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [openedDate, setOpenedDate] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [nickname, setNickname] = useState("");
  
  const queryClient = useQueryClient();

  const { data: availableCards } = useQuery({
    queryKey: ["card-definitions"],
    queryFn: cardsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: walletApi.addCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCardId || !openedDate) return;

    createMutation.mutate({
      cardDefinitionId: parseInt(selectedCardId),
      openedDate,
      creditLimit: creditLimit ? parseFloat(creditLimit) : undefined,
      nickname: nickname || undefined,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="cardName">Select Card</Label>
        <select 
          id="cardName"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedCardId}
          onChange={(e) => setSelectedCardId(e.target.value)}
          required
        >
          <option value="">Select a card...</option>
          {availableCards?.map((card) => (
            <option key={card.id} value={card.id}>
              {card.name} ({card.network})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="openedDate">Opened Date</Label>
          <Input 
            id="openedDate" 
            type="date" 
            className="bg-secondary/50"
            value={openedDate}
            onChange={(e) => setOpenedDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="creditLimit">Credit Limit</Label>
          <Input
            id="creditLimit"
            type="number"
            placeholder="10000"
            className="bg-secondary/50"
            value={creditLimit}
            onChange={(e) => setCreditLimit(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nickname">Nickname (optional)</Label>
        <Input
          id="nickname"
          placeholder="e.g., Daily driver"
          className="bg-secondary/50"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Adding..." : "Add Card"}
        </Button>
      </div>
    </form>
  );
}
