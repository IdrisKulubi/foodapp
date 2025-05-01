"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { updateCategory } from '@/lib/actions/category.actions'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be URL-friendly'),
})

interface EditCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: { id: string; name: string; slug: string } | null
  onUpdated: () => void
}

export default function EditCategoryDialog({ open, onOpenChange, category, onUpdated }: EditCategoryDialogProps) {
  const [form, setForm] = useState({ name: '', slug: '' })
  const [errors, setErrors] = useState<{ name?: string; slug?: string; form?: string }>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category) {
      setForm({ name: category.name, slug: category.slug })
      setErrors({})
    }
  }, [category])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category) return
    const result = schema.safeParse(form)
    if (!result.success) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setErrors(result.error.flatten().fieldErrors as any)
      return
    }
    setLoading(true)
    try {
      await updateCategory(category.id, result.data)
      setErrors({})
      onOpenChange(false)
      onUpdated()
    } catch (err) {
      console.error(err)
      setErrors({ form: 'Something went wrong.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-label="Edit Category">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Category name"
              aria-label="Category name"
              autoFocus
              required
            />
            {errors.name && <div className="text-destructive text-xs mt-1">{errors.name}</div>}
          </div>
          <div>
            <Input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="category-slug"
              aria-label="Category slug"
              required
            />
            {errors.slug && <div className="text-destructive text-xs mt-1">{errors.slug}</div>}
          </div>
          {errors.form && <div className="text-destructive text-xs mt-1">{errors.form}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
            <Button type="submit" variant="default" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 