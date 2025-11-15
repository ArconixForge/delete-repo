"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { SubStep } from "@/lib/mock-data"

interface PipelineExecutionLogsProps {
  subStep: SubStep | null
  selectedStageId: string
}

export function PipelineExecutionLogs({ subStep, selectedStageId }: PipelineExecutionLogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when logs update
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [subStep?.logs])

  return (
    <Card className="h-full flex flex-col bg-slate-900 text-slate-50 border-slate-700">
      <div className="p-4 border-b border-slate-700 bg-slate-800">
        <h3 className="text-sm font-semibold">Execution Logs</h3>
        {subStep && <p className="text-xs text-slate-400 mt-1">{subStep.name}</p>}
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1 font-mono text-xs" ref={scrollRef}>
          {subStep && subStep.logs.length > 0 ? (
            subStep.logs.map((log, idx) => (
              <div key={idx} className="text-slate-300 whitespace-pre-wrap break-words">
                <span className="text-slate-500">{`> `}</span>
                {log}
              </div>
            ))
          ) : (
            <div className="text-slate-500 italic">No logs available. Select a sub-step to view execution details.</div>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}
