import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Report } from "@/lib/mock-data"
import { FileText, CheckCircle2, XCircle, SkipForward } from "lucide-react"

interface ReportCardProps {
  report: Report
  agentName?: string
}

export function ReportCard({ report, agentName }: ReportCardProps) {
  const successRate = ((report.summary.passed / report.summary.total) * 100).toFixed(1)

  return (
    <Card className="min-w-[280px] p-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {report.type}
                </Badge>
                {agentName && <span className="text-xs text-muted-foreground">by {agentName}</span>}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg border">
            <div className="text-2xl font-bold">{report.summary.total}</div>
            <div className="text-xs text-muted-foreground mt-1">Total</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-green-200 bg-green-50">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-xl font-bold text-green-600">{report.summary.passed}</div>
            <div className="text-xs text-green-700 mt-1">Passed</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-red-200 bg-red-50">
            <div className="flex items-center justify-center mb-1">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-xl font-bold text-red-600">{report.summary.failed}</div>
            <div className="text-xs text-red-700 mt-1">Failed</div>
          </div>
          <div className="text-center p-3 rounded-lg border">
            <div className="flex items-center justify-center mb-1">
              <SkipForward className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-xl font-bold text-gray-600">{report.summary.skipped}</div>
            <div className="text-xs text-gray-600 mt-1">Skipped</div>
          </div>
        </div>

        <div className="pt-3 border-t">
          <div className="text-sm font-medium mb-1">Summary</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{report.details}</p>
        </div>

        <div className="text-xs text-muted-foreground">Generated: {new Date(report.timestamp).toLocaleString()}</div>
      </CardContent>
    </Card>
  )
}
