import { authFetch } from "@/lib/api";

export interface CardDefinition {
  id: number;
  name: string;
  issuer: string;
  network: string;
  imageUrl?: string;
  annualFee: number;
  rewardRates: Record<string, number>;
}

export const cardsApi = {
  getAll: async (): Promise<CardDefinition[]> => {
    return authFetch("/api/v1/cards");
  },
  getById: async (id: number): Promise<CardDefinition> => {
    return authFetch(`/api/v1/cards/${id}`);
  },
};
