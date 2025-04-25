import { ReactNode } from 'react'
import Link from 'next/link'
import { Home, Package, BookOpen, Fridge, ShoppingCart } from 'lucide-react'

// Dashboard navigation items
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Ingredients', href: '/dashboard/ingredients', icon: Fridge },
  { name: 'Recipes', href: '/dashboard/recipes', icon: BookOpen },
  { name: 'Packets', href: '/dashboard/packets', icon: Package },
  { name: 'Quotes', href: '/dashboard/quotes', icon: ShoppingCart },
]

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 md:flex-shrink-0 border-r border-border bg-card">
        <div className="sticky top-0 p-4">
          <div className="mb-8">
            <h1 className="text-xl font-bold">Costify 2.0</h1>
            <p className="text-muted-foreground text-sm">Catering quotation tool</p>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-6 bg-background">
        {children}
      </main>
    </div>
  )
} 