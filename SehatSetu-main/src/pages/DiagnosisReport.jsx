"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Download, Calendar, Phone, AlertCircle, CheckCircle2 } from "lucide-react"

export default function DiagnosisReport() {
  const [reportData] = useState({
    id: "REP-2023-05-15",
    date: "May 15, 2023",
    symptoms: ["Headache", "Fatigue", "Sore throat", "Runny nose"],
    primaryCondition: {
      name: "Common Cold",
      description:
        "A viral infection of the upper respiratory tract that typically causes nasal congestion, sore throat, and coughing.",
      confidence: 85,
      recommendation:
        "Rest, stay hydrated, and take over-the-counter cold medications if needed. Consult a doctor if symptoms worsen or persist beyond 10 days.",
      details:
        "The common cold is caused by viruses that infect the upper respiratory tract. There are over 200 different viruses that can cause the common cold, with rhinoviruses being the most common. Symptoms typically appear 1-3 days after exposure and can last 7-10 days.",
      riskFactors: [
        "Weakened immune system",
        "Season (fall and winter)",
        "Age (children under 6)",
        "Exposure to infected individuals",
      ],
      commonMedications: ["Acetaminophen", "Ibuprofen", "Decongestants", "Antihistamines"],
    },
    otherConditions: [
      {
        name: "Seasonal Allergies",
        confidence: 65,
        description: "An immune response to environmental triggers such as pollen, causing symptoms similar to a cold.",
      },
      {
        name: "Influenza",
        confidence: 40,
        description: "A viral infection that attacks your respiratory system — your nose, throat and lungs.",
      },
      {
        name: "Sinusitis",
        confidence: 35,
        description:
          "Inflammation of the sinuses, which are air-filled spaces behind your forehead, nasal bones, cheeks, and eyes.",
      },
    ],
  })

  const handleDownloadReport = () => {
    // Mock download functionality
    alert("Report download would be initiated here")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Diagnosis Report</h1>
            <p className="text-slate-600">
              Report ID: {reportData.id} • Generated on {reportData.date}
            </p>
          </div>
          <Button onClick={handleDownloadReport} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Based on the symptoms you provided</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-2">Reported Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {reportData.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="outline">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-teal-700">{reportData.primaryCondition.name}</h3>
                  <Badge className="bg-teal-600">{reportData.primaryCondition.confidence}% Match</Badge>
                </div>
                <Progress value={reportData.primaryCondition.confidence} className="h-2 mb-4" />
                <p className="text-slate-600 mb-4">{reportData.primaryCondition.description}</p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Recommendation</h4>
                  <p className="text-blue-700">{reportData.primaryCondition.recommendation}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="details" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Condition Details</TabsTrigger>
            <TabsTrigger value="alternatives">Alternative Diagnoses</TabsTrigger>
            <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{reportData.primaryCondition.name} - Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">About this condition</h3>
                  <p className="text-slate-700">{reportData.primaryCondition.details}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Risk Factors</h3>
                  <ul className="list-disc pl-5 space-y-1 text-slate-700">
                    {reportData.primaryCondition.riskFactors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-500 mb-2">Common Medications</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {reportData.primaryCondition.commonMedications.map((med, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-teal-600 mr-2" />
                        <span className="text-slate-700">{med}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Note: Always consult with a healthcare professional before taking any medication.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alternatives" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Alternative Possible Diagnoses</CardTitle>
                <CardDescription>Other conditions that may match your symptoms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {reportData.otherConditions.map((condition, index) => (
                    <div key={index} className="pb-4 border-b border-slate-200 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-slate-900">{condition.name}</h3>
                        <Badge variant="outline">{condition.confidence}% Match</Badge>
                      </div>
                      <Progress value={condition.confidence} className="h-2 mb-3" />
                      <p className="text-slate-600">{condition.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="next-steps" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <AlertCircle className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-teal-800 mb-1">Important Note</h3>
                      <p className="text-teal-700 text-sm">
                        This AI diagnosis is not a substitute for professional medical advice. If your symptoms are
                        severe or persistent, please consult a healthcare provider.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Consult a Doctor</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 mb-4">
                          Speak with a healthcare professional for a definitive diagnosis and treatment plan.
                        </p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <Phone className="mr-2 h-4 w-4" /> Find a Doctor
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Schedule a Follow-up</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600 mb-4">
                          Set a reminder to check your symptoms again in a few days to track your progress.
                        </p>
                        <Button variant="outline" className="w-full">
                          <Calendar className="mr-2 h-4 w-4" /> Set Reminder
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <Button asChild variant="outline">
            <Link to="/symptom-checker">Back to Symptom Checker</Link>
          </Button>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
