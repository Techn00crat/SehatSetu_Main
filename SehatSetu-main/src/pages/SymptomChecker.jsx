"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Mic, Search, Plus, X } from "lucide-react"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import SymptomSuggestions from "../components/SymptomSuggestions"

export default function SymptomChecker() {
  const navigate = useNavigate()
  const [symptomInput, setSymptomInput] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [diagnosisResult, setDiagnosisResult] = useState(null)

  const handleAddSymptom = (symptom) => {
    if (symptom && !selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom])
      setSymptomInput("")
      setShowSuggestions(false)
    }
  }

  const handleRemoveSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom))
  }

  const handleVoiceInput = () => {
    // Mock voice input functionality
    alert("Voice input feature would be activated here")
  }

  const handleAnalyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) {
      alert("Please add at least one symptom")
      return
    }

    setIsAnalyzing(true)

    // Mock API call with timeout to simulate processing
    setTimeout(() => {
      setIsAnalyzing(false)

      // Mock diagnosis result
      const mockDiagnosis = {
        primaryCondition: {
          name: "Common Cold",
          description:
            "A viral infection of the upper respiratory tract that typically causes nasal congestion, sore throat, and coughing.",
          confidence: 85,
          recommendation:
            "Rest, stay hydrated, and take over-the-counter cold medications if needed. Consult a doctor if symptoms worsen or persist beyond 10 days.",
        },
        otherPossibilities: [
          { name: "Seasonal Allergies", confidence: 65 },
          { name: "Influenza", confidence: 40 },
        ],
      }

      setDiagnosisResult(mockDiagnosis)
    }, 2000)
  }

  const handleViewFullReport = () => {
    // In a real app, we would pass the diagnosis ID or data
    navigate("/diagnosis-report")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-900">Symptom Checker</h1>

      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitlsription>Describe your symptoms in detail to get the most accurate analysis</CardTitlsription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">m
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      type="text"
                      placeholder="Type a symptom (e.g., headache, fever)"
                      className="pl-9"
                      value={symptomInput}
                      onChange={(e) => {
                        setSymptomInput(e.target.value)
                        setShowSuggestions(e.target.value.length > 0)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && symptomInput) {
                          handleAddSymptom(symptomInput)
                        }
                      }}
                    />
                    {showSuggestions && <SymptomSuggestions input={symptomInput} onSelect={handleAddSymptom} />}
                  </div>
                  <Button variant="outline" size="icon" onClick={handleVoiceInput} title="Voice input">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleAddSymptom(symptomInput)} disabled={!symptomInput}>
                    <Plus className="h-4 w-4 mr-2" /> Add
                  </Button>
                </div>
              </div>

              {selectedSymptoms.length > 0 && (
                <div className="mt-4">
                  <Label>Selected Symptoms:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedSymptoms.map((symptom, index) => (
                      <Badge key={index} variant="secondary" className="pl-3 pr-2 py-1.5">
                        {symptom}
                        <button
                          onClick={() => handleRemoveSymptom(symptom)}
                          className="ml-1 text-slate-500 hover:text-slate-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleAnalyzeSymptoms}
              className="w-full bg-teal-600 hover:bg-teal-700"
              disabled={selectedSymptoms.length === 0 || isAnalyzing}
            >
              {isAnalyzing ? "Analyzing Symptoms..." : "Analyze Symptoms"}
            </Button>
          </CardFooter>
        </Card>

        {isAnalyzing && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">Analyzing your symptoms...</h3>
                <Progress value={45} className="h-2" />
                <p className="text-sm text-slate-500">Our AI is comparing your symptoms with thousands of conditions</p>
              </div>
            </CardContent>
          </Card>
        )}

        {diagnosisResult && (
          <Card>
            <CardHeader>
              <CardTitle>Diagnosis Results</CardTitle>
              <CardDescription>Based on the symptoms you provided, here's what our AI suggests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-teal-700">{diagnosisResult.primaryCondition.name}</h3>
                    <Badge className="bg-teal-600">{diagnosisResult.primaryCondition.confidence}% Match</Badge>
                  </div>
                  <Progress value={diagnosisResult.primaryCondition.confidence} className="h-2" />
                  <p className="text-slate-600">{diagnosisResult.primaryCondition.description}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Recommendation</h4>
                  <p className="text-blue-700">{diagnosisResult.primaryCondition.recommendation}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Other Possibilities</h4>
                  <div className="space-y-3">
                    {diagnosisResult.otherPossibilities.map((condition, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-slate-700">{condition.name}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={condition.confidence} className="w-24 h-2" />
                          <span className="text-sm text-slate-500">{condition.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleViewFullReport} className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700">
                View Full Report
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => {
                  setDiagnosisResult(null)
                  setSelectedSymptoms([])
                }}
              >
                Start New Check
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
