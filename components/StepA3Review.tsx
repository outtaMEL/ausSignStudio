'use client'

import { SignDoc, AuditIssue } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Download, Edit3, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  doc: SignDoc
  onExport: () => void
  onOpenEditor: () => void
  onSaveTemplate: () => void
  onApplyFix?: (code: string) => void
}

export function StepA3Review({ doc, onExport, onOpenEditor, onSaveTemplate, onApplyFix }: Props) {
  const router = useRouter()
  const issues = doc.audit?.issues || []
  const errors = issues.filter(i => i.severity === 'error')
  const warnings = issues.filter(i => i.severity === 'warning')
  const infos = issues.filter(i => !i.severity || i.severity === 'info')
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">预览与审计</h2>
        <p className="text-muted-foreground">
          检查标志设计并查看规范审计结果
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>标志预览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
              {doc.svg ? (
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: doc.svg }}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>SVG 预览将在此显示</p>
                  <p className="text-sm mt-2">请确保已填写至少一个方向</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">尺寸:</span>
                <span className="font-mono">{doc.board.width} × {doc.board.height} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">主字号:</span>
                <span className="font-mono">{doc.tokens.fontPrimary} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">行距:</span>
                <span className="font-mono">{doc.tokens.lineGap}H</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Audit Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>规范审计</CardTitle>
              {issues.length === 0 && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  通过
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {issues.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p className="font-semibold">设计符合规范</p>
                <p className="text-sm mt-1">未发现设计问题</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {errors.map((issue, idx) => (
                  <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="destructive" className="text-xs">错误</Badge>
                          <span className="text-xs font-mono text-muted-foreground">{issue.code}</span>
                        </div>
                        <p className="text-sm">{issue.msg}</p>
                        {issue.fixable && onApplyFix && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => onApplyFix(issue.code)}
                          >
                            自动修复
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {warnings.map((issue, idx) => (
                  <div key={idx} className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">警告</Badge>
                          <span className="text-xs font-mono text-muted-foreground">{issue.code}</span>
                        </div>
                        <p className="text-sm">{issue.msg}</p>
                        {issue.fixable && onApplyFix && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => onApplyFix(issue.code)}
                          >
                            自动修复
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>下一步操作</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={onExport} className="gap-2">
              <Download className="h-4 w-4" />
              导出 SVG/PDF
            </Button>
            <Button onClick={onOpenEditor} variant="outline" className="gap-2">
              <Edit3 className="h-4 w-4" />
              在编辑器中打开
            </Button>
            <Button onClick={onSaveTemplate} variant="outline" className="gap-2">
              <Save className="h-4 w-4" />
              保存为模板
            </Button>
          </div>
          
          {errors.length > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              ⚠️ 建议在编辑器中修复错误后再导出
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

