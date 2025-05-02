import { Sparkles, Bookmark, TrendingUp, Search, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-8 h-8 text-primary" />, 
    title: "Discover Curated Recipes",
    desc: "Explore a handpicked collection of delicious recipes from around the world, curated by our admin and community.",
  },
  {
    icon: <Bookmark className="w-8 h-8 text-primary" />,
    title: "Save & Share Favorites",
    desc: "Easily save recipes to your personal collection and share your favorites with friends and family.",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    title: "Admin Picks & Trending",
    desc: "See what's hot! Discover trending and featured recipes, handpicked or based on popularity.",
  },
  {
    icon: <Search className="w-8 h-8 text-primary" />,
    title: "Lightning-Fast Search",
    desc: "Find the perfect recipe in seconds with our powerful, intuitive search and filter tools.",
  },
  {
    icon: <LayoutDashboard className="w-8 h-8 text-primary" />,
    title: "Beautiful, Accessible UI",
    desc: "Enjoy a modern, mobile-friendly experience designed for everyone, with accessibility and performance in mind.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full max-w-5xl mx-auto py-16 px-4">
      <h2 className="text-2xl md:text-3xl font-extrabold text-orange-100 mb-8 text-center drop-shadow-lg">
        How It Works
      </h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-zinc-900/80 rounded-2xl shadow-lg border border-zinc-800 p-6 flex flex-col items-center text-center hover:shadow-xl transition group animate-in fade-in"
          >
            <div className="mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
            <h3 className="font-semibold text-lg text-orange-100 mb-2">{f.title}</h3>
            <p className="text-orange-200 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 