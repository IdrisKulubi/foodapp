import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-0 md:px-8 overflow-hidden bg-gradient-to-br from-zinc-950 to-zinc-900">
      {/* Collage Background */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        {/* Collage grid: 3x2, blurred and faded for depth */}
        <div className="absolute inset-0 flex flex-col gap-2 opacity-80">
          <div className="flex gap-2 h-1/2">
            <Image src="/food2.jpg" alt="Food 1" width={400} height={300} className="object-cover w-1/3 h-full rounded-2xl blur-[2px] brightness-75" />
            <Image src="/food3.jpg" alt="Food 2" width={400} height={300} className="object-cover w-1/3 h-full rounded-2xl blur-[2px] brightness-75" />
            <Image src="/food4.jpg" alt="Food 3" width={400} height={300} className="object-cover w-1/3 h-full rounded-2xl blur-[2px] brightness-75" />
          </div>
          <div className="flex gap-2 h-1/2 mt-2">
            <Image src="/food5.jpg" alt="Food 4" width={400} height={300} className="object-cover w-1/3 h-full rounded-2xl blur-[2px] brightness-75" />
            <Image src="/food6.jpg" alt="Food 5" width={400} height={300} className="object-cover w-1/3 h-full rounded-2xl blur-[2px] brightness-75" />
            <Image src="/food7.jpg" alt="Food 6" width={400} height={300} className="object-cover w-1/3 h-full rounded-2xl blur-[2px] brightness-75" />
          </div>
        </div>
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-zinc-900/90" />
      </div>
      {/* Glassmorphism Overlay Card */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto mt-16 md:mt-24 animate-in fade-in slide-in-from-top-4">
        <div className="backdrop-blur-xl bg-zinc-900/80 rounded-3xl shadow-2xl border border-zinc-800 px-8 py-10 flex flex-col items-center gap-6">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-orange-100 drop-shadow-lg text-center">
            Welcome to foodbybrenda
          </h1>
          <p className="text-base md:text-xl text-orange-200 max-w-md mx-auto text-center">
            Curated by Brendah. Discover, create, and share the world&apos;s tastiest recipes with the foodbybrenda community. Find inspiration, share your creations, and connect with food lovers everywhere.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-2">
            <Link href="/recipes">
              <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:bg-primary/90 transition text-lg">
                Browse Recipes
              </button>
            </Link>
            <Link href="/recipes">
              <button className="px-8 py-3 rounded-full bg-zinc-800 text-orange-200 font-semibold shadow-lg hover:bg-zinc-700 transition text-lg border border-primary/20">
                Share Your Recipe
              </button>
            </Link>
          </div>
          {/* Mini search bar or trending tags row */}
          <div className="w-full flex flex-wrap gap-2 justify-center mt-4">
            {["#vegan", "#quick", "#dessert", "#healthy", "#breakfast", "#family", "#trending"].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-zinc-800/80 text-orange-200 text-xs font-semibold shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* Floating Recipe Card Preview */}
        <div className="relative -mt-12 md:-mt-16 w-full max-w-xs mx-auto z-20 animate-in fade-in slide-in-from-bottom-4">
          <div className="rounded-2xl shadow-xl border border-zinc-800 bg-zinc-700/90 p-4 flex flex-col gap-2 items-center">
            <Image src="/chocolate.jpg" alt="Recipe preview" width={240} height={120} className="rounded-xl object-cover w-full h-28" />
            <div className="flex flex-col items-center gap-1 mt-2">
              <span className="font-bold text-orange-100 text-lg">Chocolate Lava Cake</span>
              <span className="text-xs text-orange-200">#dessert #trending</span>
            </div>
            <button className="mt-2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow hover:bg-primary/90 transition">
              View More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
