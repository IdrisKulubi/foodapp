"use client"

import { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createTag } from '@/lib/actions/tag.actions'

export function AddTagDialog({ open, onOpenChange, onCreated }: { open: boolean, onOpenChange: (v: boolean) => void, onCreated?: () => void }) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await createTag({ name, slug })
        setName('')
        setSlug('')
        onOpenChange(false)
        onCreated?.()
      } catch (err: any) {
        setError(err.message || 'Failed to create tag')
      }
    })
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
          {error && <div className="text-destructive text-sm">{error}</div>}
          <Button type="submit" disabled={isPending} className="w-full">{isPending ? 'Saving...' : 'Add Tag'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 