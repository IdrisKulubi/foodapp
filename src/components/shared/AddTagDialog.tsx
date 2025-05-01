'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createTag } from '@/lib/actions/tag.actions'

export function AddTagDialog({ open, onOpenChange, onCreated }: { open: boolean, onOpenChange: (v: boolean) => void, onCreated?: () => void }) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createTag({ name, slug })
      setName('')
      setSlug('')
      onOpenChange(false)
      onCreated?.()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to create tag')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Tag</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Tag name" required />
          <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug" required />
          {error && <div className="text-destructive">{error}</div>}
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Tag'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}