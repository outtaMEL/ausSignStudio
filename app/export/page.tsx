'use client'

import { useState } from 'react'
import { useSignStore } from '@/store/signStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Download, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function ExportPage() {
  const { doc, exportSVG } = useSignStore()
  const [format, setFormat] = useState<'svg' | 'pdf' | 'dwg'>('svg')
  const [includeBleed, setIncludeBleed] = useState(false)
  const [includeGuides, setIncludeGuides] = useState(false)
  
  const handleExport = () => {
    if (format === 'svg') {
      const svg = exportSVG()
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${doc.family}-${doc.id}.svg`
      a.click()
      URL.revokeObjectURL(url)
    } else if (format === 'pdf') {
      alert('PDF 导出功能正在开发中')
    } else if (format === 'dwg') {
      alert('DWG 导出为占位功能，需要第三方转换服务')
    }
  }
  
  return (
    <div className="container mx-auto py-8 px-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">导出</h1>
        <p className="text-muted-foreground text-lg">
          导出标志设计为 SVG、PDF 或 DWG 格式
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>预览</CardTitle>
            <CardDescription>当前设计预览</CardDescription>
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
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>无可用预览</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">类型:</span>
                <Badge>{doc.family}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">尺寸:</span>
                <span className="font-mono">{doc.board.width} × {doc.board.height} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">方向数:</span>
                <span>{doc.directions.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Export Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>导出设置</CardTitle>
              <CardDescription>选择格式和选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>导出格式</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as any)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="svg">
                      <div className="flex items-center gap-2">
                        <span>SVG</span>
                        <Badge variant="default">推荐</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="pdf">
                      <div className="flex items-center gap-2">
                        <span>PDF</span>
                        <Badge variant="secondary">开发中</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="dwg">
                      <div className="flex items-center gap-2">
                        <span>DWG (AutoCAD)</span>
                        <Badge variant="outline">占位</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="bleed">包含出血区</Label>
                <Switch
                  id="bleed"
                  checked={includeBleed}
                  onCheckedChange={setIncludeBleed}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="guides">包含参考线</Label>
                <Switch
                  id="guides"
                  checked={includeGuides}
                  onCheckedChange={setIncludeGuides}
                />
              </div>
              
              {format === 'svg' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                  <p className="font-semibold mb-1">SVG 导出</p>
                  <p className="text-muted-foreground">
                    适用于打印、进一步编辑或转换为其他格式
                  </p>
                </div>
              )}
              
              {format === 'pdf' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
                  <p className="font-semibold mb-1">PDF 导出</p>
                  <p className="text-muted-foreground">
                    功能正在开发中，敬请期待
                  </p>
                </div>
              )}
              
              {format === 'dwg' && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-md text-sm">
                  <p className="font-semibold mb-1">DWG 导出</p>
                  <p className="text-muted-foreground">
                    需要第三方转换服务，当前为占位功能
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>批量导出</CardTitle>
              <CardDescription>导出多个变体或尺寸</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" disabled>
                导出所有尺寸变体
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                导出带/不带箭头版本
              </Button>
              <Button variant="outline" className="w-full justify-start" disabled>
                导出为压缩包
              </Button>
              <p className="text-xs text-muted-foreground">
                * 批量导出功能将在后续版本中提供
              </p>
            </CardContent>
          </Card>
          
          <Button 
            onClick={handleExport} 
            className="w-full gap-2"
            size="lg"
          >
            <Download className="h-5 w-5" />
            导出 {format.toUpperCase()}
          </Button>
        </div>
      </div>
    </div>
  )
}

