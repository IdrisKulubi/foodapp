"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { searchRecipes } from "./search.actions";

export default function SearchBar() {
  const [query, setQuery] = React.useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const [showDropdown, setShowDropdown] = React.useState(false);

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
      />
      {showDropdown && results.length > 0 && (
        <div className="absolute z-20 w-full bg-popover border rounded-md shadow-lg mt-1 max-h-72 overflow-auto">
          {results.map((r) => (
            <div
              key={r.id}
              className={cn(
                "px-4 py-2 cursor-pointer hover:bg-accent",
                loading && "opacity-50"
              )}
            >
              <span className="font-medium">{highlight(r.title, query)}</span>
              <span className="block text-xs text-muted-foreground line-clamp-1">
                {highlight(r.description, query)}
              </span>
            </div>
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