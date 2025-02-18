// app/page.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [currentTime, setCurrentTime] = useState("")
  const [moodRating, setMoodRating] = useState(5)
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}, ${now.getDate().toString().padStart(2, "0")}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getFullYear()}`
      setCurrentTime(formattedTime)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/log-mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: currentTime,
          moodRating: moodRating,
          notes: notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to log mood');
      }

      // Clear the form
      setNotes("");
      
      // Optional: Add some user feedback
      alert('Mood logged successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to log mood. Please try again.');
    }
  }

  // Replace gradient colors with flat colors
  const colors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-violet-500",
    "bg-purple-500",
  ]

  const getColor = (index: number) => colors[index]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-white">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-400 glow">Mood Tracker</h1>
        <div className="text-2xl font-mono text-center mb-8 text-green-400 glow">{currentTime}</div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mood" className="block text-sm font-medium mb-2 text-purple-400">
              Mood Rating: {moodRating}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[...Array(10)].map((_, index) => {
                const isSelected = moodRating === index
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setMoodRating(index)}
                    className={`aspect-square rounded-md text-lg font-bold transition-all duration-200 
                      ${getColor(index)} ${
                      isSelected 
                        ? "text-white scale-110 ring-2 ring-white" 
                        : "text-white hover:scale-105"
                      }`}
                  >
                    {index}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2 text-purple-400">
              Notes (optional)
            </label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-gray-800 border-purple-400 text-white glow"
              placeholder="How are you feeling?"
            />
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 glow">
            Log Mood
          </Button>
        </form>
      </div>
    </main>
  )
}
