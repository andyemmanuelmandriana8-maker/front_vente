import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, ShoppingCart, UserCircle, FileText } from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/pages/dashboard",
  },
  {
    title: "Produits",
    icon: Package,
    href: "/pages/produits",
  },
  {
    title: "Commandes",
    icon: ShoppingCart,
    href: "/pages/commandes",
  },
  {
    title: "Clients",
    icon: UserCircle,
    href: "/pages/clients",
  },
  {
    title: "Factures",
    icon: FileText,
    href: "/pages/factures",
  },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 h-full border-r bg-background">
      <div className="flex h-full flex-col gap-2 p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

