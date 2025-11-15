"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Agent } from "@/lib/mock-data"
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
} from "lucide-react"

interface AgentCardProps {
  agent: Agent
  onClick?: () => void
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

export function AgentCard({ agent, onClick }: AgentCardProps) {
  const StatusIcon = statusConfig[agent.status].icon
  const TypeIcon = agentTypeIcons[agent.type]
  const passRate = agent.testsRun > 0 ? ((agent.testsPassed / agent.testsRun) * 100).toFixed(1) : "0"

  return (
    <Card className="hover:shadow-lg hover:border-primary/50 min-w-[280px] w-[280px] h-[222px] p-4" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <TypeIcon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs capitalize">
                  {agent.type}
                </Badge>
                <Badge variant={statusConfig[agent.status].variant} className="text-xs capitalize">
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {agent.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">{agent.currentTask}</span>
            <span className="font-medium">{agent.progress}%</span>
          </div>
          <Progress value={agent.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
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
        </div>

        <div className="flex items-center justify-between pt-2 border-t text-sm">
          <span className="text-muted-foreground">Pass Rate</span>
          <span className="font-semibold text-green-600">{passRate}%</span>
        </div>

        <div className="text-xs text-muted-foreground">
          Last updated: {new Date(agent.lastUpdated).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}
