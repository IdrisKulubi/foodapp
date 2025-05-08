"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Command, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { UploadDropzone } from '@/utils/uploadthing'
import Image from 'next/image'
import Link from 'next/link'
import { updateRecipe } from '@/lib/actions/recipe.actions'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ImagePlus, Save } from 'lucide-react'
import type { Recipe, Category, Tag } from '@/lib/validation'
import { toast } from 'sonner'

interface EditRecipeFormProps {
  recipe: Recipe
  categories: Category[]
  tags: Tag[]
}

export default function EditRecipeForm({ recipe, categories, tags }: EditRecipeFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Recipe data state
  const [title, setTitle] = useState(recipe.title)
  const [slug, setSlug] = useState(recipe.slug)
  const [description, setDescription] = useState(recipe.description || '')
  const [prepTime, setPrepTime] = useState(recipe.prepTime?.toString() || '')
  const [cookTime, setCookTime] = useState(recipe.cookTime?.toString() || '')
  const [totalTime, setTotalTime] = useState(recipe.totalTime?.toString() || '')
  const [servings, setServings] = useState(recipe.servings?.toString() || '')
  const [difficultyLevel, setDifficultyLevel] = useState(recipe.difficultyLevel || '')
  const [published, setPublished] = useState(!!recipe.published)
  const [featured, setFeatured] = useState(!!recipe.featured)
  const [trending, setTrending] = useState(!!recipe.trending)
  const [instructions, setInstructions] = useState(recipe.instructions || '')
  const [notes, setNotes] = useState(recipe.notes || '')

  // Recipe relationships
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    categories.filter(cat => recipe.categoryIds?.includes(cat.id))
  )
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    tags.filter(tag => recipe.tagIds?.includes(tag.id))
  )

  // Recipe image handling
  const [images, setImages] = useState<string[]>(recipe.images || [])

  // Recipe steps and ingredients
  const [ingredients, setIngredients] = useState<{ name: string; quantity: string; unit?: string; note?: string }[]>(
    recipe.ingredients || []
  )
  const [steps, setSteps] = useState<{ order: number; description: string; imageUrl?: string }[]>(
    recipe.steps || []
  )

  // Handlers for categories and tags
  const handleCategorySelect = (cat: Category) => {
    if (!selectedCategories.some(c => c.id === cat.id)) {
      setSelectedCategories(prev => [...prev, cat])
    }
  }

  const handleCategoryRemove = (cat: Category) => {
    setSelectedCategories(prev => prev.filter(c => c.id !== cat.id))
  }

  const handleTagSelect = (tag: Tag) => {
    if (!selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags(prev => [...prev, tag])
    }
  }

  const handleTagRemove = (tag: Tag) => {
    setSelectedTags(prev => prev.filter(t => t.id !== tag.id))
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Basic form validation
      if (!title.trim()) {
        toast.error("Title is required");
        setLoading(false);
        return;
      }
      
      if (!slug.trim()) {
        toast.error("Slug is required");
        setLoading(false);
        return;
      }
      
      // Check ingredients have name and quantity
      const invalidIngredients = ingredients.filter(
        ing => !ing.name.trim() || !ing.quantity.trim()
      );
      
      if (invalidIngredients.length > 0) {
        toast.error("All ingredients must have a name and quantity");
        setLoading(false);
        return;
      }
      
      // Check steps have order and description
      const invalidSteps = steps.filter(
        step => !step.description.trim() || !step.order
      );
      
      if (invalidSteps.length > 0) {
        toast.error("All steps must have an order and description");
        setLoading(false);
        return;
      }

      // Prepare data for update
      const data = {
        title,
        slug,
        description: description || "",
        prepTime: prepTime ? Number(prepTime) : null,
        cookTime: cookTime ? Number(cookTime) : null,
        totalTime: totalTime ? Number(totalTime) : null,
        servings: servings ? Number(servings) : null,
        difficultyLevel: difficultyLevel || "",
        published,
        featured,
        trending,
        images,
        ingredients,
        steps,
        instructions: instructions || "",
        notes: notes || "",
        categoryIds: selectedCategories.map(c => c.id),
        tagIds: selectedTags.map(t => t.id),
        authorId: recipe.authorId
      }

      // Submit update
      await updateRecipe(recipe.id, data)
      
      toast.success('Recipe updated successfully!', {
        description: 'Your changes have been saved.',
        duration: 3000,
      })
      
      // Refresh data and redirect after short delay
      setTimeout(() => {
        router.refresh()
        router.push(`/admin/recipes/${recipe.id}`)
      }, 1500)
    } catch (err) {
      if (typeof err === 'string' && err.includes('Invalid recipe data')) {
        // Handle validation errors
        const message = err.includes('Expected string, received null') 
          ? 'Some text fields contain invalid values. Please check and try again.'
          : err;
          
        toast.error('Validation Error', {
          description: message,
          duration: 5000,
        });
      } else {
        toast.error('Failed to update recipe', {
          description: err instanceof Error ? err.message : 'Please try again.',
          duration: 5000,
        });
      }
    } finally {
      setLoading(false)
    }
  }

  function getValidImageSrc(src: string | undefined): string {
    if (!src) return "/fallback.jpg";
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) return src;
    return "/fallback.jpg";
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link href={`/admin/recipes/${recipe.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition mb-4">
        <ChevronLeft className="h-4 w-4" />
        Back to Recipe
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">Edit Recipe</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="title">Title</label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="slug">Slug</label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Recipe Details */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recipe Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="prepTime">Prep Time (min)</label>
                <Input
                  id="prepTime"
                  type="number"
                  min={0}
                  value={prepTime}
                  onChange={e => setPrepTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="cookTime">Cook Time (min)</label>
                <Input
                  id="cookTime"
                  type="number"
                  min={0}
                  value={cookTime}
                  onChange={e => setCookTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="totalTime">Total Time (min)</label>
                <Input
                  id="totalTime"
                  type="number"
                  min={0}
                  value={totalTime}
                  onChange={e => setTotalTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="servings">Servings</label>
                <Input
                  id="servings"
                  type="number"
                  min={1}
                  value={servings}
                  onChange={e => setServings(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="difficultyLevel">Difficulty Level</label>
              <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Switch
                  checked={published}
                  onCheckedChange={setPublished}
                  id="published"
                />
                <div>
                  <label htmlFor="published" className="font-medium cursor-pointer">Published</label>
                  <p className="text-xs text-muted-foreground">Make recipe visible to users</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Switch
                  checked={featured}
                  onCheckedChange={setFeatured}
                  id="featured"
                  className="data-[state=checked]:bg-blue-500"
                />
                <div>
                  <label htmlFor="featured" className="font-medium cursor-pointer">Featured</label>
                  <p className="text-xs text-muted-foreground">Show on featured section</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Switch
                  checked={trending}
                  onCheckedChange={setTrending}
                  id="trending"
                  className="data-[state=checked]:bg-orange-500"
                />
                <div>
                  <label htmlFor="trending" className="font-medium cursor-pointer">Trending</label>
                  <p className="text-xs text-muted-foreground">Show in trending section</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Categories and Tags */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Categories & Tags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Categories</label>
                <Command className="bg-background border rounded-md">
                  <CommandInput placeholder="Search categories..." />
                  <CommandList>
                    {categories.map(cat => (
                      <CommandItem
                        key={cat.id}
                        value={cat.name}
                        onSelect={() => handleCategorySelect(cat)}
                        disabled={selectedCategories.some(c => c.id === cat.id)}
                      >
                        {cat.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCategories.map(cat => (
                    <Badge key={cat.id} variant="secondary" className="gap-1">
                      {cat.name}
                      <button type="button" className="ml-1 text-muted-foreground hover:text-destructive" onClick={() => handleCategoryRemove(cat)}>
                        ×
                      </button>
                    </Badge>
                  ))}
                  {selectedCategories.length === 0 && (
                    <p className="text-sm text-muted-foreground">No categories selected</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <Command className="bg-background border rounded-md">
                  <CommandInput placeholder="Search tags..." />
                  <CommandList>
                    {tags.map(tag => (
                      <CommandItem
                        key={tag.id}
                        value={tag.name}
                        onSelect={() => handleTagSelect(tag)}
                        disabled={selectedTags.some(t => t.id === tag.id)}
                      >
                        {tag.name}
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTags.map(tag => (
                    <Badge key={tag.id} variant="outline" className="gap-1">
                      {tag.name}
                      <button type="button" className="ml-1 text-muted-foreground hover:text-destructive" onClick={() => handleTagRemove(tag)}>
                        ×
                      </button>
                    </Badge>
                  ))}
                  {selectedTags.length === 0 && (
                    <p className="text-sm text-muted-foreground">No tags selected</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Ingredients & Steps */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Ingredients & Steps</h2>
            
            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium mb-2">Ingredients</label>
              <div className="space-y-4">
                {ingredients.map((ingredient, idx) => (
                  <div key={idx} className="flex flex-col gap-2 p-3 border rounded-md bg-background">
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                        <Input
                          placeholder="e.g., Flour"
                          value={ingredient.name}
                          onChange={e => setIngredients(ings => ings.map((ing, i) => i === idx ? { ...ing, name: e.target.value } : ing))}
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
                        <Input
                          placeholder="e.g., 2"
                          value={ingredient.quantity}
                          onChange={e => setIngredients(ings => ings.map((ing, i) => i === idx ? { ...ing, quantity: e.target.value } : ing))}
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-xs text-muted-foreground mb-1 block">Unit (optional)</label>
                        <Input
                          placeholder="e.g., cups"
                          value={ingredient.unit || ''}
                          onChange={e => setIngredients(ings => ings.map((ing, i) => i === idx ? { ...ing, unit: e.target.value } : ing))}
                        />
                      </div>
                      <div className="col-span-1 flex justify-end items-end">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          onClick={() => setIngredients(ings => ings.filter((_, i) => i !== idx))}
                          size="sm"
                          className="h-10"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Note (optional)</label>
                      <Input
                        placeholder="e.g., sifted, or any special instructions"
                        value={ingredient.note || ''}
                        onChange={e => setIngredients(ings => ings.map((ing, i) => i === idx ? { ...ing, note: e.target.value } : ing))}
                      />
                    </div>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIngredients(ings => [...ings, { name: '', quantity: '' }])}
                  className="mt-4"
                >
                  Add Ingredient
                </Button>
              </div>
            </div>
            
            {/* Steps */}
            <div>
              <label className="block text-sm font-medium mb-2">Steps</label>
              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex gap-2 items-start">
                      <Input
                        className="w-12 flex-shrink-0"
                        type="number"
                        min={1}
                        placeholder="#"
                        value={step.order}
                        onChange={e => setSteps(stps => stps.map((s, i) => i === idx ? { ...s, order: Number(e.target.value) } : s))}
                      />
                      <Textarea
                        className="flex-1"
                        placeholder="Step description"
                        value={step.description}
                        onChange={e => setSteps(stps => stps.map((s, i) => i === idx ? { ...s, description: e.target.value } : s))}
                        rows={2}
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => setSteps(stps => stps.filter((_, i) => i !== idx))}
                        className="flex-shrink-0"
                      >
                        ×
                      </Button>
                    </div>
                    <div className="ml-14">
                      <Input
                        className="w-full"
                        placeholder="Image URL for this step (optional)"
                        value={step.imageUrl || ''}
                        onChange={e => setSteps(stps => stps.map((s, i) => i === idx ? { ...s, imageUrl: e.target.value } : s))}
                      />
                    </div>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSteps(stps => [...stps, { order: steps.length + 1, description: '' }])}
                  className="mt-2"
                >
                  Add Step
                </Button>
              </div>
            </div>
            
            {/* Instructions & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="instructions">Instructions</label>
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  rows={4}
                  placeholder="General instructions (optional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="notes">Notes</label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Recipe notes (optional)"
                />
              </div>
            </div>
          </div>
          
          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Images</h2>
            <p className="text-sm text-muted-foreground">Upload high-quality images for your recipe. The first image will be the main image.</p>
            
            <UploadDropzone
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                setImages(prev => [...prev, ...res.map(f => f.url)])
                toast.success(`${res.length} image${res.length > 1 ? 's' : ''} uploaded successfully`)
              }}
              onUploadError={(error) => {
                toast.error(`Upload error: ${error.message}`)
              }}
            />
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {images.map((url, idx) => (
                <div key={url} className="relative group aspect-square">
                  <Image 
                    src={getValidImageSrc(url)} 
                    alt={`Recipe image ${idx + 1}`} 
                    fill
                    className="object-cover rounded-md border"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
                    {idx !== 0 && (
                      <button
                        type="button"
                        className="bg-blue-500 text-white p-2 rounded-full"
                        onClick={() => {
                          const newImages = [...images];
                          const temp = newImages[0];
                          newImages[0] = newImages[idx];
                          newImages[idx] = temp;
                          setImages(newImages);
                          toast.success("Image set as main");
                        }}
                        aria-label="Set as main image"
                        title="Set as main image"
                      >
                        ⭐
                      </button>
                    )}
                    <button
                      type="button"
                      className="bg-white text-black p-2 rounded-full"
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                      aria-label="Remove image"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                  {idx === 0 && (
                    <Badge variant="secondary" className="absolute top-2 left-2">Main</Badge>
                  )}
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-full text-center p-6 border border-dashed rounded-md text-muted-foreground flex flex-col items-center justify-center gap-2">
                  <ImagePlus className="h-8 w-8 text-muted-foreground/50" />
                  <p>No images uploaded yet</p>
                  <p className="text-sm text-muted-foreground/70">Drag and drop or click the area above to upload</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Link href={`/admin/recipes/${recipe.id}`}>
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 