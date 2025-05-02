import HeroSection from "@/components/shared/home/hero";
import FeaturedRecipes from "./home/FeaturedRecipes";
import TrendingRecipesGrid from "./home/TrendingRecipesGrid";
import HowItWorksSection from "./home/HowItWorksSection";
import NewsletterSignupSection from "./home/NewsletterSignupSection";
import FooterSection from "./home/FooterSection";
import SectionSeparator from "./home/SectionSeparator";


export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 dark:from-zinc-950 dark:to-zinc-900">
      <HeroSection />
      <SectionSeparator />
      <FeaturedRecipes />
      <SectionSeparator />
      <TrendingRecipesGrid />
      <SectionSeparator />
      <HowItWorksSection />
      <SectionSeparator />
      <NewsletterSignupSection />
      <SectionSeparator />
      <FooterSection />
    </main>
  );
} 
