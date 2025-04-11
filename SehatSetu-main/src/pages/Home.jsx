import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ArrowRight, CheckCircle, Shield, Star } from "lucide-react"
import TestimonialCard from "../components/TestimonialCard"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900">AI-Powered Health Insights</h1>
          <p className="text-xl text-slate-600 max-w-2xl">
            Get instant, AI-powered analysis of your symptoms and health concerns. Our advanced technology helps you
            understand potential conditions and next steps for your health journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
              <Link to="/symptom-checker">
                Start Symptom Check <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src="https://placehold.co/400x400/e2e8f0/1e293b?text=SehatSetu"
            alt="AI Healthcare Illustration"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50 rounded-xl my-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">How SehatSetu Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Enter Your Symptoms</h3>
              <p className="text-slate-600">
                Describe your symptoms in detail or use our guided symptom selector to help the AI understand your
                condition.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">AI Analysis</h3>
              <p className="text-slate-600">
                Our advanced AI analyzes your symptoms against a vast database of medical knowledge to identify
                potential conditions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Get Insights</h3>
              <p className="text-slate-600">
                Receive a detailed report with potential conditions, recommended next steps, and resources to help you
                make informed decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <TestimonialCard
            quote="SehatSetu helped me understand my symptoms before my doctor's appointment. It made the conversation with my physician much more productive."
            author="Sarah J."
            role="Patient"
          />
          <TestimonialCard
            quote="As a healthcare professional, I'm impressed with the accuracy of SehatSetu's symptom analysis. It's a valuable tool for patients."
            author="Dr. Michael Chen"
            role="Family Physician"
          />
          <TestimonialCard
            quote="The interface is so intuitive, and the results are easy to understand. It helped ease my anxiety about some symptoms I was experiencing."
            author="James Wilson"
            role="User"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl py-16 my-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to check your symptoms?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get started with HealthAI today and take the first step toward understanding your health better.
          </p>
          <Button asChild size="lg" className="bg-white text-teal-600 hover:bg-slate-100">
            <Link to="/symptom-checker">
              Start Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
