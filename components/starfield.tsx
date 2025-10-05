"use client"

import { useEffect } from "react"

export default function Starfield() {
  useEffect(() => {
    const starfield = document.getElementById("starfield")
    if (!starfield) return

    // Generate random stars
    const starCount = 100
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div")
      star.className = "star"
      star.style.left = `${Math.random() * 100}%`
      star.style.top = `${Math.random() * 100}%`
      star.style.width = `${Math.random() * 2 + 1}px`
      star.style.height = star.style.width
      star.style.animationDelay = `${Math.random() * 3}s`
      starfield.appendChild(star)
    }

    return () => {
      starfield.innerHTML = ""
    }
  }, [])

  return null
}
