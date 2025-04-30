import db from "@/db/drizzle";
import Image from "next/image";

export async function FeaturedRecipes() {
  // Fetch top 6 featured or trending recipes
  const featured = await db.query.recipes.findMany({
    where: (recipe, { eq, or }) =>
      or(eq(recipe.featured, true), eq(recipe.published, true)),
    limit: 6,
    orderBy: (recipe, { desc }) => [desc(recipe.createdAt)],
  });

  return (
    <section className="w-full max-w-5xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Featured Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {featured.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-card rounded-lg shadow-md overflow-hidden flex flex-col"
          >
            <div className="relative aspect-video bg-muted">
              {/* Placeholder for image */}
              <Image
                src={recipe.slug || "/placeholder.jpg"}
                alt={recipe.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {recipe.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-2">
                {recipe.description}
              </p>
              {/* Add more meta info as needed */}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 