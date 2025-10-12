'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, AlertTriangle, FileText } from 'lucide-react'

export default function AuditPage() {
  return (
    <div className="container mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">规范审计总览</h1>
        <p className="text-muted-foreground text-lg">
          批量审计和规范检查工具（占位）
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>总文档数</CardDescription>
            <CardTitle className="text-3xl">24</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>过去 30 天</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardDescription>通过</CardDescription>
            <CardTitle className="text-3xl text-green-700">18</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span>75% 通过率</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-3">
            <CardDescription>警告</CardDescription>
            <CardTitle className="text-3xl text-yellow-700">4</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-yellow-700">
              <AlertTriangle className="h-4 w-4" />
              <span>17% 有警告</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardDescription>错误</CardDescription>
            <CardTitle className="text-3xl text-red-700">2</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>8% 有错误</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Common Issues */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>常见问题</CardTitle>
          <CardDescription>最近审计中发现的常见规范问题</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { code: 'LINE_GAP_MIN', count: 8, severity: 'warning', desc: '行距低于最小值 0.5H' },
              { code: 'MARGIN_MIN', count: 5, severity: 'warning', desc: '边距低于推荐值' },
              { code: 'FONT_SIZE_MIN', count: 2, severity: 'error', desc: '字号低于最小可读性要求' },
              { code: 'CONTENT_OVERFLOW', count: 1, severity: 'error', desc: '内容超出画板范围' }
            ].map((issue, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {issue.severity === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={issue.severity === 'error' ? 'destructive' : 'outline'}>
                        {issue.severity === 'error' ? '错误' : '警告'}
                      </Badge>
                      <code className="text-sm font-mono">{issue.code}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{issue.count}</div>
                  <div className="text-xs text-muted-foreground">文档</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>批量操作</CardTitle>
          <CardDescription>对多个文档执行审计和修复</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            批量审计所有文档
          </Button>
          <Button variant="outline" className="w-full justify-start">
            批量应用自动修复
          </Button>
          <Button variant="outline" className="w-full justify-start">
            生成审计报告
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

