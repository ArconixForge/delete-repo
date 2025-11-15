"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { JiraStory, TestRun } from "@/lib/mock-data"
import {
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  GitBranch,
  User,
  GitCommit,
  Download,
  FileText,
  ChevronRight,
  Zap,
} from "lucide-react"
import { TestRunDetailModal } from "./test-run-detail-modal"
import { PipelineDetailsModal } from "./pipeline-details-modal"

interface StoryPipelineRowProps {
  story: JiraStory
}

const statusIcons = {
  completed: CheckCircle2,
  failed: XCircle,
  running: Play,
  partial: Clock,
}

const statusColors = {
  completed: "text-green-600 bg-green-50 border-green-200",
  failed: "text-red-600 bg-red-50 border-red-200",
  running: "text-blue-600 bg-blue-50 border-blue-200",
  partial: "text-yellow-600 bg-yellow-50 border-yellow-200",
}

const testStatusColors = {
  completed: "bg-green-600",
  failed: "bg-red-600",
  running: "bg-blue-600 animate-pulse",
  pending: "bg-gray-300",
  queued: "bg-gray-200",
}

const agentTypeColors: Record<string, string> = {
  ui: "bg-purple-100 text-purple-700 border-purple-300",
  frontend: "bg-blue-100 text-blue-700 border-blue-300",
  backend: "bg-green-100 text-green-700 border-green-300",
  api: "bg-cyan-100 text-cyan-700 border-cyan-300",
  security: "bg-red-100 text-red-700 border-red-300",
  performance: "bg-orange-100 text-orange-700 border-orange-300",
  integration: "bg-indigo-100 text-indigo-700 border-indigo-300",
  "visual-regression": "bg-pink-100 text-pink-700 border-pink-300",
  e2e: "bg-teal-100 text-teal-700 border-teal-300",
  accessibility: "bg-amber-100 text-amber-700 border-amber-300",
}

export function StoryPipelineRow({ story }: StoryPipelineRowProps) {
  const [selectedTestRun, setSelectedTestRun] = useState<TestRun | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPipeline, setSelectedPipeline] = useState<TestRun | null>(null)
  const [pipelineModalOpen, setPipelineModalOpen] = useState(false)

  const StatusIcon = statusIcons[story.status]
  const hasReport = story.status === "completed" || story.status === "failed"

  const handleTestClick = (testRun: TestRun) => {
    setSelectedTestRun(testRun)
    setModalOpen(true)
  }

  const handlePipelineClick = (testRun: TestRun, e: React.MouseEvent) => {
    e.stopPropagation()
    if (testRun.pipeline) {
      setSelectedPipeline(testRun)
      setPipelineModalOpen(true)
    }
  }

  const handleDownloadReport = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log(`Downloading report for ${story.jiraId}`)
  }

  return (
    <>
      <Card className="p-4 hover:shadow-md min-w-[280px]">
        <div className="flex items-center justify-between gap-4">
          {/* Story Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="font-mono text-xs">
                {story.jiraId}
              </Badge>
              <Badge className={`${statusColors[story.status]} border`}>
                <StatusIcon className="w-3 h-3 mr-1" />
                {story.status}
              </Badge>
            </div>
            <h3 className="font-semibold text-sm mb-2 truncate">{story.title}</h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                <span className="truncate max-w-[150px]">{story.branch}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{story.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitCommit className="w-3 h-3" />
                <span className="font-mono">{story.commit}</span>
              </div>
            </div>
          </div>

          {/* Test Pipeline */}
          <div className="flex items-center gap-3">
            {story.testRuns.map((testRun) => (
              <div key={testRun.id} className="group relative">
                <button
                  onClick={() => handleTestClick(testRun)}
                  className="group/btn relative"
                  title={`${testRun.agentName} - ${testRun.status}`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center transition-all hover:scale-105 ${agentTypeColors[testRun.agentType]}`}
                  >
                    <div className={`w-2 h-2 rounded-full mb-1 ${testStatusColors[testRun.status]}`} />
                    <span className="text-[10px] font-bold uppercase">{testRun.agentType.slice(0, 3)}</span>
                  </div>

                  {/* Hover tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {testRun.agentName}
                    <div className="text-[10px] text-gray-300 capitalize">{testRun.status}</div>
                    {testRun.duration && <div className="text-[10px] text-gray-300">{testRun.duration}</div>}
                  </div>
                </button>

                {testRun.pipeline && (
                  <button
                    onClick={(e) => handlePipelineClick(testRun, e)}
                    className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 z-20"
                    title="View pipeline execution (click to expand)"
                  >
                    <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-full p-2 shadow-lg border-2 border-white hover:from-amber-300 hover:to-amber-400 transition-all">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {hasReport && (
              <>
                <Button size="sm" variant="outline" onClick={handleDownloadReport}>
                  <Download className="w-4 h-4 mr-1" />
                  Report
                </Button>
                <Button size="sm" variant="ghost">
                  <FileText className="w-4 h-4" />
                </Button>
              </>
            )}
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </Card>

      <TestRunDetailModal testRun={selectedTestRun} story={story} open={modalOpen} onOpenChange={setModalOpen} />
      {selectedPipeline && (
        <PipelineDetailsModal
          pipeline={selectedPipeline.pipeline}
          open={pipelineModalOpen}
          onOpenChange={setPipelineModalOpen}
          agentName={selectedPipeline.agentName}
        />
      )}
    </>
  )
}
