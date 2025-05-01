import HeroSection from "@/components/shared/home/hero";
import FeaturedRecipes from "./home/FeaturedRecipes";
// import { FeaturedRecipes } from "./home/FeaturedRecipes";
// import SearchBar from "./home/SearchBar";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 dark:from-zinc-950 dark:to-zinc-900">
      <HeroSection />
      <FeaturedRecipes />
      {/* Search & Explore Section */}
      {/* <SearchBar /> */}
      {/* Trending Recipes Grid */}
      {/* Categories/Tags Showcase */}
      {/* How It Works / Value Props */}
      {/* Community/Stats */}
      {/* Newsletter Signup */}
      {/* Footer */}
    </main>
  );
} 
