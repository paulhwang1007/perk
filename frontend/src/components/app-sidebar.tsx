"use client"

import { LayoutDashboard, Wallet, Sparkles, CreditCard, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Wallet, label: "Wallet", href: "/wallet" },
  { icon: Sparkles, label: "Recommend", href: "/recommend" },
  { icon: CreditCard, label: "All Cards", href: "/cards" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
      await supabase.auth.signOut()
      router.push("/login")
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card text-card-foreground">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-primary">Perk</span>
        </h1>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log Out
          </Button>
      </div>
    </div>
  )
}
