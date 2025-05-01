"use client"

import React, { useEffect, useState } from 'react'

interface StatsClientProps {
  publishedCount: number
  featuredCount: number
  draftCount: number
}

export default function StatsClient({ publishedCount, featuredCount, draftCount }: StatsClientProps) {
  const [animate, setAnimate] = useState(false)
  const total = publishedCount + draftCount
  
  // Calculate percentages
  const publishedPercent = total ? Math.round((publishedCount / total) * 100) : 0
  const draftPercent = total ? Math.round((draftCount / total) * 100) : 0
  const featuredPercent = publishedCount ? Math.round((featuredCount / publishedCount) * 100) : 0

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimate(true), 300)
    return () => clearTimeout(timer)
  }, [])

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <span className="text-6xl block mb-4">📝</span>
          <p className="text-muted-foreground">No recipes yet. Create your first recipe to see statistics.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pt-4">
      {/* Bar charts */}
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <div>
              <span className="font-medium">Published</span>
              <span className="text-xs ml-2 text-muted-foreground">{publishedCount} recipes</span>
            </div>
            <span className="font-semibold">{publishedPercent}%</span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out-expo"
              style={{ width: animate ? `${publishedPercent}%` : '0%' }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <div>
              <span className="font-medium">Draft</span>
              <span className="text-xs ml-2 text-muted-foreground">{draftCount} recipes</span>
            </div>
            <span className="font-semibold">{draftPercent}%</span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out-expo" 
              style={{ width: animate ? `${draftPercent}%` : '0%' }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <div>
              <span className="font-medium">Featured</span>
              <span className="text-xs ml-2 text-muted-foreground">{featuredCount} of published</span>
            </div>
            <span className="font-semibold">{featuredPercent}%</span>
          </div>
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out-expo" 
              style={{ width: animate ? `${featuredPercent}%` : '0%' }}
            />
          </div>
        </div>
      </div>

      {/* Donut chart */}
      <div className="flex justify-center pt-4">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background circle */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="hsl(var(--muted))" strokeWidth="15" />
            
            {/* Published segment - stroke-dasharray: circumference, stroke-dashoffset: circumference - (percent * circumference / 100) */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="transparent" 
              stroke="rgb(34 197 94)" 
              strokeWidth="15" 
              strokeDasharray="251.2" 
              strokeDashoffset={animate ? 251.2 - (publishedPercent * 251.2 / 100) : 251.2}
              className="transition-all duration-1000 ease-out-expo"
              transform="rotate(-90 50 50)"
            />
            
            {/* Center text */}
            <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-2xl font-bold fill-current">
              {total}
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-muted-foreground mt-8">Total Recipes</p>
          </div>
        </div>
      </div>
    </div>
  )
} 