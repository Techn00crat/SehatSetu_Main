"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { BarChart, Calendar, FileText, Home, LogOut, Settings, User, Menu, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { cn } from "../lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardSidebar() {
  const location = useLocation()
  const pathname = location.pathname
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile sidebar trigger */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild className="absolute top-4 left-4 md:hidden z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[240px]">
          <MobileSidebar pathname={pathname} onClose={() => setIsMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow border-r border-slate-200 bg-white overflow-y-auto">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-slate-200">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-teal-600 text-white font-bold rounded-md p-1.5">HA</div>
              <span className="font-bold text-xl">SehatSetu</span>
            </Link>
          </div>
          <div className="flex-grow flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      pathname === item.href ? "text-teal-500" : "text-slate-400 group-hover:text-slate-500",
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-slate-200 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <LogOut className="mr-3 h-5 w-5 text-slate-400" />
              Log out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

function MobileSidebar({ pathname, onClose }) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 border-b border-slate-200">
        <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
          <div className="bg-teal-600 text-white font-bold rounded-md p-1.5">HA</div>
          <span className="font-bold text-xl">SehatSetu</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-grow flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                pathname === item.href
                  ? "bg-teal-50 text-teal-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
              onClick={onClose}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5",
                  pathname === item.href ? "text-teal-500" : "text-slate-400 group-hover:text-slate-500",
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-slate-200 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          onClick={onClose}
        >
          <LogOut className="mr-3 h-5 w-5 text-slate-400" />
          Log out
        </Button>
      </div>
    </div>
  )
}
