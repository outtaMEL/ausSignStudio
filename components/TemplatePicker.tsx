'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

type Template = {
  id: string
  name: string
  description: string
  thumbnail?: string
  isFavorite?: boolean
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: 'default-au',
    name: 'Default Australian',
    description: 'AS 1742.6 标准模板，适用于大多数场景',
    isFavorite: true
  },
  {
    id: 'vic-metro',
    name: 'VIC Metro Style',
    description: '维多利亚州都市区风格',
    isFavorite: false
  },
  {
    id: 'rural-compact',
    name: 'Rural Compact',
    description: '紧凑型乡村道路标志',
    isFavorite: false
  }
]

type Props = {
  selected: string | null
  onSelect: (templateId: string) => void
}

export function TemplatePicker({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {MOCK_TEMPLATES.map(template => {
        const isSelected = selected === template.id
        
        return (
          <Card
            key={template.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              isSelected && "ring-2 ring-primary"
            )}
            onClick={() => onSelect(template.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {template.description}
                  </CardDescription>
                </div>
                {template.isFavorite && (
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded h-24 flex items-center justify-center text-4xl">
                🛣️
              </div>
              {isSelected && (
                <Badge variant="default" className="mt-2">已选择</Badge>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

