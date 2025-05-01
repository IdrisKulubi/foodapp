"use client"

import { useState, useTransition, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateTag } from '@/lib/actions/tag.actions'
import type { Tag } from '@/lib/validation'

export function EditTagDialog({ open, onOpenChange, tag, onUpdated }: { open: boolean, onOpenChange: (v: boolean) => void, tag: Tag | null, onUpdated?: () => void }) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (tag) {
      setName(tag.name)
      setSlug(tag.slug)
    }
  }, [tag])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tag) return
    setError(null)
    startTransition(async () => {
      try {
        await updateTag(tag.id, { name, slug })
        onOpenChange(false)
        onUpdated?.()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || 'Failed to update tag')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tag</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Tag name" required />
          <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="Slug" required />
          {error && <div className="text-destructive text-sm">{error}</div>}
          <Button type="submit" disabled={isPending} className="w-full">{isPending ? 'Saving...' : 'Save Changes'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 