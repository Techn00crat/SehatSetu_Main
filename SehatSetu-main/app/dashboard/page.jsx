"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Download, FileText, Plus, Upload } from "lucide-react"
import Link from "next/link"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
  const [toggle, setToggle] = useState(false);
  const [userData] = useState({
    name: "Alex Johnson",
    recentDiagnoses: [
      {
        id: "REP-2023-05-15",
        date: "May 15, 2023",
        condition: "Common Cold",
        confidence: 85,
        symptoms: ["Headache", "Fatigue", "Sore throat"],
      },
      {
        id: "REP-2023-04-22",
        date: "April 22, 2023",
        condition: "Seasonal Allergies",
        confidence: 78,
        symptoms: ["Sneezing", "Itchy eyes", "Runny nose"],
      },
      {
        id: "REP-2023-03-10",
        date: "March 10, 2023",
        condition: "Migraine",
        confidence: 92,
        symptoms: ["Severe headache", "Sensitivity to light", "Nausea"],
      },
    ],
    healthMetrics: {
      checkupFrequency: "Medium",
      lastCheckup: "3 months ago",
      completedChecks: 12,
    },
  })

  const handleUploadDocuments = () => {
    // Mock file upload functionality
    alert("Document upload would be initiated here")
  }

  const toggleSidebar = () => {
    setToggle(prev => !prev);
  }

  return (
    <div className="flex min-h-screen bg-slate-50">

      <div>
        {toggle ? <DashboardSidebar /> : ""}
      </div>

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
  <div>
    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
    <p className="text-slate-600">Welcome back, {userData.name}</p>
  </div>

  <div className="flex items-center gap-4">
    <button asChild className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md">
      <Link href="/symptom-checker">
        New Symptom Check
      </Link>
    </button>
    
    <button
      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
      onClick={toggleSidebar}
    >
      Menu
    </button>
  </div>
</div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Health Checks</CardTitle>
                <CardDescription>Total symptom checks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-slate-900">{userData.healthMetrics.completedChecks}</div>
                  <FileText className="h-8 w-8 text-teal-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Last Check-up</CardTitle>
                <CardDescription>Time since last medical visit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-slate-900">{userData.healthMetrics.lastCheckup}</div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Check Frequency</CardTitle>
                <CardDescription>How often you check symptoms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-slate-900">{userData.healthMetrics.checkupFrequency}</div>
                  <Clock className="h-8 w-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="history" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 md:w-auto">
              <TabsTrigger value="history">Diagnosis History</TabsTrigger>
              <TabsTrigger value="documents">Health Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Diagnoses</CardTitle>
                  <CardDescription>Your symptom check history and results</CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.recentDiagnoses.length > 0 ? (
                    <div className="space-y-6">
                      {userData.recentDiagnoses.map((diagnosis, index) => (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row justify-between gap-4 pb-4 border-b border-slate-200 last:border-0 last:pb-0"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900">{diagnosis.condition}</h3>
                              <Badge className="bg-teal-600">{diagnosis.confidence}%</Badge>
                            </div>
                            <p className="text-sm text-slate-500">
                              {diagnosis.date} • Report ID: {diagnosis.id}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {diagnosis.symptoms.map((symptom, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 md:self-center">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/diagnosis-report?id=${diagnosis.id}`}>View Report</Link>
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-500">No diagnosis history yet</p>
                      <Button asChild className="mt-4">
                        <Link href="/symptom-checker">Start Your First Check</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Documents</CardTitle>
                  <CardDescription>Upload and manage your health records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                    <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Upload className="h-6 w-6 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Upload Health Documents</h3>
                    <p className="text-slate-500 mb-4 max-w-md mx-auto">
                      Drag and drop files here, or click the button below to browse files from your computer.
                    </p>
                    <Button onClick={handleUploadDocuments}>Upload Documents</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Health Insights</CardTitle>
              <CardDescription>Personalized insights based on your health data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-medium text-blue-800 mb-2">Seasonal Health Tip</h3>
                  <p className="text-blue-700">
                    Based on your recent symptom checks, consider taking allergy precautions as pollen counts are high
                    this season.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Health Check Completion</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-500">Symptom Tracking</span>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-500">Document Uploads</span>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-slate-500">Profile Completion</span>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
