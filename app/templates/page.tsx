'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Download, Copy, Trash2 } from 'lucide-react'
import { TemplatePicker } from '@/components/TemplatePicker'

type Template = {
  id: string
  name: string
  description: string
  family: string
  author: 'system' | 'user'
  isFavorite?: boolean
  usageCount?: number
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: 'default-au',
    name: 'Default Australian',
    description: 'AS 1742.6 标准模板',
    family: 'G1-wide',
    author: 'system',
    isFavorite: true,
    usageCount: 245
  },
  {
    id: 'vic-metro',
    name: 'VIC Metro Style',
    description: '维多利亚州都市区风格',
    family: 'G1-wide',
    author: 'system',
    usageCount: 120
  },
  {
    id: 'rural-compact',
    name: 'Rural Compact',
    description: '紧凑型乡村道路标志',
    family: 'G2',
    author: 'system',
    usageCount: 85
  },
  {
    id: 'my-template-1',
    name: '我的自定义模板',
    description: '针对特定路段的定制模板',
    family: 'G1-narrow',
    author: 'user',
    usageCount: 12
  }
]

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  const systemTemplates = MOCK_TEMPLATES.filter(t => t.author === 'system')
  const userTemplates = MOCK_TEMPLATES.filter(t => t.author === 'user')
  
  return (
    <div className="container mx-auto py-8 px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">模板库</h1>
        <p className="text-muted-foreground text-lg">
          管理参数和版式模板，快速创建标准化设计
        </p>
      </div>
      
      <Tabs defaultValue="system" className="space-y-6">
        <TabsList>
          <TabsTrigger value="system">系统模板</TabsTrigger>
          <TabsTrigger value="user">我的模板</TabsTrigger>
          <TabsTrigger value="favorites">收藏</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemTemplates.map(template => (
              <Card 
                key={template.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{template.family}</Badge>
                    {template.isFavorite && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded h-40 mb-4 flex items-center justify-center text-5xl">
                    🛣️
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      使用 {template.usageCount} 次
                    </span>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Star className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="user" className="space-y-4">
          {userTemplates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>暂无自定义模板</p>
                <p className="text-sm mt-2">在编辑器中保存设计为模板</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTemplates.map(template => (
                <Card 
                  key={template.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{template.family}</Badge>
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded h-40 mb-4 flex items-center justify-center text-5xl">
                      🛣️
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        使用 {template.usageCount} 次
                      </span>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Star className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>暂无收藏的模板</p>
              <p className="text-sm mt-2">点击模板上的星标添加收藏</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

