"use client"

import { useState } from "react"
import type { TestPipeline, PipelineStage, SubStep, ExecutionStep } from "@/lib/mock-data"
import { CheckCircle, AlertCircle, Loader, Circle, ChevronDown, ChevronUp, Clock, User, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"

interface CompactPipelineFlowProps {
  pipeline: TestPipeline
  selectedStageId: string | null
  onStageSelect: (stageId: string) => void
}

export function CompactPipelineFlow({ pipeline, selectedStageId, onStageSelect }: CompactPipelineFlowProps) {
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set())
  const [expandedSubSteps, setExpandedSubSteps] = useState<Set<string>>(new Set())

  const toggleStageExpansion = (stageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newExpanded = new Set(expandedStages)
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId)
    } else {
      newExpanded.add(stageId)
    }
    setExpandedStages(newExpanded)
  }

  const toggleSubStepExpansion = (subStepId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newExpanded = new Set(expandedSubSteps)
    if (newExpanded.has(subStepId)) {
      newExpanded.delete(subStepId)
    } else {
      newExpanded.add(subStepId)
    }
    setExpandedSubSteps(newExpanded)
  }

  const getStatusIcon = (status: string, size: "xs" | "sm" | "md" = "sm") => {
    const sizeClass = size === "xs" ? "w-3 h-3" : size === "sm" ? "w-4 h-4" : "w-5 h-5"
    switch (status) {
      case "completed":
        return <CheckCircle className={`${sizeClass} text-emerald-500`} />
      case "running":
        return <Loader className={`${sizeClass} text-blue-500 animate-spin`} />
      case "failed":
        return <AlertCircle className={`${sizeClass} text-red-500`} />
      case "pending":
        return <Circle className={`${sizeClass} text-gray-400`} />
      case "skipped":
        return <Circle className={`${sizeClass} text-amber-400`} />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-emerald-200 bg-emerald-50/50"
      case "running":
        return "border-blue-200 bg-blue-50/50"
      case "failed":
        return "border-red-200 bg-red-50/50"
      case "pending":
        return "border-gray-200 bg-gray-50/30"
      case "skipped":
        return "border-amber-200 bg-amber-50/50"
      default:
        return "border-gray-200 bg-gray-50/30"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "running":
        return "bg-blue-100 text-blue-700 border-blue-200 animate-pulse"
      case "failed":
        return "bg-red-100 text-red-700 border-red-200"
      case "pending":
        return "bg-gray-100 text-gray-600 border-gray-200"
      case "skipped":
        return "bg-amber-100 text-amber-700 border-amber-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <h3 className="m-0">Pipeline Flow</h3>
          {pipeline.totalDuration && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {pipeline.totalDuration}
            </span>
          )}
        </div>
        <div className="flex gap-2 text-[10px]">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/><span className="text-gray-600">Done</span></span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"/><span className="text-gray-600">Active</span></span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/><span className="text-gray-600">Failed</span></span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-400"/><span className="text-gray-600">Pending</span></span>
        </div>
      </div>

      {/* Compact Stage List */}
      <div className="space-y-2">
        {pipeline.stages.map((stage, stageIndex) => {
          const isExpanded = expandedStages.has(stage.id)
          const isSelected = selectedStageId === stage.id
          const hasSubSteps = stage.subSteps && stage.subSteps.length > 0

          return (
            <div
              key={stage.id}
              className={cn(
                "border rounded-xl overflow-hidden transition-all",
                getStatusColor(stage.status),
                isSelected && "ring-2 ring-blue-400 shadow-md"
              )}
            >
              {/* Main Stage Header */}
              <div
                onClick={() => onStageSelect(stage.id)}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-white/50 transition-colors"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white border-2 border-gray-300 text-[10px] font-bold text-gray-700 flex-shrink-0">
                  {stageIndex + 1}
                </div>
                
                {getStatusIcon(stage.status, "sm")}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="m-0 text-sm">{stage.name}</h3>
                    {stage.category && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{stage.category}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getStatusBadgeColor(stage.status))}>
                    {stage.progress}%
                  </span>
                  {stage.duration && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {stage.duration}
                    </span>
                  )}
                  {hasSubSteps && (
                    <button
                      onClick={(e) => toggleStageExpansion(stage.id, e)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-steps (Test Types) */}
              {isExpanded && hasSubSteps && (
                <div className="px-4 pb-2 space-y-1.5">
                  {stage.subSteps.map((subStep, subIndex) => {
                    const isSubExpanded = expandedSubSteps.has(subStep.id)
                    const hasExecutionSteps = subStep.executionSteps && subStep.executionSteps.length > 0

                    return (
                      <div
                        key={subStep.id}
                        className={cn(
                          "border rounded-lg overflow-hidden ml-8",
                          getStatusColor(subStep.status)
                        )}
                      >
                        {/* Sub-step Header */}
                        <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/50 transition-colors">
                          {getStatusIcon(subStep.status, "xs")}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-gray-900">{subStep.name}</span>
                              {subStep.testType && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-medium">{subStep.testType}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {subStep.duration && (
                              <span className="text-[10px] text-gray-500">{subStep.duration}</span>
                            )}
                            {hasExecutionSteps && (
                              <button
                                onClick={(e) => toggleSubStepExpansion(subStep.id, e)}
                                className="p-0.5 hover:bg-white rounded transition-colors"
                              >
                                {isSubExpanded ? <ChevronUp className="w-3 h-3 text-gray-600" /> : <ChevronDown className="w-3 h-3 text-gray-600" />}
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Execution Steps (Code Creation, Execution, etc.) */}
                        {isSubExpanded && hasExecutionSteps && subStep.executionSteps && (
                          <div className="px-3 pb-2 space-y-1">
                            {subStep.executionSteps.map((execStep, execIndex) => (
                              <div
                                key={execStep.id}
                                className={cn(
                                  "flex items-center gap-2 px-2.5 py-1.5 rounded-md ml-4 text-xs",
                                  getStatusColor(execStep.status)
                                )}
                              >
                                <span className="text-[9px] font-bold text-gray-500 flex-shrink-0">
                                  {stageIndex + 1}.{subIndex + 1}.{execIndex + 1}
                                </span>
                                {getStatusIcon(execStep.status, "xs")}
                                <span className="flex-1 text-[11px] font-medium text-gray-800">{execStep.name}</span>
                                
                                <div className="flex items-center gap-1.5 text-[9px] text-gray-500">
                                  {execStep.agent && (
                                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                      <User className="w-2.5 h-2.5" />
                                      {execStep.agent}
                                    </span>
                                  )}
                                  {execStep.tool && (
                                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">
                                      <Wrench className="w-2.5 h-2.5" />
                                      {execStep.tool}
                                    </span>
                                  )}
                                  {execStep.duration && <span>{execStep.duration}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
