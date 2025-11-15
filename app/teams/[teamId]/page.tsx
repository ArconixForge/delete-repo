"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import { mockTeams } from "@/lib/mock-data"
import { PipelineListItem } from "@/components/pipeline-list-item"
import { AppHeader } from "@/components/app-header"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Package, ExternalLink, Activity } from "lucide-react"

interface TeamPageProps {
  params: Promise<{ teamId: string }>
}

export default function TeamPage({ params }: TeamPageProps) {
  const { teamId } = use(params)
  const team = mockTeams.find((t) => t.id === teamId)

  if (!team) {
    notFound()
  }

  const runningPipelines = team.stories.filter((s) => s.status === "running").length
  const completedPipelines = team.stories.filter((s) => s.status === "completed").length
  const failedPipelines = team.stories.filter((s) => s.status === "failed").length

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
            { label: `/ ${team.name}` },
          ]}
        />

      <div className="container mx-auto px-6">
        {/* Team Header Card */}
        <div className="rounded-[var(--radius-3xl)] border border-[#e7e7e7] bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] transition-all duration-[0.3s] ease-[var(--default-transition-timing-function)] overflow-hidden relative min-w-[280px] mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="mb-2">{team.name}</h1>
              <p>{team.description}</p>
            </div>
            <div className="flex items-center gap-2">
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

          {/* Project Info */}
          <div className="flex items-center gap-8 text-xs border-t pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="w-4 h-4" />
              <span className="font-medium text-xs">Project:</span>
              <span className="text-foreground text-xs">{team.project}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <GitBranch className="w-4 h-4" />
              <span className="font-medium text-xs">Repository:</span>
              <a
                href={team.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
              >
                {team.repository}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Pipelines Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="mb-0">Test Pipelines</h2>
            <p className="text-sm text-gray-600">{team.stories.length} test runs</p>
          </div>

          <div className="space-y-3">
            {team.stories.map((story) => (
              <PipelineListItem key={story.id} story={story} />
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
