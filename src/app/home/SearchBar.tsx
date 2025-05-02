"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { searchRecipes } from "../../lib/actions/search.actions";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = React.useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    searchRecipes(debouncedQuery)
      .then((res) => {
        setResults(res);
        setShowDropdown(true);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const handleResultClick = (slug: string) => {
    setShowDropdown(false);
    setQuery("");
    router.push(`/recipes/${slug}`);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto mb-8">
      <Input
        type="search"
        placeholder="Search recipes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        className="w-full px-4 py-2 rounded-md border"
        aria-label="Search recipes"
        autoComplete="off"
      />
      {showDropdown && results.length > 0 && (
        <div
          className="absolute z-20 w-full bg-popover border rounded-md shadow-lg mt-1 max-h-72 overflow-auto"
          role="listbox"
        >
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              role="option"
              aria-selected={false}
              tabIndex={0}
              className={cn(
                "w-full text-left px-4 py-2 cursor-pointer hover:bg-accent focus:bg-accent outline-none",
                loading && "opacity-50"
              )}
              onMouseDown={() => handleResultClick(r.slug)}
            >
              <span className="font-medium">{highlight(r.title, query)}</span>
              <span className="block text-xs text-muted-foreground line-clamp-1">
                {highlight(r.description, query)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function highlight(text: string, q: string) {
  if (!q) return text;
  const regex = new RegExp(`(${q})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-black rounded px-0.5">{part}</mark>
    ) : (
      part
    )
  );
} 