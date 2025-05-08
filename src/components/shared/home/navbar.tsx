"use client";

import Link from "next/link";
import SearchBar from "@/app/home/SearchBar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="w-full bg-zinc-950/90 border-b border-zinc-800/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-orange-200 text-lg tracking-tight hover:text-orange-300 transition-colors">
          <span className="text-2xl">🍲</span>
          foodbybrenda
        </Link>
        {/* Nav Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link href="/" className="text-orange-100 hover:text-orange-300 transition-colors font-medium">Home</Link>
          <Link href="/recipes" className="text-orange-100 hover:text-orange-300 transition-colors font-medium">Recipes</Link>
        </div>
        <div className="flex-1 flex justify-end items-center ml-4 mt-8">
         <SearchBar />
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden ml-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
          {menuOpen && (
            <div className="absolute top-16 right-4 bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl flex flex-col gap-2 p-4 z-50 animate-in fade-in slide-in-from-top-2 min-w-[160px]">
              <Link href="/" className="text-orange-100 hover:text-orange-300 transition-colors font-medium py-1" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/recipes" className="text-orange-100 hover:text-orange-300 transition-colors font-medium py-1" onClick={() => setMenuOpen(false)}>Recipes</Link>
              <Link href="/about" className="text-orange-100 hover:text-orange-300 transition-colors font-medium py-1" onClick={() => setMenuOpen(false)}>About</Link>
              <Link href="/contact" className="text-orange-100 hover:text-orange-300 transition-colors font-medium py-1" onClick={() => setMenuOpen(false)}>Contact</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
