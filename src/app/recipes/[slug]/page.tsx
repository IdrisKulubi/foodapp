import { getRecipeBySlug } from '@/lib/actions/recipe.actions'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { Clock, Users, Star, Utensils, Share2 } from 'lucide-react'

interface RecipeDetailPageProps {
  params: { slug: string }
}

export default async function RecipeDetailPage({ params }: RecipeDetailPageProps) {
  const recipe = await getRecipeBySlug(params.slug)

  if (!recipe) {
    notFound()
  }

  // Format cooking times
  const prepTimeText = recipe.prepTime ? `${recipe.prepTime} mins` : '—'
  const cookTimeText = recipe.cookTime ? `${recipe.cookTime} mins` : '—'
  const totalTimeText = recipe.totalTime ? `${recipe.totalTime} mins` : '—'
  const servingsText = recipe.servings || '—'

  

  return (
    <main className="min-h-[100dvh] py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header with title and media */}
        <header className="mb-8">
          {/* Recipe title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{recipe.title}</h1>
          
          {/* Recipe attributes */}
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.featured && <Badge variant="secondary">Featured</Badge>}
            {recipe.trending && <Badge variant="default">Trending</Badge>}
            {/* Add more attributes like cuisine, dietary info, etc. if available */}
          </div>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8">{recipe.description}</p>
          
          {/* Hero image */}
          <div className="w-full rounded-2xl overflow-hidden mb-8 shadow-xl relative aspect-[16/10]">
            {recipe.images && recipe.images.length > 0 ? (
              <Image 
                src={recipe.images[0]} 
                alt={recipe.title} 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <span className="text-6xl">🍽️</span>
              </div>
            )}
          </div>
        </header>

        {/* Recipe metadata and quick info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 bg-muted/20 rounded-xl p-6 border">
          <div className="flex flex-col items-center text-center gap-1">
            <Clock className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm text-muted-foreground">Prep Time</span>
            <span className="font-semibold">{prepTimeText}</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <Utensils className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm text-muted-foreground">Cook Time</span>
            <span className="font-semibold">{cookTimeText}</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <Clock className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm text-muted-foreground">Total Time</span>
            <span className="font-semibold">{totalTimeText}</span>
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <Users className="h-5 w-5 text-primary mb-1" />
            <span className="text-sm text-muted-foreground">Servings</span>
            <span className="font-semibold">{servingsText}</span>
          </div>
        </div>

        {/* Main content: ingredients and instructions */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* Ingredients column */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-block w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">1</span>
              Ingredients
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2"></span>
                    <span>
                      <span className="font-medium">{ingredient.quantity} {ingredient.unit || ''}</span> {ingredient.name}
                      {ingredient.note && <span className="text-muted-foreground text-sm block"> ({ingredient.note})</span>}
                    </span>
                  </li>
                ))
              ) : (
                <li className="italic text-muted-foreground">Ingredients not available</li>
              )}
            </ul>
          </div>

          {/* Instructions column */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="inline-block w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">2</span>
              Preparation Steps
            </h2>
            <ol className="space-y-6">
              {recipe.steps && Array.isArray(recipe.steps) && recipe.steps.length > 0 ? (
                [...recipe.steps].sort((a, b) => a.order - b.order).map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 inline-block w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">{index + 1}</span>
                    <div>
                      <p>{step.description}</p>
                      {step.imageUrl && (
                        <div className="mt-3 rounded-lg overflow-hidden">
                          <Image 
                            src={step.imageUrl} 
                            alt={`Step ${index + 1}`} 
                            width={400} 
                            height={300}
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))
              ) : recipe.instructions ? (
                <li className="italic">
                  <p>{recipe.instructions}</p>
                </li>
              ) : (
                <li className="italic text-muted-foreground">Instructions not available</li>
              )}
            </ol>
          </div>
        </div>

        {/* Additional images */}
        {recipe.images && recipe.images.length > 1 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">More Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {recipe.images.slice(1).map((image, index) => (
                <div key={index} className="w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image}
                    alt={`${recipe.title} - image ${index + 2}`}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes and tips */}
        {recipe.notes && (
          <div className="mt-12 bg-muted/20 rounded-xl p-6 border">
            <h2 className="text-xl font-bold mb-4">Notes & Tips</h2>
            <p>{recipe.notes}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Button variant="default" size="lg">
            <Star className="mr-2 h-4 w-4" /> Save Recipe
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Link href="/recipes">
            <Button variant="secondary" size="lg">Browse More Recipes</Button>
          </Link>
        </div>
      </div>
    </main>
  )
} 