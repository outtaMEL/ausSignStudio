'use client'

import { SignDoc, AuditIssue } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, AlertTriangle, Info, CheckCircle, Wrench } from 'lucide-react'

type Props = {
  doc: SignDoc
  onApplyFix: (issueCode: string) => void
  onRefresh: () => void
}

export function AuditPanel({ doc, onApplyFix, onRefresh }: Props) {
  const issues = doc.audit?.issues || []
  const errors = issues.filter(i => i.severity === 'error')
  const warnings = issues.filter(i => i.severity === 'warning')
  const infos = issues.filter(i => !i.severity || i.severity === 'info')
  
  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }
  
  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'error':
        return <Badge variant="destructive">错误</Badge>
      case 'warning':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">警告</Badge>
      default:
        return <Badge variant="secondary">信息</Badge>
    }
  }
  
  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">规范审计</CardTitle>
          <Button size="sm" variant="outline" onClick={onRefresh}>
            刷新
          </Button>
        </div>
        
        {issues.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
            <CheckCircle className="h-4 w-4" />
            <span>无问题</span>
          </div>
        ) : (
          <div className="flex gap-3 mt-2 text-xs">
            {errors.length > 0 && (
              <div className="flex items-center gap-1 text-red-600">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.length} 错误</span>
              </div>
            )}
            {warnings.length > 0 && (
              <div className="flex items-center gap-1 text-yellow-600">
                <AlertTriangle className="h-3 w-3" />
                <span>{warnings.length} 警告</span>
              </div>
            )}
            {infos.length > 0 && (
              <div className="flex items-center gap-1 text-blue-600">
                <Info className="h-3 w-3" />
                <span>{infos.length} 信息</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-2">
        {issues.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p className="font-semibold">设计符合规范</p>
            <p className="text-xs mt-1">未发现设计问题</p>
          </div>
        ) : (
          issues.map((issue, idx) => (
            <Card key={idx} className="border">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {getSeverityIcon(issue.severity)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {getSeverityBadge(issue.severity)}
                      <code className="text-xs font-mono text-muted-foreground">
                        {issue.code}
                      </code>
                    </div>
                    
                    <p className="text-sm">{issue.msg}</p>
                    
                    {issue.fixable && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-7 text-xs gap-1"
                        onClick={() => onApplyFix(issue.code)}
                      >
                        <Wrench className="h-3 w-3" />
                        自动修复
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}

