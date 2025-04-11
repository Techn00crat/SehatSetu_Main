"use client"

import { useState, useEffect } from "react"

// Mock symptom database
const SYMPTOMS = [
  "Headache",
  "Fever",
  "Cough",
  "Sore throat",
  "Runny nose",
  "Fatigue",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Shortness of breath",
  "Chest pain",
  "Abdominal pain",
  "Back pain",
  "Joint pain",
  "Muscle pain",
  "Rash",
  "Dizziness",
  "Blurred vision",
  "Loss of appetite",
  "Weight loss",
  "Insomnia",
  "Anxiety",
  "Depression",
  "Confusion",
  "Memory problems",
]

export default function SymptomSuggestions({ input, onSelect }) {
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (input.length < 1) {
      setSuggestions([])
      return
    }

    const filteredSymptoms = SYMPTOMS.filter((symptom) => symptom.toLowerCase().includes(input.toLowerCase())).slice(
      0,
      5,
    )

    setSuggestions(filteredSymptoms)
  }, [input])

  if (suggestions.length === 0) return null

  return (
    <div className="absolute z-10 w-full bg-white mt-1 rounded-md border border-slate-200 shadow-lg">
      <ul className="py-1">
        {suggestions.map((symptom, index) => (
          <li
            key={index}
            className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-slate-700"
            onClick={() => onSelect(symptom)}
          >
            {symptom}
          </li>
        ))}
      </ul>
    </div>
  )
}
