"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, GitBranch, User, Clock, CheckCircle, AlertCircle, Loader, GitCommit, Download } from "lucide-react"
import type { JiraStory, PipelineStageStatus } from "@/lib/mock-data"
import { PipelineStagesViewer } from "./pipeline-stages-viewer"
import { cn } from "@/lib/utils"

interface PipelineListItemProps {
  story: JiraStory
}

export function PipelineListItem({ story }: PipelineListItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null)

  const pipeline = story.testRuns[0]?.pipeline
  if (!pipeline) return null

  const handleDownloadReport = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log(`Downloading report for ${story.jiraId}`)
    // Add your download logic here
  }

  const getStatusColor = (status: PipelineStageStatus | string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "running":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "skipped":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "running":
        return <Loader className="w-4 h-4 animate-spin" />
      case "failed":
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const storyStatus = story.status as PipelineStageStatus

  return (
    <div className="space-y-3">
      <Card
        className={cn("p-4 hover:shadow-md shadow-0 min-w-[280px]", expanded && "bg-muted")}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-2">
            {/* Line 1: Ticket ID and Status */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground font-mono text-xs">#{story.jiraId}</span>
              <Badge className={cn("whitespace-nowrap text-xs", getStatusColor(storyStatus))}>
                {getStatusIcon(storyStatus)}
                <span className="ml-1 text-xs">{storyStatus}</span>
              </Badge>
            </div>

            {/* Line 2: Ticket Name */}
            <h3 className="text-base font-medium text-gray-900 leading-snug">{story.title}</h3>

            {/* Line 3: Branch, Owner, Commit, Execution Time */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px] text-xs text-muted-foreground ">{story.branch}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span className="text-xs text-muted-foreground ">{story.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitCommit className="w-3.5 h-3.5" />
                <span className="font-mono text-xs text-muted-foreground ">{story.commit}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs text-muted-foreground">{pipeline.totalDuration || "Running..."}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-center">
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-blue-600"
              title="Download Report"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Reports</span>
            </button>
            <ChevronDown className={cn("w-5 h-5 transition-transform flex-shrink-0 text-gray-400", expanded && "rotate-180")} />
          </div>
        </div>

        {/* Pipeline progress bar */}
        {/* <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              storyStatus === "completed"
                ? "bg-green-500"
                : storyStatus === "running"
                  ? "bg-blue-500 animate-pulse"
                  : storyStatus === "failed"
                    ? "bg-red-500"
                    : "bg-gray-400",
            )}
            style={{
              width: storyStatus === "completed" 
                ? "100%" 
                : storyStatus === "failed"
                  ? `${pipeline.stages.reduce((sum, s) => sum + s.progress, 0) / pipeline.stages.length}%`
                  : `${Math.min(85, pipeline.stages.reduce((sum, s) => sum + s.progress, 0) / pipeline.stages.length)}%`,
            }}
          />
        </div> */}
      </Card>

      {/* Expanded pipeline view */}
      {expanded && (
        <PipelineStagesViewer
          pipeline={pipeline}
          selectedStageId={selectedStageId}
          onStageSelect={setSelectedStageId}
        />
      )}
    </div>
  )
}
