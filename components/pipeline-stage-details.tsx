"use client"

import { useState } from "react"
import type { PipelineStage } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PipelineStageDetailsProps {
  stage: PipelineStage
}

export function PipelineStageDetails({ stage }: PipelineStageDetailsProps) {
  const [selectedSubStep, setSelectedSubStep] = useState<string | null>(stage.subSteps[0]?.id || null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "running":
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "pending":
        return <Circle className="w-4 h-4 text-gray-400" />
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left panel: Sub-steps - Compact */}
      <Card className="p-4 border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="m-0 text-sm">Stage Details</h3>
          <span className="text-[10px] text-gray-500 px-2 py-0.5 bg-gray-100 rounded">{stage.subSteps.length} steps</span>
        </div>
        <div className="space-y-1.5">
          {stage.subSteps.map((subStep, index) => (
            <button
              key={subStep.id}
              onClick={() => setSelectedSubStep(subStep.id)}
              className={cn(
                "w-full p-2.5 rounded-lg border transition-all text-left flex items-start gap-2 group",
                selectedSubStep === subStep.id
                  ? "bg-blue-50 border-blue-300 shadow-sm"
                  : "hover:bg-gray-50 border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 border-gray-300 text-[10px] font-bold text-gray-600 flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {getStatusIcon(subStep.status)}
                  <p className="text-xs font-semibold text-gray-900 truncate m-0">{subStep.name}</p>
                </div>
                {subStep.duration && (
                  <p className="text-[10px] text-gray-500 m-0">{subStep.duration}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Right panel: Execution logs - Compact */}
      <Card className="p-4 border-gray-200 shadow-sm">
        <div className="mb-3">
          <h3 className="m-0 text-sm mb-0.5">Execution Logs</h3>
          {selectedSubStep && (
            <p className="text-[10px] text-gray-500 m-0">
              {stage.subSteps.find((s) => s.id === selectedSubStep)?.name}
            </p>
          )}
        </div>
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-green-400 p-3 rounded-lg font-mono text-[10px] space-y-0.5 max-h-[400px] overflow-y-auto shadow-inner border border-gray-700">
          {selectedSubStep ? (
            stage.subSteps
              .find((subStep) => subStep.id === selectedSubStep)
              ?.logs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap break-words hover:bg-gray-800/50 px-2 py-0.5 rounded transition-colors">
                  {log}
                </div>
              ))
          ) : (
            <div className="text-gray-500 italic text-center py-6 text-xs">Select a step to view logs</div>
          )}
        </div>
      </Card>
    </div>
  )
}
