import { getPaginatedRecipes } from '@/lib/actions/recipe.actions'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default async function RecipesIndexPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse page and pageSize with fallbacks
  const page = Math.max(1, Number(searchParams.page) || 1)
  const pageSize = 12
  
  // Get all published recipes
  const { recipes, total } = await getPaginatedRecipes({
    page,
    pageSize,
    filter: 'published',
    sortDir: 'desc',
  })

  // Calculate pagination
  const totalPages = Math.ceil(total / pageSize)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return (
    <main className="min-h-[100dvh] py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Recipes</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of delicious recipes, from quick weeknight dinners to impressive party dishes.
          </p>
        </header>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map(recipe => (
            <Link 
              key={recipe.id} 
              href={`/recipes/${recipe.slug}`}
              className="group block bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-border"
            >
              {/* Recipe Image */}
              <div className="aspect-[4/3] relative bg-muted">
                {recipe.images && recipe.images.length > 0 ? (
                  <Image 
                    src={recipe.images[0]}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-5xl opacity-30 group-hover:scale-110 transition-transform">🍲</span>
                  </div>
                )}
              </div>

              {/* Recipe Details */}
              <div className="p-4">
                <div className="flex items-start gap-2 mb-2">
                  <h2 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-1 flex-1">
                    {recipe.title}
                  </h2>
                  <div className="flex gap-1">
                    {recipe.trending && <Badge variant="default">Trending</Badge>}
                    {recipe.featured && <Badge variant="secondary">Featured</Badge>}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {recipe.description || 'No description available'}
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>{recipe.totalTime ? `${recipe.totalTime} mins` : 'Quick recipe'}</span>
                  <span className="text-primary font-medium group-hover:underline">View Recipe →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No recipes message */}
        {recipes.length === 0 && (
          <div className="flex flex-col items-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-semibold mb-2">No recipes found</h2>
            <p className="text-muted-foreground mb-6">We'll be adding more recipes soon!</p>
            <Link href="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {recipes.length > 0 && (
          <div className="mt-12 flex justify-center gap-2">
            {hasPrevPage && (
              <Link href={`/recipes?page=${page - 1}`}>
                <Button variant="outline">Previous</Button>
              </Link>
            )}
            <span className="px-4 py-2 bg-muted rounded-md font-medium">
              Page {page} of {totalPages}
            </span>
            {hasNextPage && (
              <Link href={`/recipes?page=${page + 1}`}>
                <Button variant="outline">Next</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  )
} 