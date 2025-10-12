'use client'

import { SignFamily } from '@/lib/types'
import { RULES } from '@/lib/rules'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type SignTypeCard = {
  family: SignFamily
  thumbnail: string
  color: string
}

const SIGN_TYPES: SignTypeCard[] = [
  { family: 'G1-wide', thumbnail: '🛣️', color: 'bg-blue-100' },
  { family: 'G1-narrow', thumbnail: '📏', color: 'bg-green-100' },
  { family: 'G2', thumbnail: '⚠️', color: 'bg-yellow-100' },
  { family: 'G3', thumbnail: '🏘️', color: 'bg-purple-100' },
  { family: 'Type3', thumbnail: '🗺️', color: 'bg-orange-100' },
  { family: 'TypeD', thumbnail: '➡️', color: 'bg-pink-100' },
  { family: 'Diagram', thumbnail: '✏️', color: 'bg-indigo-100' },
]

type Props = {
  selected: SignFamily | null
  onSelect: (family: SignFamily) => void
}

export function StepA1TypeTemplate({ selected, onSelect }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">选择标志类型</h2>
        <p className="text-muted-foreground">
          选择符合您需求的标志类型，每种类型遵循不同的设计规范
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {SIGN_TYPES.map(type => {
          const spec = RULES.families[type.family]
          const isSelected = selected === type.family
          
          return (
            <Card
              key={type.family}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={() => onSelect(type.family)}
            >
              <CardHeader>
                <div className={cn("w-full h-32 rounded-md flex items-center justify-center text-6xl", type.color)}>
                  {type.thumbnail}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2">{spec.name}</CardTitle>
                <CardDescription className="text-xs mb-3">
                  {spec.ref}
                </CardDescription>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Layout:</span>
                    <Badge variant="outline">{spec.layout}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Max Directions:</span>
                    <Badge variant="secondary">{spec.maxDirections > 10 ? '∞' : spec.maxDirections}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {spec.allowsShields && <Badge variant="default" className="text-xs">Shields</Badge>}
                    {spec.allowsArrows && <Badge variant="default" className="text-xs">Arrows</Badge>}
                  </div>
                </div>
                
                <p className="mt-3 text-xs text-muted-foreground">
                  {spec.notes}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {selected && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-semibold mb-1">已选择: {RULES.families[selected].name}</h3>
          <p className="text-sm text-muted-foreground">
            {RULES.families[selected].notes}
          </p>
        </div>
      )}
    </div>
  )
}

