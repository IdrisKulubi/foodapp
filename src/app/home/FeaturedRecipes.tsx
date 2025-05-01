import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { getFeaturedRecipes } from "@/lib/actions/recipe.actions";

export default async function FeaturedRecipes() {
  // Fetch top 6 featured or trending recipes using server action
  const featured = await getFeaturedRecipes();

  return (
    <section className="w-full max-w-5xl mx-auto py-12">
      <h2 className="text-2xl md:text-3xl font-extrabold text-orange-100 mb-8 text-center drop-shadow-lg">
        Featured Recipes
      </h2>
      <div className="relative">
        <Carousel
          className=""
          opts={{
            align: "start",
            slidesToScroll: 1,
            breakpoints: {
              640: { slidesToScroll: 1 }, 
              768: { slidesToScroll: 2 },
              1024: { slidesToScroll: 3 }, 
            },
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featured.map((recipe) => (
              <CarouselItem
                key={recipe.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <div className="bg-zinc-900/80 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden flex flex-col items-center">
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 md:-left-12" />
          <CarouselNext className="-right-4 md:-right-12" />
        </Carousel>
      </div>
    </section>
  );
} 