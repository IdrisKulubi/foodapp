import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllRecipes } from "@/lib/actions/recipe.actions"
import { getAllCategories } from "@/lib/actions/category.actions"
import { getAllTags } from "@/lib/actions/tag.actions"
import StatsClient from "./StatsClient"

export default async function AdminDashboardPage() {
  // Fetch statistics
  const recipes = await getAllRecipes()
  const categories = await getAllCategories()
  const tags = await getAllTags()

  // Calculate stats
  const publishedRecipes = recipes.filter(r => r.published).length
  const featuredRecipes = recipes.filter(r => r.featured).length
  const draftRecipes = recipes.filter(r => !r.published).length
  
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="relative overflow-hidden rounded-3xl border shadow-2xl bg-gradient-to-br from-primary/5 to-background mb-12 dark:bg-gradient-to-br dark:from-primary/20 dark:to-background/80">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-muted/30 rounded-full blur-3xl" />
        <div className="relative p-8 md:p-12 lg:p-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-3xl">
            Welcome to your culinary command center. Manage your recipes, categories, and tags with ease.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatsCard 
          title="Total Recipes"
          value={recipes.length}
          description="recipes in database"
          icon="🍲"
          trending={recipes.length > 0 ? "up" : "neutral"}
        />
        <StatsCard 
          title="Published"
          value={publishedRecipes}
          description="live on site"
          icon="📡"
          trending={publishedRecipes > 0 ? "up" : "neutral"}
        />
        <StatsCard 
          title="Categories"
          value={categories.length}
          description="recipe categories"
          icon="📂"
          trending="neutral"
        />
        <StatsCard 
          title="Tags"
          value={tags.length}
          description="unique tags"
          icon="🏷️"
          trending="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Recipe Status</CardTitle>
            <CardDescription>Distribution of recipe statuses</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <StatsClient 
              publishedCount={publishedRecipes}
              featuredCount={featuredRecipes}
              draftCount={draftRecipes}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Shortcuts to common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <QuickActionLink 
                href="/admin/recipes/new" 
                label="Create New Recipe" 
                icon="✨" 
                color="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              />
              <QuickActionLink 
                href="/admin/recipes" 
                label="Manage Recipes" 
                icon="📋" 
                color="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              />
              <QuickActionLink 
                href="/admin/categories" 
                label="Manage Categories" 
                icon="🗂️" 
                color="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300"
              />
              <QuickActionLink 
                href="/admin/tags" 
                label="Manage Tags" 
                icon="🔖" 
                color="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Server components for stats cards and quick links
function StatsCard({ title, value, description, icon, trending }: { 
  title: string; 
  value: number; 
  description: string; 
  icon: string;
  trending: "up" | "down" | "neutral";
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="text-3xl">{icon}</div>
        </div>
        <div className="mt-4 flex items-center text-xs">
          {trending === "up" && (
            <span className="text-emerald-500 flex items-center">
              ↑ Trending up
            </span>
          )}
          {trending === "down" && (
            <span className="text-rose-500 flex items-center">
              ↓ Trending down
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionLink({ href, label, icon, color }: { href: string; label: string; icon: string; color: string }) {
  return (
    <a 
      href={href}
      className="flex items-center p-3 rounded-xl transition-colors hover:bg-accent group"
    >
      <span className={`w-12 h-12 flex items-center justify-center rounded-xl mr-4 ${color}`}>
        <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
      </span>
      <span className="font-medium">{label}</span>
    </a>
  )
} 