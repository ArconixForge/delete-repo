"use client"

import { useState } from "react"
import type { TestPipeline, PipelineStage, SubStep } from "@/lib/mock-data"
import { CheckCircle, AlertCircle, Loader, Circle, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedPipelineFlowProps {
  pipeline: TestPipeline
  selectedStageId: string | null
  onStageSelect: (stageId: string) => void
}

export function EnhancedPipelineFlow({ pipeline, selectedStageId, onStageSelect }: EnhancedPipelineFlowProps) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set())

  const toggleStageExpansion = (stageId: string) => {
    const newExpanded = new Set(expandedStages)
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId)
    } else {
      newExpanded.add(stageId)
    }
    setExpandedStages(newExpanded)
  }

  const getStatusIcon = (status: string, size: "sm" | "md" = "md") => {
    const sizeClass = size === "sm" ? "w-3 h-3" : "w-5 h-5"
    switch (status) {
      case "completed":
        return <CheckCircle className={`${sizeClass} text-white`} />
      case "running":
        return <Loader className={`${sizeClass} text-white animate-spin`} />
      case "failed":
        return <AlertCircle className={`${sizeClass} text-white`} />
      case "pending":
        return <Circle className={`${sizeClass} text-white/60`} />
      case "skipped":
        return <Circle className={`${sizeClass} text-white/40`} />
      default:
        return null
    }
  }

  const getStageColor = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-gradient-to-br from-green-400 to-green-600",
          ring: "ring-green-200",
          shadow: "shadow-green-200/50",
          text: "text-green-700",
          lightBg: "bg-green-50",
          border: "border-green-200",
        }
      case "running":
        return {
          bg: "bg-gradient-to-br from-blue-400 to-blue-600",
          ring: "ring-blue-200",
          shadow: "shadow-blue-200/50",
          text: "text-blue-700",
          lightBg: "bg-blue-50",
          border: "border-blue-200",
        }
      case "failed":
        return {
          bg: "bg-gradient-to-br from-red-400 to-red-600",
          ring: "ring-red-200",
          shadow: "shadow-red-200/50",
          text: "text-red-700",
          lightBg: "bg-red-50",
          border: "border-red-200",
        }
      case "pending":
        return {
          bg: "bg-gradient-to-br from-gray-300 to-gray-400",
          ring: "ring-gray-200",
          shadow: "shadow-gray-200/50",
          text: "text-gray-600",
          lightBg: "bg-gray-50",
          border: "border-gray-200",
        }
      case "skipped":
        return {
          bg: "bg-gradient-to-br from-yellow-300 to-yellow-500",
          ring: "ring-yellow-200",
          shadow: "shadow-yellow-200/50",
          text: "text-yellow-700",
          lightBg: "bg-yellow-50",
          border: "border-yellow-200",
        }
      default:
        return {
          bg: "bg-gradient-to-br from-gray-300 to-gray-400",
          ring: "ring-gray-200",
          shadow: "shadow-gray-200/50",
          text: "text-gray-600",
          lightBg: "bg-gray-50",
          border: "border-gray-200",
        }
    }
  }

  const getConnectionLineColor = (currentStatus: string, nextStatus: string) => {
    if (currentStatus === "completed") {
      return "bg-gradient-to-r from-green-500 to-gray-300"
    }
    if (currentStatus === "running") {
      return "bg-gradient-to-r from-blue-500 to-gray-300"
    }
    if (currentStatus === "failed") {
      return "bg-gradient-to-r from-red-500 to-gray-300"
    }
    return "bg-gray-300"
  }

  return (
    <div className="space-y-6">
      {/* Main Pipeline Flow */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3>Pipeline Execution Flow</h3>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-blue-600" />
              <span>Running</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-600" />
              <span>Failed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-300 to-gray-400" />
              <span>Pending</span>
            </div>
          </div>
        </div>

        {/* Horizontal Flow */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-max">
            <div className="flex items-start gap-0">
              {pipeline.stages.map((stage, index) => {
                const colors = getStageColor(stage.status)
                const isExpanded = expandedStages.has(stage.id)
                const isSelected = selectedStageId === stage.id
                const hasSubSteps = stage.subSteps && stage.subSteps.length > 0

                return (
                  <div key={stage.id} className="flex items-start">
                    {/* Stage Column */}
                    <div className="flex flex-col items-center">
                      {/* Main Stage Node */}
                      <div className="relative">
                        <button
                          onClick={() => onStageSelect(stage.id)}
                          className={cn(
                            "group flex flex-col items-center justify-center w-32 p-4 rounded-xl transition-all duration-200",
                            "border-2 bg-white hover:scale-105",
                            isSelected ? `${colors.border} ${colors.lightBg} ring-4 ${colors.ring}` : "border-gray-200",
                          )}
                        >
                          <div className={cn(
                            "flex items-center justify-center w-12 h-12 rounded-full mb-2 shadow-lg",
                            colors.bg,
                            colors.shadow,
                          )}>
                            {getStatusIcon(stage.status)}
                          </div>
                          <span className={cn("text-xs font-semibold text-center", colors.text)}>
                            {stage.name}
                          </span>
                          {stage.duration && (
                            <span className="text-[10px] text-gray-500 mt-1">{stage.duration}</span>
                          )}
                          <div className={cn(
                            "absolute -bottom-0 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium",
                            colors.lightBg,
                            colors.text,
                          )}>
                            {stage.progress}%
                          </div>
                        </button>

                        {/* Expand Button for Sub-steps */}
                        {hasSubSteps && (
                          <button
                            onClick={() => toggleStageExpansion(stage.id)}
                            className={cn(
                              "absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center",
                              "w-6 h-6 rounded-full border-2 bg-white shadow-md transition-all hover:scale-110",
                              colors.border,
                              colors.text,
                            )}
                          >
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </button>
                        )}
                      </div>

                      {/* Sub-steps - Expanded View */}
                      {isExpanded && hasSubSteps && (
                        <div className="mt-12 flex flex-col gap-2 w-32">
                          {stage.subSteps.map((subStep, subIndex) => {
                            const subColors = getStageColor(subStep.status)
                            return (
                              <div
                                key={subStep.id}
                                className={cn(
                                  "flex items-center gap-2 p-2 rounded-lg border transition-all hover:scale-105",
                                  subColors.lightBg,
                                  subColors.border,
                                )}
                              >
                                <div className={cn("flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center", subColors.bg)}>
                                  {getStatusIcon(subStep.status, "sm")}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-medium text-gray-900 truncate">{subStep.name}</p>
                                  {subStep.duration && (
                                    <p className="text-[9px] text-gray-500">{subStep.duration}</p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Connection Line */}
                    {index < pipeline.stages.length - 1 && (
                      <div className="flex items-center pt-12">
                        <div className={cn(
                          "h-1 w-16 rounded-full",
                          getConnectionLineColor(stage.status, pipeline.stages[index + 1].status),
                        )} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Timeline */}
        {pipeline.totalDuration && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">Total Duration:</span>
                <span className="font-bold text-black">{pipeline.totalDuration}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium">Started:</span>
                <span className="text-black">{new Date(pipeline.startTime).toLocaleTimeString()}</span>
              </div>
              {pipeline.endTime && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">Ended:</span>
                  <span className="text-black">{new Date(pipeline.endTime).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
