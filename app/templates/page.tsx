'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Signpost, 
  ArrowUp, 
  Shield, 
  Palette, 
  Type,
  Loader2,
  Layers,
  Tag
} from 'lucide-react'

type SignTemplate = {
  id: string
  code: string
  name: string
  description: string
  panelCount: number
  layoutType: string
  family: string
  category: string
  panels: Array<{
    id: string
    position: number
    name: string
    type: string
    backgroundColor: string
  }>
}

type ElementTemplate = {
  id: string
  name: string
  type: string
  category: string | null
  defaultWidth: number | null
  defaultHeight: number | null
  usageCount: number
  tags: string[]
}

type ColorScheme = {
  id: string
  name: string
  description: string | null
  colors: any
  isDefault: boolean
}

type TypographyTemplate = {
  id: string
  name: string
  description: string | null
  fontFamily: string
  sizeRules: any
  isDefault: boolean
}

export default function TemplatesPage() {
  const [signTemplates, setSignTemplates] = useState<SignTemplate[]>([])
  const [elementTemplates, setElementTemplates] = useState<ElementTemplate[]>([])
  const [colorSchemes, setColorSchemes] = useState<ColorScheme[]>([])
  const [typography, setTypography] = useState<TypographyTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/templates/signs').then(r => r.json()),
      fetch('/api/templates/elements').then(r => r.json()),
      fetch('/api/templates/colors').then(r => r.json()),
      fetch('/api/templates/typography').then(r => r.json())
    ]).then(([signs, elements, colors, typo]) => {
      setSignTemplates(signs)
      setElementTemplates(elements)
      setColorSchemes(colors)
      setTypography(typo)
      setLoading(false)
    }).catch(error => {
      console.error('Failed to load templates:', error)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  // 按类型分组元素
  const arrows = elementTemplates.filter(e => e.type === 'ARROW')
  const shields = elementTemplates.filter(e => e.type === 'ROUTE_SHIELD')
  const services = elementTemplates.filter(e => e.type === 'SERVICE_SIGN')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-4xl font-bold mb-2">模板库</h1>
        <p className="text-zinc-600 text-lg">
          基于 AS1742 标准的完整模板系统
        </p>
      </div>

      <Tabs defaultValue="signs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="signs" className="gap-2">
            <Signpost className="h-4 w-4" />
            标志模板
          </TabsTrigger>
          <TabsTrigger value="elements" className="gap-2">
            <Layers className="h-4 w-4" />
            元素库
          </TabsTrigger>
          <TabsTrigger value="colors" className="gap-2">
            <Palette className="h-4 w-4" />
            配色方案
          </TabsTrigger>
          <TabsTrigger value="typography" className="gap-2">
            <Type className="h-4 w-4" />
            字体规范
          </TabsTrigger>
        </TabsList>

        {/* 标志模板 */}
        <TabsContent value="signs" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">标志类型模板</h2>
            <Badge variant="secondary">{signTemplates.length} 个模板</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signTemplates.map(template => (
              <Card 
                key={template.id}
                className="hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                      {template.code}
                    </Badge>
                    <Badge variant="outline">{template.family}</Badge>
                  </div>
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 面板预览 */}
                  <div className="space-y-2">
                    {template.panels.map(panel => (
                      <div 
                        key={panel.id}
                        className="h-12 rounded-lg border-2 border-white flex items-center justify-center text-xs text-white font-medium"
                        style={{ backgroundColor: panel.backgroundColor }}
                      >
                        {panel.name}
                      </div>
                    ))}
                  </div>

                  {/* 信息 */}
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <div className="flex gap-4">
                      <span className="text-zinc-500">
                        {template.panelCount} 面板
                      </span>
                      <span className="text-zinc-500">
                        {template.layoutType}
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      使用
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 元素库 */}
        <TabsContent value="elements" className="space-y-6">
          {/* 箭头 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ArrowUp className="h-5 w-5" />
              <h3 className="text-xl font-semibold">箭头元素</h3>
              <Badge variant="secondary">{arrows.length}</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {arrows.map(arrow => (
                <Card key={arrow.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-emerald-50 rounded-lg flex items-center justify-center mb-3">
                      <div className="text-4xl">⬆️</div>
                    </div>
                    <div className="text-sm font-medium text-center mb-1">
                      {arrow.name}
                    </div>
                    <div className="text-xs text-zinc-500 text-center">
                      {arrow.usageCount} 次使用
                    </div>
                    {arrow.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {arrow.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 路线盾牌 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5" />
              <h3 className="text-xl font-semibold">路线盾牌</h3>
              <Badge variant="secondary">{shields.length}</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {shields.map(shield => (
                <Card key={shield.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="aspect-square bg-zinc-50 rounded-lg flex items-center justify-center mb-3 border-2">
                      <div className="text-center">
                        <div className="text-xs text-zinc-500 mb-1">{shield.category}</div>
                        <div className="text-2xl font-bold">M1</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-center mb-1">
                      {shield.name}
                    </div>
                    <div className="text-xs text-zinc-500 text-center">
                      {shield.usageCount} 次使用
                    </div>
                    {shield.category && (
                      <Badge 
                        variant="outline" 
                        className="w-full mt-2 text-[10px] justify-center"
                      >
                        {shield.category}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 服务图标 */}
          {services.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5" />
                <h3 className="text-xl font-semibold">服务设施图标</h3>
                <Badge variant="secondary">{services.length}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {services.map(service => (
                  <Card key={service.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-blue-600 rounded-lg flex items-center justify-center mb-3">
                        <div className="text-4xl">⚙️</div>
                      </div>
                      <div className="text-sm font-medium text-center mb-1">
                        {service.name}
                      </div>
                      <div className="text-xs text-zinc-500 text-center">
                        {service.usageCount} 次使用
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* 配色方案 */}
        <TabsContent value="colors" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">配色方案</h2>
            <Badge variant="secondary">{colorSchemes.length} 个方案</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {colorSchemes.map(scheme => (
              <Card key={scheme.id} className={scheme.isDefault ? 'ring-2 ring-emerald-500' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {scheme.name}
                        {scheme.isDefault && (
                          <Badge className="bg-emerald-600">默认</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {scheme.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(scheme.colors as Record<string, string>).map(([name, value]) => (
                      <div key={name} className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-lg border-2 border-zinc-200 shadow-sm"
                          style={{ backgroundColor: value }}
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium capitalize">{name}</div>
                          <div className="text-xs text-zinc-500 font-mono">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 字体规范 */}
        <TabsContent value="typography" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">字体规范</h2>
            <Badge variant="secondary">{typography.length} 个规范</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {typography.map(typo => (
              <Card key={typo.id} className={typo.isDefault ? 'ring-2 ring-emerald-500' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {typo.name}
                        {typo.isDefault && (
                          <Badge className="bg-emerald-600">默认</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {typo.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium mb-2">字体家族</div>
                    <div className="px-3 py-2 bg-zinc-50 rounded border text-sm font-mono">
                      {typo.fontFamily}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">字号规范 (mm)</div>
                    <div className="space-y-2">
                      {Object.entries(typo.sizeRules as Record<string, number>).map(([level, size]) => (
                        <div key={level} className="flex items-center justify-between px-3 py-2 bg-zinc-50 rounded border">
                          <span className="text-sm font-medium capitalize">{level}</span>
                          <span className="text-sm font-mono text-emerald-600">{size}mm</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
