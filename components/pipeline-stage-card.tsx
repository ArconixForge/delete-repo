"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, CheckCircle2, AlertCircle, Clock, SkipForward } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PipelineStage } from "@/lib/mock-data"

interface PipelineStageCardProps {
  stage: PipelineStage
  isSelected: boolean
  onSelect: (stage: PipelineStage) => void
}

const stageIcons = {
  completed: CheckCircle2,
  failed: AlertCircle,
  running: Clock,
  pending: Clock,
  skipped: SkipForward,
}

const stageColors = {
  completed: "border-green-200 bg-green-50",
  failed: "border-red-200 bg-red-50",
  running: "border-blue-200 bg-blue-50 animate-pulse",
  pending: "border-gray-200 bg-gray-50",
  skipped: "border-gray-200 bg-gray-100",
}

const badgeColors = {
  completed: "bg-green-100 text-green-700 border-green-300",
  failed: "bg-red-100 text-red-700 border-red-300",
  running: "bg-blue-100 text-blue-700 border-blue-300",
  pending: "bg-gray-100 text-gray-700 border-gray-300",
  skipped: "bg-gray-200 text-gray-600 border-gray-400",
}

export function PipelineStageCard({ stage, isSelected, onSelect }: PipelineStageCardProps) {
  const [expanded, setExpanded] = useState(false)
  const Icon = stageIcons[stage.status]

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  return (
    <div className="space-y-2">
      <Card
        onClick={() => onSelect(stage)}
        className={`p-4 border-2 ${stageColors[stage.status]} ${isSelected ? "ring-2 ring-primary" : ""} min-w-[280px]`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Icon
              className={`w-5 h-5 flex-shrink-0 ${stage.status === "completed" ? "text-green-600" : stage.status === "failed" ? "text-red-600" : stage.status === "running" ? "text-blue-600" : "text-gray-400"}`}
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-sm">{stage.name}</h4>
              {stage.duration && <p className="text-xs text-muted-foreground">{stage.duration}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={`border ${badgeColors[stage.status]} capitalize text-xs`}>{stage.status}</Badge>
            {stage.status === "running" && <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />}
            <button onClick={toggleExpand} className="p-1">
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${stage.progress}%` }} />
        </div>
      </Card>

      {/* Sub-steps */}
      {expanded && (
        <div className="ml-4 space-y-2">
          {stage.subSteps.map((subStep) => (
            <Card key={subStep.id} className="p-2 border bg-gray-50">
              <div className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${subStep.status === "completed" ? "bg-green-600" : subStep.status === "running" ? "bg-blue-600 animate-pulse" : "bg-gray-300"}`}
                />
                <span className="text-xs font-medium">{subStep.name}</span>
                {subStep.duration && <span className="text-xs text-muted-foreground ml-auto">{subStep.duration}</span>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
