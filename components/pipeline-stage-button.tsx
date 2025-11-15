"use client"
import type { PipelineStage } from "@/lib/mock-data"
import { CheckCircle, AlertCircle, Loader, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PipelineStageButtonProps {
  stage: PipelineStage
  isSelected: boolean
  onClick: () => void
}

export function PipelineStageButton({ stage, isSelected, onClick }: PipelineStageButtonProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "running":
        return <Loader className="w-4 h-4 animate-spin" />
      case "failed":
        return <AlertCircle className="w-4 h-4" />
      case "pending":
        return <Circle className="w-4 h-4" />
      case "skipped":
        return <Circle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "running":
        return "text-blue-600"
      case "failed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg border transition-all text-left",
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50",
      )}
    >
      <div className={cn("flex items-center gap-2", getStatusColor(stage.status))}>
        {getStatusIcon(stage.status)}
        <span className="text-sm font-medium">{stage.name}</span>
      </div>
      {stage.duration && <p className="text-xs text-muted-foreground mt-1">{stage.duration}</p>}
    </button>
  )
}
