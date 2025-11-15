"use client"
import type { TestPipeline } from "@/lib/mock-data"
import { PipelineStageDetails } from "./pipeline-stage-details"
import { PipelineFlowDiagram } from "./pipeline-flow-diagram"

interface PipelineStagesViewerProps {
  pipeline: TestPipeline
  selectedStageId: string | null
  onStageSelect: (stageId: string) => void
}

export function PipelineStagesViewer({ pipeline, selectedStageId, onStageSelect }: PipelineStagesViewerProps) {
  const selectedStage = pipeline.stages.find((s) => s.id === selectedStageId) || pipeline.stages[0]

  return (
    <div className="space-y-6 mt-4">
      <PipelineFlowDiagram 
        pipeline={pipeline} 
        selectedStageId={selectedStageId} 
        onStageSelect={onStageSelect} 
      />
      
      {selectedStage && <PipelineStageDetails stage={selectedStage} />}
    </div>
  )
}
