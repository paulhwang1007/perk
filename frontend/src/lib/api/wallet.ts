import { authFetch } from "@/lib/api";
import { CardDefinition } from "./cards";

export interface WalletEntry {
  id: number;
  card: CardDefinition;
  openedDate: string;
  creditLimit?: number;
  nickname?: string;
  isActive: boolean;
  hasActiveBonus?: boolean;
}

export interface AddWalletEntryDto {
  cardDefinitionId: number;
  openedDate: string;
  creditLimit?: number;
  nickname?: string;
}

export const walletApi = {
  getWallet: async (): Promise<WalletEntry[]> => {
    return authFetch("/api/v1/wallet");
  },
  addCard: async (data: AddWalletEntryDto): Promise<WalletEntry> => {
    return authFetch("/api/v1/wallet", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  deleteCard: async (id: number): Promise<void> => {
    return authFetch(`/api/v1/wallet/${id}`, {
      method: "DELETE",
    });
  },
};
