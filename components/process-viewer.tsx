"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Process } from "@/lib/mock-data"
import { PlayCircle, CheckCircle, XCircle, Clock } from "lucide-react"

interface ProcessViewerProps {
  processes: Process[]
  agentName?: string
}

const statusConfig = {
  running: {
    icon: PlayCircle,
    color: "text-blue-500",
    variant: "default" as const,
    label: "Running",
  },
  completed: {
    icon: CheckCircle,
    color: "text-green-500",
    variant: "outline" as const,
    label: "Completed",
  },
  failed: {
    icon: XCircle,
    color: "text-red-500",
    variant: "destructive" as const,
    label: "Failed",
  },
  pending: {
    icon: Clock,
    color: "text-gray-500",
    variant: "secondary" as const,
    label: "Pending",
  },
}

export function ProcessViewer({ processes, agentName }: ProcessViewerProps) {
  if (processes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Processes</CardTitle>
          <CardDescription>No active processes at the moment</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {processes.map((process) => {
        const StatusIcon = statusConfig[process.status].icon
        const duration = process.endTime
          ? new Date(process.endTime).getTime() - new Date(process.startTime).getTime()
          : Date.now() - new Date(process.startTime).getTime()
        const durationMinutes = Math.floor(duration / 60000)

        return (
          <Card key={process.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{process.name}</CardTitle>
                  {agentName && <CardDescription>Agent: {agentName}</CardDescription>}
                </div>
                <Badge variant={statusConfig[process.status].variant}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusConfig[process.status].label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Started: {new Date(process.startTime).toLocaleTimeString()}</span>
                <span>Duration: {durationMinutes}m</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium text-sm">Process Logs</div>
                <ScrollArea className="h-[150px] w-full rounded-md border bg-muted/50 p-3">
                  <div className="space-y-1 font-mono text-xs">
                    {process.logs.map((log, index) => (
                      <div
                        key={index}
                        className={
                          log.includes("PASSED")
                            ? "text-green-600"
                            : log.includes("FAILED")
                              ? "text-red-600"
                              : "text-foreground"
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
