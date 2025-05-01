"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { z } from 'zod'
import { createCategory } from '@/lib/actions/category.actions'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be URL-friendly'),
})

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export default function AddCategoryDialog({ open, onOpenChange, onCreated }: AddCategoryDialogProps) {
  const [form, setForm] = useState({ name: '', slug: '' })
  const [errors, setErrors] = useState<{ name?: string; slug?: string; form?: string }>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = schema.safeParse(form)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>
      setErrors({
        name: fieldErrors.name?.[0],
        slug: fieldErrors.slug?.[0],
      })
      return
    }
    setLoading(true)
    try {
      const res = await createCategory(result.data)
      if (res && typeof res === 'object' && 'error' in res && res.error) {
        setErrors({ form: String(res.error) })
      } else {
        setForm({ name: '', slug: '' })
        setErrors({})
        onOpenChange(false)
        onCreated()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-label="Add Category">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
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
              {loading ? <span className="animate-spin mr-2">⏳</span> : null}Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 