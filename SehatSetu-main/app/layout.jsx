import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import "./globals.css"
import "./GeminiInput"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SehatSetu - AI-Powered Symptom Checker",
  description: "Get AI-powered insights about your health symptoms",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col">
            <Header />
            {/* <GeminiInput /> */}
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'
import GeminiInput from "./GeminiInput"
