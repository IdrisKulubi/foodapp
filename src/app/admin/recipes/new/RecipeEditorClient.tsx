"use client"

import { useState, useRef, useCallback, useId, JSX } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Command, CommandInput, CommandList, CommandItem } from '@/components/ui/command'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import { createReactEditorJS } from 'react-editor-js'
import type { OutputData } from '@editorjs/editorjs'
import type { Category, Tag } from '@/lib/validation'
import { UploadDropzone } from '@/utils/uploadthing'
import { recipeSchema } from '@/lib/validation'
import { createRecipe } from '@/lib/actions/recipe.actions'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'

const EDITOR_JS_TOOLS = {
  header: Header,
  list: List,
}

const ReactEditorJS = createReactEditorJS()

interface RecipeEditorClientProps {
  categories: Category[]
  tags: Tag[]
}

export default function RecipeEditorClient({ categories, tags }: RecipeEditorClientProps) {
  // Form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [totalTime, setTotalTime] = useState('')
  const [servings, setServings] = useState('')
  const [difficultyLevel, setDifficultyLevel] = useState('')
  const [featured, setFeatured] = useState(false)
  const [published, setPublished] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [editorData, setEditorData] = useState<OutputData | undefined>(undefined)
  const editorCore = useRef<{ save: () => Promise<OutputData> } | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)
  const editorHolderId = useId();

  const handleInitialize = useCallback((instance: { save: () => Promise<OutputData> }) => {
    editorCore.current = instance
  }, [])

  const handleEditorChange = useCallback(async () => {
    if (editorCore.current) {
      const data = await editorCore.current.save()
      setEditorData(data)
    }
  }, [])

  // Multi-select handlers
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

  const resetForm = () => {
    setTitle('')
    setSlug('')
    setDescription('')
    setPrepTime('')
    setCookTime('')
    setTotalTime('')
    setServings('')
    setDifficultyLevel('')
    setFeatured(false)
    setPublished(false)
    setSelectedCategories([])
    setSelectedTags([])
    setEditorData(undefined)
    setImages([])
    setError(null)
    setFieldErrors({})
    setSuccess(null)
    setPreview(false)
  }

  const handleSubmit = async (e: React.FormEvent, asDraft = false) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setFieldErrors({})
    setLoading(true)
    try {
      // Save latest editor data
      let content = editorData
      if (editorCore.current) {
        content = await editorCore.current.save()
        setEditorData(content)
      }
      // Prepare data for validation and submission
      const data = {
        title,
        slug,
        description,
        prepTime: prepTime ? Number(prepTime) : null,
        cookTime: cookTime ? Number(cookTime) : null,
        totalTime: totalTime ? Number(totalTime) : null,
        servings: servings ? Number(servings) : null,
        difficultyLevel,
        featured,
        published: asDraft ? false : published,
        authorId: 'admin',
        categories: selectedCategories.map(c => c.id),
        tags: selectedTags.map(t => t.id),
        images,
        content,
      }
      // Validate with Zod
      const parsed = recipeSchema.omit({ id: true, createdAt: true, updatedAt: true }).safeParse(data)
      if (!parsed.success) {
        setError('Please fix the errors below.')
        const fieldErrs: Record<string, string> = {}
        parsed.error.errors.forEach(e => {
          if (e.path[0]) fieldErrs[e.path[0] as string] = e.message
        })
        setFieldErrors(fieldErrs)
        setLoading(false)
        return
      }
      // Call server action
      await createRecipe(parsed.data)
      setSuccess(asDraft ? 'Draft saved!' : 'Recipe created successfully!')
      resetForm()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to create recipe')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  // Accessibility: generate unique ids for inputs
  const id = (name: string) => `recipe-${name}`

  // Simple Editor.js block renderer for preview
  function renderEditorJsContent(data?: OutputData) {
    if (!data || !data.blocks) return <div className="text-muted-foreground">No content</div>;
    return (
      <div className="prose prose-neutral max-w-none">
        {data.blocks.map((block, i) => {
          switch (block.type) {
            case 'header':
              const Tag = `h${block.data.level || 2}` as keyof JSX.IntrinsicElements;
              return <Tag key={i}>{block.data.text}</Tag>;
            case 'paragraph':
              return <p key={i} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
            case 'list':
              if (block.data.style === 'ordered') {
                return <ol key={i}>{block.data.items.map((item: string, idx: number) => <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />)}</ol>;
              } else {
                return <ul key={i}>{block.data.items.map((item: string, idx: number) => <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />)}</ul>;
              }
            default:
              return <pre key={i} className="bg-muted p-2 rounded text-xs overflow-x-auto mt-2">{JSON.stringify(block, null, 2)}</pre>;
          }
        })}
      </div>
    );
  }

  function Spinner() {
    return (
      <svg className="animate-spin mr-2 h-4 w-4 text-white" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
        <path className="opacity-75" fill="currentColor" d="M15 8a7 7 0 01-7 7V13a5 5 0 005-5h2z" />
      </svg>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Recipe</h1>
      <form className="space-y-6" onSubmit={e => handleSubmit(e, false)} aria-label="Recipe creation form">
        {error && <div className="text-destructive bg-destructive/10 p-2 rounded" role="alert">{error}</div>}
        {success && <div className="text-success bg-success/10 p-2 rounded" role="status">{success}</div>}
        {/* Title */}
        <div>
          <label htmlFor={id('title')} className="block font-medium mb-1">Title</label>
          <Input
            id={id('title')}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Recipe title"
            aria-invalid={!!fieldErrors.title}
            aria-describedby={fieldErrors.title ? id('title-error') : undefined}
          />
          {fieldErrors.title && <div id={id('title-error')} className="text-destructive text-sm mt-1">{fieldErrors.title}</div>}
        </div>
        {/* Slug (SEO) */}
        <div>
          <label htmlFor={id('slug')} className="block font-medium mb-1">Slug (SEO)</label>
          <Input
            id={id('slug')}
            value={slug}
            onChange={e => setSlug(e.target.value)}
            placeholder="recipe-title-slug"
            aria-invalid={!!fieldErrors.slug}
            aria-describedby={fieldErrors.slug ? id('slug-error') : undefined}
          />
          {fieldErrors.slug && <div id={id('slug-error')} className="text-destructive text-sm mt-1">{fieldErrors.slug}</div>}
        </div>
        {/* Description */}
        <div>
          <label htmlFor={id('description')} className="block font-medium mb-1">Description</label>
          <Textarea
            id={id('description')}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description"
            aria-invalid={!!fieldErrors.description}
            aria-describedby={fieldErrors.description ? id('description-error') : undefined}
          />
          {fieldErrors.description && <div id={id('description-error')} className="text-destructive text-sm mt-1">{fieldErrors.description}</div>}
        </div>
        {/* Prep Time */}
        <div>
          <label htmlFor={id('prepTime')} className="block font-medium mb-1">Prep Time (minutes)</label>
          <Input
            id={id('prepTime')}
            type="number"
            min={0}
            value={prepTime}
            onChange={e => setPrepTime(e.target.value)}
            placeholder="e.g. 15"
            aria-invalid={!!fieldErrors.prepTime}
            aria-describedby={fieldErrors.prepTime ? id('prepTime-error') : undefined}
          />
          {fieldErrors.prepTime && <div id={id('prepTime-error')} className="text-destructive text-sm mt-1">{fieldErrors.prepTime}</div>}
        </div>
        {/* Cook Time */}
        <div>
          <label htmlFor={id('cookTime')} className="block font-medium mb-1">Cook Time (minutes)</label>
          <Input
            id={id('cookTime')}
            type="number"
            min={0}
            value={cookTime}
            onChange={e => setCookTime(e.target.value)}
            placeholder="e.g. 30"
            aria-invalid={!!fieldErrors.cookTime}
            aria-describedby={fieldErrors.cookTime ? id('cookTime-error') : undefined}
          />
          {fieldErrors.cookTime && <div id={id('cookTime-error')} className="text-destructive text-sm mt-1">{fieldErrors.cookTime}</div>}
        </div>
        {/* Total Time */}
        <div>
          <label htmlFor={id('totalTime')} className="block font-medium mb-1">Total Time (minutes)</label>
          <Input
            id={id('totalTime')}
            type="number"
            min={0}
            value={totalTime}
            onChange={e => setTotalTime(e.target.value)}
            placeholder="e.g. 45"
            aria-invalid={!!fieldErrors.totalTime}
            aria-describedby={fieldErrors.totalTime ? id('totalTime-error') : undefined}
          />
          {fieldErrors.totalTime && <div id={id('totalTime-error')} className="text-destructive text-sm mt-1">{fieldErrors.totalTime}</div>}
        </div>
        {/* Servings */}
        <div>
          <label htmlFor={id('servings')} className="block font-medium mb-1">Servings</label>
          <Input
            id={id('servings')}
            type="number"
            min={1}
            value={servings}
            onChange={e => setServings(e.target.value)}
            placeholder="e.g. 4"
            aria-invalid={!!fieldErrors.servings}
            aria-describedby={fieldErrors.servings ? id('servings-error') : undefined}
          />
          {fieldErrors.servings && <div id={id('servings-error')} className="text-destructive text-sm mt-1">{fieldErrors.servings}</div>}
        </div>
        {/* Difficulty Level */}
        <div>
          <label htmlFor={id('difficultyLevel')} className="block font-medium mb-1">Difficulty Level</label>
          <Select value={difficultyLevel} onValueChange={setDifficultyLevel}>
            <SelectTrigger className="w-full" id={id('difficultyLevel')} aria-invalid={!!fieldErrors.difficultyLevel} aria-describedby={fieldErrors.difficultyLevel ? id('difficultyLevel-error') : undefined}>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.difficultyLevel && <div id={id('difficultyLevel-error')} className="text-destructive text-sm mt-1">{fieldErrors.difficultyLevel}</div>}
        </div>
        {/* Featured */}
        <div className="flex items-center gap-2">
          <Checkbox checked={featured} onCheckedChange={checked => setFeatured(!!checked)} id={id('featured')} aria-checked={featured} />
          <label htmlFor={id('featured')} className="font-medium">Featured</label>
        </div>
        {/* Published */}
        <div className="flex items-center gap-2">
          <Checkbox checked={published} onCheckedChange={checked => setPublished(!!checked)} id={id('published')} aria-checked={published} />
          <label htmlFor={id('published')} className="font-medium">Published</label>
        </div>
        {/* Categories Multi-select */}
        <div>
          <label className="block font-medium mb-1">Categories</label>
          <Command className="bg-background border rounded-md" aria-label="Select categories">
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              {categories.map(cat => (
                <CommandItem
                  key={cat.id}
                  value={cat.name}
                  onSelect={() => handleCategorySelect(cat)}
                  disabled={selectedCategories.some(c => c.id === cat.id)}
                  aria-selected={selectedCategories.some(c => c.id === cat.id)}
                >
                  {cat.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedCategories.map(cat => (
              <span key={cat.id} className="inline-flex items-center bg-muted px-2 py-1 rounded text-sm">
                {cat.name}
                <button type="button" className="ml-1 text-muted-foreground hover:text-destructive" onClick={() => handleCategoryRemove(cat)} aria-label={`Remove ${cat.name}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        {/* Tags Multi-select */}
        <div>
          <label className="block font-medium mb-1">Tags</label>
          <Command className="bg-background border rounded-md" aria-label="Select tags">
            <CommandInput placeholder="Search tags..." />
            <CommandList>
              {tags.map(tag => (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => handleTagSelect(tag)}
                  disabled={selectedTags.some(t => t.id === tag.id)}
                  aria-selected={selectedTags.some(t => t.id === tag.id)}
                >
                  {tag.name}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTags.map(tag => (
              <span key={tag.id} className="inline-flex items-center bg-muted px-2 py-1 rounded text-sm">
                {tag.name}
                <button type="button" className="ml-1 text-muted-foreground hover:text-destructive" onClick={() => handleTagRemove(tag)} aria-label={`Remove ${tag.name}`}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
        {/* Recipe Content (Editor.js) */}
        <div>
          <label className="block font-medium mb-1">Recipe Content</label>
          <div className="border rounded bg-muted p-4 min-h-[200px]">
            <div id={editorHolderId} />
            <ReactEditorJS
              onInitialize={handleInitialize}
              defaultValue={editorData}
              tools={EDITOR_JS_TOOLS}
              onChange={handleEditorChange}
              holder={editorHolderId}
            />
          </div>
        </div>
        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Images</label>
          <UploadDropzone
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImages(prev => [...prev, ...res.map(f => f.url)])
            }}
            onUploadError={(error) => {
              alert(`Upload error: ${error.message}`)
            }}
            aria-label="Upload images"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((url, idx) => (
              <div key={url} className="relative group">
                <Image src={url} alt="Uploaded" className="w-24 h-24 object-cover rounded border" width={64} height={64} />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-xs text-destructive opacity-0 group-hover:opacity-100 transition"
                  onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Form Actions */}
        <div className="flex gap-2">
          <Button type="submit" variant="default" disabled={loading} aria-label="Save Recipe" aria-busy={loading}>
            {loading && <Spinner />}
            {loading ? 'Saving...' : 'Save Recipe'}
          </Button>
          <Button type="button" variant="secondary" onClick={e => handleSubmit(e as React.FormEvent, true)} disabled={loading} aria-label="Save as Draft" aria-busy={loading}>
            {loading && <Spinner />}
            Save as Draft
          </Button>
          <Button type="button" variant="outline" onClick={() => setPreview(p => !p)} aria-pressed={preview} aria-label="Preview Recipe">
            {preview ? 'Hide Preview' : 'Preview'}
          </Button>
        </div>
      </form>
      {/* Preview Mode */}
      <AnimatePresence>
        {preview && (
          <motion.div
            key="preview-card"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="mt-8 max-w-2xl mx-auto bg-card rounded-2xl shadow-xl border border-border overflow-hidden animate-in fade-in"
            aria-live="polite"
          >
            {/* Banner image */}
            <div className="aspect-[4/2.2] bg-muted flex items-center justify-center relative">
              {images && images.length > 0 ? (
                <Image src={images[0]} alt={title || 'Recipe image'} className="object-cover w-full h-full" width={800} height={400} />
              ) : (
                <span className="text-6xl opacity-20">🍲</span>
              )}
              {featured && (
                <Badge variant="default" className="absolute top-4 left-4 z-10">Featured</Badge>
              )}
              {published ? (
                <Badge variant="outline" className="absolute top-4 right-4 z-10">Published</Badge>
              ) : (
                <Badge variant="secondary" className="absolute top-4 right-4 z-10">Draft</Badge>
              )}
            </div>
            <div className="p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold flex-1 truncate group-hover:text-primary transition-colors">{title || <span className="text-muted-foreground">Untitled</span>}</h2>
                <span className="text-xs text-muted-foreground">/{slug || 'slug'}</span>
              </div>
              <div className="text-base text-muted-foreground mb-2">{description}</div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                <span>Prep: <span className="font-medium text-foreground">{prepTime || '--'} min</span></span>
                <span>Cook: <span className="font-medium text-foreground">{cookTime || '--'} min</span></span>
                <span>Total: <span className="font-medium text-foreground">{totalTime || '--'} min</span></span>
                <span>Servings: <span className="font-medium text-foreground">{servings || '--'}</span></span>
                <span>Difficulty: <span className="font-medium text-foreground capitalize">{difficultyLevel || '--'}</span></span>
              </div>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCategories.map(cat => (
                    <Badge key={cat.id} variant="secondary">{cat.name}</Badge>
                  ))}
                </div>
              )}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map(tag => (
                    <Badge key={tag.id} variant="outline">{tag.name}</Badge>
                  ))}
                </div>
              )}
              <div className="prose prose-neutral max-w-none mt-4 animate-in fade-in">
                {renderEditorJsContent(editorData)}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 mt-4">
                  {images.slice(1).map((url) => (
                    <Image key={url} src={url} alt="Preview" className="w-20 h-20 object-cover rounded border" width={80} height={80} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 