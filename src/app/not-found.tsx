import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-24">
      <div className="text-7xl mb-6">🍽️</div>
      <h1 className="text-4xl font-bold mb-4 text-center">Recipe Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-md">
        We couldn&apos;t find the recipe you were looking for. It might have been removed or you may have mistyped the URL.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/">
          <Button size="lg" variant="default">
            Go to Homepage
          </Button>
        </Link>
        <Link href="/recipes">
          <Button size="lg" variant="outline">
            Browse All Recipes
          </Button>
        </Link>
      </div>
    </div>
  )
} 