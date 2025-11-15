import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Team } from "@/lib/mock-data"
import { Activity, CheckCircle2, XCircle, Clock } from "lucide-react"

interface TeamCardProps {
  team: Team
}

export function TeamCard({ team }: TeamCardProps) {
  const runningStories = team.stories.filter((s) => s.status === "running").length
  const completedStories = team.stories.filter((s) => s.status === "completed").length
  const failedStories = team.stories.filter((s) => s.status === "failed").length
  const partialStories = team.stories.filter((s) => s.status === "partial").length

  return (
    <Link href={`/teams/${team.id}`}>
      <Card className="hover:shadow-lg hover:scale-[1.02] h-full group min-w-[280px] p-4">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <h3 className="group-hover:text-primary transition-colors">{team.name}</h3>
            <Badge variant="secondary" className="font-normal text-xs">
              {team.stories.length} runs
            </Badge>
          </CardTitle>
          <CardDescription>
            <p className="line-clamp-2">{team.description}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {runningStories > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-100">
                <Activity className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="flex items-baseline gap-1">
                  <span className="font-semibold text-blue-900">{runningStories}</span>
                  <span className="text-xs text-blue-700">running</span>
                </div>
              </div>
            )}
            {completedStories > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-100">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="flex items-baseline gap-1">
                  <span className="font-semibold text-green-900">{completedStories}</span>
                  <span className="text-xs text-green-700">completed</span>
                </div>
              </div>
            )}
            {failedStories > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100">
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <div className="flex items-baseline gap-1">
                  <span className="font-semibold text-red-900">{failedStories}</span>
                  <span className="text-xs text-red-700">failed</span>
                </div>
              </div>
            )}
            {partialStories > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-100">
                <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                <div className="flex items-baseline gap-1">
                  <span className="font-semibold text-yellow-900">{partialStories}</span>
                  <span className="text-xs text-yellow-700">partial</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
