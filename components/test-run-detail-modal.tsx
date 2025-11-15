"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import type { TestRun, JiraStory } from "@/lib/mock-data"
import { logTemplates } from "@/lib/mock-data"
import { CheckCircle2, XCircle, Clock, Play, Terminal, Download, ExternalLink, GitBranch, Package } from "lucide-react"

interface TestRunDetailModalProps {
  testRun: TestRun | null
  story: JiraStory | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusConfig = {
  running: {
    icon: Play,
    color: "text-blue-600",
    bgColor: "bg-blue-600",
    label: "Running",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-600",
    label: "Completed",
  },
  failed: {
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-600",
    label: "Failed",
  },
  pending: {
    icon: Clock,
    color: "text-gray-600",
    bgColor: "bg-gray-600",
    label: "Pending",
  },
  queued: {
    icon: Clock,
    color: "text-gray-500",
    bgColor: "bg-gray-500",
    label: "Queued",
  },
}

function generateRealisticLogs(agentType: string, count = 15): string[] {
  const templates = logTemplates[agentType as keyof typeof logTemplates] || logTemplates.ui
  const logs: string[] = []

  for (let i = 0; i < count; i++) {
    const template = templates[Math.floor(Math.random() * templates.length)]
    const time = new Date(Date.now() - (count - i) * 5000).toLocaleTimeString()
    const log = template
      .replace("{time}", time)
      .replace("{url}", "/app/dashboard")
      .replace("{duration}", (Math.random() * 2 + 0.5).toFixed(2))
      .replace("{memory}", Math.floor(Math.random() * 512 + 256).toString())
      .replace("{coverage}", Math.floor(Math.random() * 20 + 75).toString())
      .replace("{queries}", Math.floor(Math.random() * 50 + 10).toString())
      .replace("{users}", Math.floor(Math.random() * 500 + 100).toString())
      .replace("{latency}", Math.floor(Math.random() * 200 + 50).toString())
      .replace("{rps}", Math.floor(Math.random() * 500 + 200).toString())
      .replace("{percent}", Math.floor(Math.random() * 40 + 50).toString())
      .replace("{cpu}", Math.floor(Math.random() * 50 + 30).toString())
      .replace("{vulns}", Math.floor(Math.random() * 3).toString())

    logs.push(log)
  }

  return logs
}

export function TestRunDetailModal({ testRun, story, open, onOpenChange }: TestRunDetailModalProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [currentProgress, setCurrentProgress] = useState(0)

  useEffect(() => {
    if (testRun && open) {
      // Initialize logs based on agent type
      const initialLogs = generateRealisticLogs(testRun.agentType, 12)
      setLogs(initialLogs)
      setCurrentProgress(testRun.progress)

      // Only add live updates if status is running
      if (testRun.status === "running") {
        const logInterval = setInterval(() => {
          const templates = logTemplates[testRun.agentType as keyof typeof logTemplates] || logTemplates.ui
          const template = templates[Math.floor(Math.random() * templates.length)]
          const time = new Date().toLocaleTimeString()

          const newLog = template
            .replace("{time}", time)
            .replace("{url}", "/app/dashboard")
            .replace("{duration}", (Math.random() * 2 + 0.5).toFixed(2))
            .replace("{memory}", Math.floor(Math.random() * 512 + 256).toString())
            .replace("{coverage}", Math.floor(Math.random() * 20 + 75).toString())
            .replace("{queries}", Math.floor(Math.random() * 50 + 10).toString())
            .replace("{users}", Math.floor(Math.random() * 500 + 100).toString())
            .replace("{latency}", Math.floor(Math.random() * 200 + 50).toString())
            .replace("{rps}", Math.floor(Math.random() * 500 + 200).toString())
            .replace("{percent}", Math.floor(Math.random() * 40 + 50).toString())
            .replace("{cpu}", Math.floor(Math.random() * 50 + 30).toString())
            .replace("{vulns}", Math.floor(Math.random() * 3).toString())

          setLogs((prev) => [...prev, newLog])
        }, 2500)

        const progressInterval = setInterval(() => {
          setCurrentProgress((prev) => {
            const increment = Math.random() * 3
            const newProgress = prev + increment
            return newProgress > 100 ? 100 : newProgress
          })
        }, 3000)

        return () => {
          clearInterval(logInterval)
          clearInterval(progressInterval)
        }
      }
    }
  }, [testRun, open])

  if (!testRun || !story) return null

  const config = statusConfig[testRun.status]
  const StatusIcon = config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-2xl">{testRun.agentName}</DialogTitle>
                <Badge variant="outline" className="capitalize">
                  {testRun.agentType}
                </Badge>
                <Badge className={`${config.color}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
              <DialogDescription className="flex items-center gap-4 text-sm">
                <span className="font-mono">{story.jiraId}</span>
                <span>•</span>
                <span>{story.title}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Project Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="w-4 h-4" />
                <span className="font-medium">Repository</span>
              </div>
              <a
                href={story.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                {story.repository}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GitBranch className="w-4 h-4" />
                <span className="font-medium">Branch</span>
              </div>
              <code className="text-xs bg-slate-100 px-2 py-1 rounded">{story.branch}</code>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Commit</div>
              <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">{story.commit}</code>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Triggered By</div>
              <div className="text-sm">{story.triggeredBy}</div>
            </div>
          </div>

          {/* Progress */}
          {testRun.status === "running" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">{currentProgress.toFixed(1)}%</span>
              </div>
              <Progress value={currentProgress} className="h-2" />
            </div>
          )}

          {/* Test Statistics */}
          {testRun.testsRun !== undefined && (
            <div className="grid grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="text-2xl font-bold">{testRun.testsRun}</div>
                <div className="text-xs text-muted-foreground">Total Tests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{testRun.testsPassed || 0}</div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{testRun.testsFailed || 0}</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {testRun.testsRun > 0 ? (((testRun.testsPassed || 0) / testRun.testsRun) * 100).toFixed(1) : "0"}%
                </div>
                <div className="text-xs text-muted-foreground">Pass Rate</div>
              </div>
            </div>
          )}

          {/* Duration */}
          {testRun.duration && (
            <div className="flex items-center justify-between text-sm p-3 bg-muted/50 rounded-lg">
              <span className="text-muted-foreground">Duration</span>
              <span className="font-mono font-medium">{testRun.duration}</span>
            </div>
          )}

          {/* Live Logs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                <span className="font-medium">Execution Logs</span>
              </div>
              <div className="flex items-center gap-2">
                {testRun.status === "running" && (
                  <Badge variant="outline" className="animate-pulse">
                    <Play className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                )}
                <Button size="sm" variant="outline">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            <ScrollArea className="h-80 w-full rounded-md border bg-slate-950 p-4">
              <div className="space-y-1 font-mono text-xs text-green-400">
                {logs.map((log, index) => (
                  <div
                    key={index}
                    className="animate-in fade-in slide-in-from-bottom-1 duration-300"
                    style={{ animationDelay: `${Math.min(index * 30, 500)}ms` }}
                  >
                    {log}
                  </div>
                ))}
                {testRun.status === "running" && (
                  <div className="flex items-center gap-2 mt-2 animate-pulse">
                    <div className="w-2 h-4 bg-green-400" />
                    <span>Processing...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
