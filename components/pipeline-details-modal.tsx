"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PipelineStageCard } from "./pipeline-stage-card"
import { PipelineExecutionLogs } from "./pipeline-execution-logs"
import type { TestPipeline, PipelineStage, SubStep } from "@/lib/mock-data"
import { X, Clock } from "lucide-react"

interface PipelineDetailsModalProps {
  pipeline: TestPipeline | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
  agentName: string
}

export function PipelineDetailsModal({ pipeline, open, onOpenChange, agentName }: PipelineDetailsModalProps) {
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(pipeline?.stages?.[0] || null)
  const [selectedSubStep, setSelectedSubStep] = useState<SubStep | null>(pipeline?.stages?.[0]?.subSteps?.[0] || null)

  if (!pipeline) return null

  const handleSelectStage = (stage: PipelineStage) => {
    setSelectedStage(stage)
    setSelectedSubStep(stage.subSteps?.[0] || null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg">{agentName} - Pipeline Execution</DialogTitle>
              <DialogDescription className="text-xs mt-1">
                {pipeline.totalDuration && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Total Duration: {pipeline.totalDuration}
                  </div>
                )}
              </DialogDescription>
            </div>
            <button onClick={() => onOpenChange(false)} className="p-1 hover:bg-slate-200 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-1 gap-0 overflow-hidden">
          {/* Left Panel - Pipeline Stages */}
          <div className="w-1/3 border-r bg-white overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-slate-50">
              <h3 className="text-sm font-semibold">Pipeline Stages</h3>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                {pipeline.stages.map((stage) => (
                  <PipelineStageCard
                    key={stage.id}
                    stage={stage}
                    isSelected={selectedStage?.id === stage.id}
                    onSelect={handleSelectStage}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Sub-steps and Logs */}
          <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
            {selectedStage && (
              <>
                <div className="p-4 border-b bg-white">
                  <h3 className="text-sm font-semibold">{selectedStage.name} - Sub-steps</h3>
                </div>
                <div className="flex-1 flex gap-4 p-4 overflow-hidden">
                  {/* Sub-steps list */}
                  <div className="w-48 flex flex-col gap-2 overflow-y-auto">
                    {selectedStage.subSteps.map((subStep) => (
                      <Card
                        key={subStep.id}
                        onClick={() => setSelectedSubStep(subStep)}
                        className={`p-3 cursor-pointer transition-all border-2 ${
                          selectedSubStep?.id === subStep.id
                            ? "border-primary bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <p className="text-xs font-medium truncate">{subStep.name}</p>
                        <Badge
                          variant="outline"
                          className={`mt-1 text-[10px] capitalize ${
                            subStep.status === "completed"
                              ? "bg-green-100 text-green-700 border-green-300"
                              : subStep.status === "running"
                                ? "bg-blue-100 text-blue-700 border-blue-300"
                                : "bg-gray-100 text-gray-700 border-gray-300"
                          }`}
                        >
                          {subStep.status}
                        </Badge>
                      </Card>
                    ))}
                  </div>

                  {/* Execution logs */}
                  <div className="flex-1">
                    <PipelineExecutionLogs subStep={selectedSubStep} selectedStageId={selectedStage.id} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
