import { ModeToggle } from "@/components/themes/mode-toggle";
import { FeaturedRecipes } from "./home/FeaturedRecipes";
import SearchBar from "./home/SearchBar";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <ModeToggle />
      <h1>foodapp</h1>
      <SearchBar />
      <FeaturedRecipes />
      {/* Future: Add CategoryBrowse, TimeCollections, etc. */}
    </div>
  );
} 
