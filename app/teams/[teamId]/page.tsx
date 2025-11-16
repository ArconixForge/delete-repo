"use client"

import { useParams } from "next/navigation"
import { useGlobalState } from "@/contexts/GlobalStateProvider"
import { PipelineListItem } from "@/components/pipeline-list-item"
import { AppHeader } from "@/components/app-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitBranch, Package, ExternalLink, Activity, Loader } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TeamPageProps {}

// Define the filterable statuses
type FilterStatus = "all" | "running" | "completed" | "failed" | "partial"
const filterButtons: FilterStatus[] = ["all", "running", "completed", "failed", "partial"]

// --- Static "Mock" Data for Header ---
// As requested, this data is "still" and loads instantly.
// It's used to populate the header card text.
const staticMockData: { [key: string]: { name: string, description: string, project: string, repository: string, repositoryUrl: string } } = {
  "QEA": {
    name: "Mobile Banking Team",
    description: "iOS and Android mobile banking applications",
    project: "Retail Banking Platform",
    repository: "rmb-mobile-banking-tf",
    repositoryUrl: "https://github.com/example/rmb-mobile-banking-tf" // URL placeholder
  },
  // Add other static team details here if needed
}
// --- End Static Data ---


export default function TeamPage({}: TeamPageProps) {
  const params = useParams()
  const teamId = params.teamId as string

  // --- 1. Get STATIC data for the header ---
  // This renders the header text instantly.
  const staticTeam = staticMockData[teamId] || {
    name: "Loading Team...",
    description: "Loading description...",
    project: "...",
    repository: "...",
    repositoryUrl: "#"
  }

  // --- 2. Get DYNAMIC data from the live stream ---
  const { teams, connectionStatus } = useGlobalState()
  // This will be 'undefined' until data arrives.
  const dynamicTeam = teams.find((t) => t.id === teamId)

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  // --- 3. Derive DYNAMIC stats and lists ---
  // These all use the 'dynamicTeam' object, so they will be '0' or '[]'
  // until the live stream provides data.
  const filteredStories = (dynamicTeam?.stories || []).filter(story => {
    if (filterStatus === 'all') return true;
    return story.status === filterStatus;
  }).sort((a, b) => {
    // Sort by start time - latest first (descending order)
    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  });

  const runningPipelines = (dynamicTeam?.stories || []).filter((s) => s.status === "running").length
  const completedPipelines = (dynamicTeam?.stories || []).filter((s) => s.status === "completed").length
  const failedPipelines = (dynamicTeam?.stories || []).filter((s) => s.status === "failed").length
  const allPipelinesCount = (dynamicTeam?.stories || []).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Video Background */}
      <div className="video-background-container">
        <video className="homepage-video-background" autoPlay loop playsInline muted>
          <source src="https://res.cloudinary.com/dssum8oc4/video/upload/v1761675074/homepage_kwp4ct.webm" type="video/webm" />
          <source src="https://res.cloudinary.com/dssum8oc4/video/upload/v1761675074/homepage_kwp4ct.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="relative z-10">
        <AppHeader
          breadcrumbs={[
            // Breadcrumb uses the static mock name
            { label: `/ ${staticTeam.name}` },
          ]}
        />

      <div className="container mx-auto px-6">
        {/* === Team Header Card (Hybrid) === */}
        {/* Text is from 'staticTeam', Stats are from 'dynamicTeam' */}
        <div className="rounded-[var(--radius-3xl)] border border-[#e7e7e7] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-all duration-[0.3s] ease-[var(--default-transition-timing-function)] overflow-hidden relative min-w-[280px] mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              {/* STATIC Text */}
              <h1 className="mb-2">{staticTeam.name}</h1>
              <p>{staticTeam.description}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* DYNAMIC Stats */}
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <Activity className="w-3 h-3 mr-1" />
                {runningPipelines} Running
              </Badge>
              <Badge variant="outline" className="border-blue-200 bg-blue-50">
                {completedPipelines} Completed
              </Badge>
              {failedPipelines > 0 && (
                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                  {failedPipelines} Failed
                </Badge>
              )}
            </div>
          </div>

          {/* Project Info (STATIC Text) */}
          <div className="flex items-center gap-8 text-xs border-t pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="w-4 h-4" />
              <span className="font-medium text-xs">Project:</span>
              <span className="text-foreground text-xs">{staticTeam.project}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <GitBranch className="w-4 h-4" />
              <span className="font-medium text-xs">Repository:</span>
              <a
                href={staticTeam.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                {staticTeam.repository}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* === Pipelines Section (Fully Dynamic) === */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="mb-0">Test Pipelines</h2>
          <div className="flex gap-2">
            {filterButtons.map(status => {
              const count = status === 'all' 
                ? allPipelinesCount 
                : (dynamicTeam?.stories || []).filter(s => s.status === status).length;
              
              return (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "capitalize",
                    filterStatus === status 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-white text-gray-700"
                  )}
                >
                  {status}
                  <span className={cn(
                    "ml-2 px-1.5 py-0.5 rounded-full text-xs",
                    filterStatus === status 
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {count}
                  </span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Render the dynamic list or the loader */}
        <div className="space-y-3">
          
          {/* 1. Show LOADER if 'dynamicTeam' is not yet defined */}
          {!dynamicTeam && (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-white/50 rounded-lg border">
              <Loader className="w-12 h-12 text-gray-400 animate-spin mb-4" />
              <p className="text-gray-700 font-medium">
                {connectionStatus === 'connected'
                  ? 'Live Stream Connected. Waiting for data...'
                  : 'Connecting to live stream...'}
              </p>
              <p className="text-sm text-gray-500">
                {connectionStatus === 'connected'
                  ? `Waiting for logs for project: ${teamId}`
                  : 'Loading team data.'}
              </p>
            </div>
          )}

          {/* 2. Show the LIST if 'dynamicTeam' exists AND stories are found */}
          {dynamicTeam && filteredStories.length > 0 && (
            filteredStories.map((story) => (
              <PipelineListItem key={story.id} story={story} />
            ))
          )}
          
          {/* 3. Show "No pipelines" if 'dynamicTeam' exists but NO stories match filter */}
          {dynamicTeam && filteredStories.length === 0 && (
            <div className="text-center py-12 bg-white/50 rounded-lg border border-gray-200">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No pipelines found{filterStatus !== 'all' ? ` with status: ${filterStatus}` : ''}</p>
            </div>
          )}
        </div>

      </div>
      </div>
    </div>
  )
}