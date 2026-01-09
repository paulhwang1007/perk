"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { authFetch } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { CreditCard, Plus } from "lucide-react"

interface WalletItem {
    id: string;
    card: {
        id: number;
        name: string;
        issuer: string;
        network: string;
        imageUrl?: string;
    };
    nickname?: string;
    creditLimit?: number;
    openedDate: string;
}

export default function WalletPage() {
    const { data: wallet, isLoading, error } = useQuery<WalletItem[]>({
        queryKey: ['wallet'],
        queryFn: () => authFetch('/wallet'),
    })

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading wallet...</div>
    }

    if (error) {
        return <div className="p-8 text-center text-destructive">Failed to load wallet. Please try again.</div>
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Wallet</h2>
                    <p className="text-muted-foreground">Manage your credit cards</p>
                </div>
                {/* Add Card Button (Placeholder for now) */}
                 <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    Add Card
                </button>
            </div>

            {wallet?.length === 0 ? (
                 <div className="p-12 text-center border rounded-lg bg-card/50 text-muted-foreground">
                    No cards in your wallet yet. Add one to get started!
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {wallet?.map((item) => (
                        <Card key={item.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base font-semibold">{item.card.name}</CardTitle>
                                {item.card.network === 'VISA' && <span className="font-mono text-xs font-bold text-blue-500">VISA</span>}
                                {item.card.network === 'AMEX' && <span className="font-mono text-xs font-bold text-blue-400">AMEX</span>}
                                {item.card.network === 'MASTERCARD' && <span className="font-mono text-xs font-bold text-orange-500">MC</span>}
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 pt-4">
                                     <div className="flex items-center gap-4">
                                         {item.card.imageUrl ? (
                                             // eslint-disable-next-line @next/next/no-img-element
                                             <img src={item.card.imageUrl} alt={item.card.name} className="h-12 w-20 object-cover rounded shadow-sm" />
                                         ) : (
                                              <div className="h-12 w-20 bg-muted rounded flex items-center justify-center">
                                                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                                              </div>
                                         )}
                                         <div>
                                             <p className="text-sm font-medium">{item.card.issuer}</p>
                                             {item.nickname && <p className="text-xs text-muted-foreground">"{item.nickname}"</p>}
                                         </div>
                                     </div>
                                     
                                     <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t">
                                        <div>
                                            <p className="text-muted-foreground text-xs">Limit</p>
                                            <p>${item.creditLimit?.toLocaleString()}</p>
                                        </div>
                                         <div className="text-right">
                                            <p className="text-muted-foreground text-xs">Opened</p>
                                            <p>{item.openedDate}</p>
                                        </div>
                                     </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
