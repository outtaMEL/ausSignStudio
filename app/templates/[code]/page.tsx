'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader2, ArrowLeft, Layers, Ruler, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type SignTemplate = {
  id: string
  code: string
  name: string
  description: string
  panelCount: number
  layoutType: string
  family: string
  category: string
  defaultWidth: number | null
  defaultHeight: number | null
  specifications: any
  panels: Array<{
    id: string
    position: number
    name: string
    type: string
    backgroundColor: string
    allowedElements: string[]
    layout: any
  }>
}

export default function TemplateDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [template, setTemplate] = useState<SignTemplate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/templates/signs')
      .then(res => res.json())
      .then(data => {
        const found = data.find((t: SignTemplate) => t.code === params.code)
        setTemplate(found || null)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load template:', error)
        setLoading(false)
      })
  }, [params.code])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">模板未找到</h2>
        <p className="text-zinc-500 mb-4">未找到代码为 {params.code} 的模板</p>
        <Button onClick={() => router.push('/')}>返回首页</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{template.name}</h1>
            <Badge className="bg-emerald-100 text-emerald-700">
              {template.code}
            </Badge>
          </div>
          <p className="text-zinc-600 text-lg">{template.description}</p>
        </div>
        <Button className="bg-emerald-700 hover:bg-emerald-800">
          使用此模板
        </Button>
      </div>

      {/* 预览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            面板预览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl space-y-3">
            {template.panels.map(panel => (
              <div 
                key={panel.id}
                className="rounded-lg border-4 border-white shadow-md p-6"
                style={{ backgroundColor: panel.backgroundColor }}
              >
                <div className="text-white text-center">
                  <div className="text-xl font-bold mb-1">{panel.name}</div>
                  <div className="text-sm opacity-80">
                    Position {panel.position} • {panel.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 基本信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              基本信息
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-zinc-500">标志编号</span>
              <span className="font-semibold">{template.code}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-zinc-500">家族</span>
              <span className="font-semibold">{template.family}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-zinc-500">类别</span>
              <span className="font-semibold">{template.category}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-zinc-500">面板数量</span>
              <span className="font-semibold">{template.panelCount}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-zinc-500">布局类型</span>
              <span className="font-semibold">{template.layoutType}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              尺寸规格
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {template.defaultWidth && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-zinc-500">默认宽度</span>
                <span className="font-semibold font-mono">{template.defaultWidth} mm</span>
              </div>
            )}
            {template.defaultHeight && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-zinc-500">默认高度</span>
                <span className="font-semibold font-mono">{template.defaultHeight} mm</span>
              </div>
            )}
            {template.specifications && (
              <>
                {template.specifications.borderRadius && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-zinc-500">圆角半径</span>
                    <span className="font-semibold font-mono">
                      {template.specifications.borderRadius} mm
                    </span>
                  </div>
                )}
                {template.specifications.borderWidth && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-zinc-500">边框宽度</span>
                    <span className="font-semibold font-mono">
                      {template.specifications.borderWidth} mm
                    </span>
                  </div>
                )}
                {template.specifications.padding && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-zinc-500">内边距</span>
                    <span className="font-semibold font-mono text-xs">
                      {template.specifications.padding.top}/
                      {template.specifications.padding.right}/
                      {template.specifications.padding.bottom}/
                      {template.specifications.padding.left} mm
                    </span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 面板详情 */}
      <Card>
        <CardHeader>
          <CardTitle>面板详细配置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {template.panels.map(panel => (
              <div 
                key={panel.id}
                className="border rounded-lg p-4 bg-zinc-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{panel.name}</h4>
                    <p className="text-sm text-zinc-500">Position {panel.position}</p>
                  </div>
                  <Badge variant="outline">{panel.type}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">背景色</div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: panel.backgroundColor }}
                      />
                      <span className="font-mono text-sm">{panel.backgroundColor}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-zinc-500 mb-2">允许的元素类型</div>
                  <div className="flex flex-wrap gap-2">
                    {panel.allowedElements.map(elem => (
                      <Badge key={elem} variant="secondary" className="text-xs">
                        {elem}
                      </Badge>
                    ))}
                  </div>
                </div>

                {panel.layout && (
                  <div>
                    <div className="text-xs text-zinc-500 mb-2">布局配置</div>
                    <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
                      {JSON.stringify(panel.layout, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
