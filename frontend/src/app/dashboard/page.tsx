import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, DollarSign, Gift, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Your credit card portfolio at a glance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Limit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bonuses</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">5/24 Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3/5</div>
            <p className="text-xs text-muted-foreground">2 slots remaining</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Active Sign-up Bonuses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {/* Placeholder for bonus item */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md" />
                        <div>
                            <p className="font-medium">Amex Gold Card</p>
                            <p className="text-sm text-muted-foreground">60,000 points bonus</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs bg-secondary px-2 py-1 rounded">85d left</span>
                    </div>
                </div>
                {/* Progress bar would go here */}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Recommend</CardTitle>
            {/* Category selection chips could go here */}
          </CardHeader>
          <CardContent>
             <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                Smart recommendations coming soon
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
