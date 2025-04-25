import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerClient } from "@/lib/supabase"

export default async function DashboardPage() {
  const supabase = createServerClient()
  
  // Get counts from database
  const [
    { count: ingredientsCount },
    { count: recipesCount },
    { count: packetsCount }
  ] = await Promise.all([
    supabase.from('ingredients').select('*', { count: 'exact', head: true }),
    supabase.from('recipes').select('*', { count: 'exact', head: true }),
    supabase.from('packets').select('*', { count: 'exact', head: true })
  ])
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Costify 2.0, your recipe and pricing management system
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingredients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ingredientsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total ingredients in your database
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recipes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recipesCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total recipes available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Packets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{packetsCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total packets configured
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to set up your catering business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Add ingredients with their costs</li>
              <li>Create recipes using your ingredients</li>
              <li>Bundle recipes into packets</li>
              <li>Create quotes with custom markups</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 