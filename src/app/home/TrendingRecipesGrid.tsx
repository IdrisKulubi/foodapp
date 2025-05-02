import Image from "next/image";
import Link from "next/link";
import { getTrendingRecipes, getMostSavedRecipes } from "@/lib/actions/recipe.actions";

export default async function TrendingRecipesGrid() {
  let trending = await getTrendingRecipes(12);
  if (!trending || trending.length === 0) {
    const fallback = await getMostSavedRecipes(12);
    trending = fallback.map(r => ({
      id: String(r.id),
      title: String(r.title),
      slug: String(r.slug),
      description: r.description ? String(r.description) : null,
      createdAt: r.createdAt ? new Date(r.createdAt as string) : new Date(),
      updatedAt: r.updatedAt ? new Date(r.updatedAt as string) : new Date(),
      publishedAt: r.publishedAt ? new Date(r.publishedAt as string) : null,
      published: !!r.published,
      featured: !!r.featured,
      trending: !!r.trending,
      prepTime: typeof r.prepTime === 'number' ? r.prepTime : r.prepTime ? Number(r.prepTime) : null,
      cookTime: typeof r.cookTime === 'number' ? r.cookTime : r.cookTime ? Number(r.cookTime) : null,
      totalTime: typeof r.totalTime === 'number' ? r.totalTime : r.totalTime ? Number(r.totalTime) : null,
      servings: typeof r.servings === 'number' ? r.servings : r.servings ? Number(r.servings) : null,
      difficultyLevel: r.difficultyLevel ? String(r.difficultyLevel) : "",
      images: Array.isArray(r.images) ? r.images : [],
    }));
  }
  if (!trending || trending.length === 0) return null;

  return (
    <section className="w-full max-w-5xl mx-auto py-12">
      <h2 className="text-2xl md:text-3xl font-extrabold text-orange-100 mb-8 text-center drop-shadow-lg">
        Trending Recipes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {trending.map(recipe => (
          <div key={recipe.id} className="bg-zinc-900/80 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden flex flex-col items-center">
            <div className="relative w-full aspect-[16/9] bg-zinc-800">
              <Image
                src={recipe.images && recipe.images.length > 0 ? recipe.images[0] : "/none.jpg"}
                alt={recipe.title}
                fill
                className="object-cover rounded-t-2xl"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
            <div className="px-2 pt-2 pb-3 flex flex-col items-center gap-1 w-full">
              <h3 className="font-semibold text-xs md:text-sm text-orange-100 text-center line-clamp-1">
                {recipe.title}
              </h3>
              <p className="text-orange-200 text-[10px] md:text-xs text-center line-clamp-2">
                {recipe.description}
              </p>
              <Link href={`/recipes/${recipe.slug}`} className="mt-1 px-2 py-1 rounded-full bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 transition text-[10px] md:text-xs">
                View Recipe
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 