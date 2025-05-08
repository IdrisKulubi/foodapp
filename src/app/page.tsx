import HeroSection from "@/components/shared/home/hero";
import FeaturedRecipes from "./home/FeaturedRecipes";
import TrendingRecipesGrid from "./home/TrendingRecipesGrid";
import HowItWorksSection from "./home/HowItWorksSection";
import NewsletterSignupSection from "./home/NewsletterSignupSection";
import FooterSection from "./home/FooterSection";
import SectionSeparator from "./home/SectionSeparator";
import GoogleAd from "@/components/GoogleAd";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 dark:from-zinc-950 dark:to-zinc-900">
      <HeroSection />
      <SectionSeparator />
      <FeaturedRecipes />
      <SectionSeparator />
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <GoogleAd 
          adSlot="1234567890"
          className="min-h-[250px] w-full"
          adFormat="rectangle"
        />
      </div>
      <SectionSeparator />
      <TrendingRecipesGrid />
      <SectionSeparator />
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <GoogleAd 
          adSlot="0987654321"
          className="min-h-[250px] w-full"
          adFormat="rectangle"
        />
      </div>
      <SectionSeparator />
      <HowItWorksSection />
      <SectionSeparator />
      <NewsletterSignupSection />
      <SectionSeparator />
      <FooterSection />
    </main>
  );
} 
