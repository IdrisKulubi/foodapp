import Link from "next/link";
import {  Twitter, Instagram, Linkedin, Mail, Sparkles } from "lucide-react";

const socials = [
  { href: "https://twitter.com/yourusername", label: "Twitter", icon: Twitter },
  { href: "https://instagram.com/yourusername", label: "Instagram", icon: Instagram },
  { href: "https://linkedin.com/in/yourusername", label: "LinkedIn", icon: Linkedin },
  { href: "mailto:hello@foodbybrenda.com", label: "Email", icon: Mail },
];

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function FooterSection() {
  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-800 py-10 px-4 mt-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center gap-2 text-orange-100 font-extrabold text-xl">
            <Sparkles className="w-7 h-7 text-primary" />
            foodbybrenda
          </Link>
          <span className="text-xs text-zinc-400">&copy; {new Date().getFullYear()} foodbybrenda. All rights reserved.</span>
        </div>
        <nav className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-4 mb-2">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-zinc-300 hover:text-primary text-sm font-medium transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-full bg-zinc-900 border border-zinc-800 p-2 hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </nav>
      </div>
    </footer>
  );
} 