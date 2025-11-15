"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Agent, Process } from "@/lib/mock-data"
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  Server,
  Globe,
  Gauge,
  Lock,
  Layers,
  Eye,
  Smartphone,
  Terminal,
} from "lucide-react"

interface AgentDetailModalProps {
  agent: Agent | null
  process: Process | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const agentTypeIcons = {
  frontend: Globe,
  backend: Server,
  performance: Gauge,
  api: Layers,
  security: Lock,
  integration: Layers,
  ui: Smartphone,
  "visual-regression": Eye,
}

const statusConfig = {
  active: {
    icon: Activity,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
    variant: "default" as const,
  },
  idle: {
    icon: Clock,
    color: "text-gray-500",
    bgColor: "bg-gray-500",
    variant: "secondary" as const,
  },
  error: {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500",
    variant: "destructive" as const,
  },
  completed: {
    icon: CheckCircle2,
    color: "text-green-500",
    bgColor: "bg-green-500",
    variant: "outline" as const,
  },
}

export function AgentDetailModal({ agent, process, open, onOpenChange }: AgentDetailModalProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [currentProgress, setCurrentProgress] = useState(0)

  useEffect(() => {
    if (process && open) {
      setLogs(process.logs)
      setCurrentProgress(agent?.progress || 0)

      // Simulate real-time log updates
      const logInterval = setInterval(() => {
        const newLogs = [
          `[${new Date().toLocaleTimeString()}] Processing test case ${Math.floor(Math.random() * 1000)}...`,
          `[${new Date().toLocaleTimeString()}] Assertion passed: ${Math.random() > 0.3 ? "PASSED" : "FAILED"}`,
          `[${new Date().toLocaleTimeString()}] Running validation checks...`,
          `[${new Date().toLocaleTimeString()}] Memory usage: ${Math.floor(Math.random() * 512)}MB`,
          `[${new Date().toLocaleTimeString()}] CPU usage: ${Math.floor(Math.random() * 100)}%`,
        ]

        setLogs((prev) => [...prev, newLogs[Math.floor(Math.random() * newLogs.length)]])
      }, 2000)

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setCurrentProgress((prev) => {
          const newProgress = prev + Math.random() * 2
          return newProgress > 100 ? 100 : newProgress
        })
      }, 3000)

      return () => {
        clearInterval(logInterval)
        clearInterval(progressInterval)
      }
    }
  }, [process, open, agent])

  if (!agent || !process) return null

  const StatusIcon = statusConfig[agent.status].icon
  const TypeIcon = agentTypeIcons[agent.type]
  const passRate = agent.testsRun > 0 ? ((agent.testsPassed / agent.testsRun) * 100).toFixed(1) : "0"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <TypeIcon className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{agent.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">
                  {agent.type}
                </Badge>
                <Badge variant={statusConfig[agent.status].variant} className="capitalize">
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {agent.status}
                </Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Task */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Current Task</span>
              <span className="text-muted-foreground">{agent.currentTask}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{currentProgress.toFixed(1)}%</span>
            </div>
            <Progress value={currentProgress} className="h-2" />
          </div>

          {/* Test Statistics */}
          <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <div className="text-2xl font-bold">{agent.testsRun}</div>
              <div className="text-xs text-muted-foreground">Total Tests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{agent.testsPassed}</div>
              <div className="text-xs text-muted-foreground">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{agent.testsFailed}</div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{passRate}%</div>
              <div className="text-xs text-muted-foreground">Pass Rate</div>
            </div>
          </div>

          {/* Process Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <Terminal className="w-4 h-4" />
              <span>Active Process: {process.name}</span>
            </div>
            <div className="text-sm text-muted-foreground">Started: {new Date(process.startTime).toLocaleString()}</div>
          </div>

          {/* Live Logs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Live Execution Logs</span>
              <Badge variant="outline" className="animate-pulse">
                <Activity className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>
            <ScrollArea className="h-64 w-full rounded-md border bg-slate-950 p-4">
              <div className="space-y-1 font-mono text-xs text-green-400">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {log}
                  </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-4 bg-green-400 animate-pulse" />
                  <span className="animate-pulse">Processing...</span>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
