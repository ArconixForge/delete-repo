"use client"

import { useState } from "react"
import type { TestPipeline, PipelineStage, SubStep } from "@/lib/mock-data"
import { CheckCircle, AlertCircle, Loader, Circle, ChevronDown, ChevronRight, User, Wrench, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PipelineFlowDiagramProps {
  pipeline: TestPipeline
  selectedStageId: string | null
  onStageSelect: (stageId: string) => void
}

export function PipelineFlowDiagram({ pipeline, selectedStageId, onStageSelect }: PipelineFlowDiagramProps) {
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
    const sizeClass = size === "xs" ? "w-2.5 h-2.5" : size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-emerald-500",
          border: "border-emerald-300",
          lightBg: "bg-emerald-50",
          text: "text-emerald-700",
          connector: "bg-emerald-400",
        }
      case "running":
        return {
          bg: "bg-blue-500",
          border: "border-blue-300",
          lightBg: "bg-blue-50",
          text: "text-blue-700",
          connector: "bg-blue-400",
        }
      case "failed":
        return {
          bg: "bg-red-500",
          border: "border-red-300",
          lightBg: "bg-red-50",
          text: "text-red-700",
          connector: "bg-red-400",
        }
      case "pending":
        return {
          bg: "bg-gray-400",
          border: "border-gray-300",
          lightBg: "bg-gray-50",
          text: "text-gray-600",
          connector: "bg-gray-300",
        }
      default:
        return {
          bg: "bg-gray-400",
          border: "border-gray-300",
          lightBg: "bg-gray-50",
          text: "text-gray-600",
          connector: "bg-gray-300",
        }
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <h3 className="m-0">Pipeline Flow Diagram</h3>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Completed
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Running
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Failed
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            Pending
          </span>
        </div>
      </div>

      {/* Flow Diagram */}
      <div className="overflow-x-auto overflow-y-visible pb-4">
        <div className="flex items-start gap-4 min-w-max p-4">
          {pipeline.stages.map((stage, stageIndex) => {
            const colors = getStatusColor(stage.status)
            const isExpanded = expandedStages.has(stage.id)
            const isSelected = selectedStageId === stage.id
            const hasSubSteps = stage.subSteps && stage.subSteps.length > 0

            return (
              <div key={stage.id} className="flex items-start relative">
                {/* Stage Column */}
                <div className="flex flex-col items-center relative" style={{ minWidth: '200px' }}>
                  {/* Main Stage Node */}
                  <div
                    onClick={() => onStageSelect(stage.id)}
                    className={cn(
                      "relative cursor-pointer group transition-all",
                      isSelected && "scale-105"
                    )}
                  >
                    <div
                      className={cn(
                        "w-48 border-2 rounded-xl bg-white shadow-md hover:shadow-lg transition-all p-3",
                        isSelected ? `${colors.border} ring-4 ring-opacity-30 ${colors.lightBg}` : "border-gray-200",
                      )}
                    >
                      {/* Stage Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", colors.bg)}>
                          {getStatusIcon(stage.status, "sm")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-gray-900">{stage.name}</div>
                          <div className="text-[9px] text-gray-500">{stage.duration || "---"}</div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full transition-all", colors.bg)}
                            style={{ width: `${stage.progress}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-gray-500 mt-0.5 text-right">{stage.progress}%</div>
                      </div>

                      {/* Expand Button */}
                      {hasSubSteps && (
                        <button
                          onClick={(e) => toggleStageExpansion(stage.id, e)}
                          className={cn(
                            "w-full text-[10px] py-1 rounded flex items-center justify-center gap-1 transition-colors",
                            colors.lightBg,
                            colors.text,
                            "hover:opacity-80"
                          )}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronDown className="w-3 h-3" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronRight className="w-3 h-3" />
                              Show {stage.subSteps.length} Steps
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sub-steps (Test Types) - Vertical Expansion */}
                  {isExpanded && hasSubSteps && (
                    <div className="mt-4 space-y-4 w-48 relative z-10">
                      {/* Connector from stage to first substep */}
                      <div className={cn("absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4", colors.connector)} />
                      
                      {stage.subSteps.map((subStep, subIndex) => {
                        const subColors = getStatusColor(subStep.status)
                        const isSubExpanded = expandedSubSteps.has(subStep.id)
                        const hasExecutionSteps = subStep.executionSteps && subStep.executionSteps.length > 0

                        return (
                          <div key={subStep.id} className="relative">
                            {/* Sub-step Card */}
                            <div
                              className={cn(
                                "border-2 rounded-lg bg-white shadow-sm p-2.5 hover:shadow-md transition-shadow",
                                subColors.border,
                                subColors.lightBg
                              )}
                            >
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", subColors.bg)}>
                                  {getStatusIcon(subStep.status, "xs")}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-[10px] font-bold text-gray-900">{subStep.name}</div>
                                  {subStep.testType && (
                                    <div className="text-[8px] text-purple-600 font-medium">{subStep.testType}</div>
                                  )}
                                </div>
                              </div>

                              {subStep.duration && (
                                <div className="text-[8px] text-gray-500 mb-1">{subStep.duration}</div>
                              )}

                              {/* Expand Execution Steps */}
                              {hasExecutionSteps && (
                                <button
                                  onClick={(e) => toggleSubStepExpansion(subStep.id, e)}
                                  className="w-full text-[9px] py-0.5 rounded flex items-center justify-center gap-1 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                  {isSubExpanded ? (
                                    <>
                                      <ChevronDown className="w-2.5 h-2.5" />
                                      Hide
                                    </>
                                  ) : (
                                    <>
                                      <ChevronRight className="w-2.5 h-2.5" />
                                      {subStep.executionSteps?.length || 0} Steps
                                    </>
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Execution Steps (Code Creation, Execution, etc.) */}
                            {isSubExpanded && hasExecutionSteps && subStep.executionSteps && (
                              <div className="mt-2 ml-4 space-y-0 relative">
                                {/* Vertical connector line for execution steps */}
                                <div className={cn("absolute left-0 top-2 bottom-2 w-0.5", subColors.connector)} />
                                
                                {subStep.executionSteps?.map((execStep, execIndex) => {
                                  const execColors = getStatusColor(execStep.status)
                                  return (
                                    <div key={execStep.id} className="relative mb-2">
                                      {/* Horizontal connector from vertical line */}
                                      <div className={cn("absolute left-0 top-1/2 w-3 h-0.5", subColors.connector)} />
                                      
                                      <div
                                        className={cn(
                                          "text-[9px] p-2 rounded-lg border shadow-sm hover:shadow transition-shadow ml-3",
                                          execColors.lightBg,
                                          execColors.border
                                        )}
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-1.5">
                                            {getStatusIcon(execStep.status, "xs")}
                                            <span className="font-bold text-gray-900 text-[10px]">{execStep.name}</span>
                                          </div>
                                          {execStep.duration && (
                                            <span className="text-[9px] text-gray-600 font-semibold bg-gray-100 px-2 py-0.5 rounded">{execStep.duration}</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}

                            {/* Connector Line to Next Sub-step */}
                            {subIndex < stage.subSteps.length - 1 && (
                              <div className={cn("absolute -bottom-2 left-1/2 -translate-x-1/2 w-0.5 h-4", colors.connector)} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Horizontal Connector Arrow to Next Stage */}
                {stageIndex < pipeline.stages.length - 1 && (
                  <div className="flex items-start" style={{ marginTop: '48px' }}>
                    <div className="flex items-center gap-0.5">
                      <div className={cn("h-0.5 w-4", colors.connector)} />
                      <ArrowRight className={cn("w-4 h-4", colors.text)} />
                      <div className={cn("h-0.5 w-4", colors.connector)} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Timeline Footer */}
      {pipeline.totalDuration && (
        <div className="mt-6 pt-4 border-t flex items-center justify-between text-[10px] text-gray-600">
          <span>
            <span className="font-semibold">Total Duration:</span> {pipeline.totalDuration}
          </span>
          <span>
            <span className="font-semibold">Started:</span> {new Date(pipeline.startTime).toLocaleString()}
          </span>
        </div>
      )}
    </div>
  )
}
