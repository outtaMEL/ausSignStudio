'use client'

import { SignDoc, DirectionBlock, Shield } from '@/lib/types'
import { getSchemaForFamily } from '@/lib/dynamic-form-schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

type Props = {
  doc: SignDoc
  onChange: (doc: Partial<SignDoc>) => void
  onPreview: () => void
}

export function StepA2DynamicForm({ doc, onChange, onPreview }: Props) {
  const [directions, setDirections] = useState<DirectionBlock[]>(
    doc.directions.length > 0 ? doc.directions : [
      { destinations: [{ text: '' }], shields: [], arrow: 'V', services: [] }
    ]
  )
  
  const schema = getSchemaForFamily(doc.family)
  
  const updateDirection = (idx: number, updated: Partial<DirectionBlock>) => {
    const newDirections = [...directions]
    newDirections[idx] = { ...newDirections[idx], ...updated }
    setDirections(newDirections)
    onChange({ directions: newDirections })
    onPreview()
  }
  
  const addDirection = () => {
    const newDir: DirectionBlock = {
      destinations: [{ text: '' }],
      shields: [],
      arrow: 'V',
      services: []
    }
    setDirections([...directions, newDir])
  }
  
  const removeDirection = (idx: number) => {
    const newDirections = directions.filter((_, i) => i !== idx)
    setDirections(newDirections)
    onChange({ directions: newDirections })
    onPreview()
  }
  
  const addDestination = (dirIdx: number) => {
    const newDirections = [...directions]
    newDirections[dirIdx].destinations.push({ text: '' })
    setDirections(newDirections)
  }
  
  const updateDestination = (dirIdx: number, destIdx: number, text: string) => {
    const newDirections = [...directions]
    newDirections[dirIdx].destinations[destIdx].text = text
    setDirections(newDirections)
    onChange({ directions: newDirections })
    onPreview()
  }
  
  const addShield = (dirIdx: number) => {
    const newDirections = [...directions]
    newDirections[dirIdx].shields.push({ network: 'M', code: '' })
    setDirections(newDirections)
  }
  
  const updateShield = (dirIdx: number, shieldIdx: number, shield: Partial<Shield>) => {
    const newDirections = [...directions]
    newDirections[dirIdx].shields[shieldIdx] = {
      ...newDirections[dirIdx].shields[shieldIdx],
      ...shield
    }
    setDirections(newDirections)
    onChange({ directions: newDirections })
    onPreview()
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">填写标志内容</h2>
        <p className="text-muted-foreground">
          根据选择的类型填写目的地、路盾、箭头等信息
        </p>
      </div>
      
      <div className="space-y-4">
        {directions.map((dir, dirIdx) => (
          <Card key={dirIdx}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">方向 {dirIdx + 1}</CardTitle>
                {directions.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDirection(dirIdx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Destinations */}
              <div className="space-y-2">
                <Label>目的地</Label>
                {dir.destinations.map((dest, destIdx) => (
                  <Input
                    key={destIdx}
                    value={dest.text}
                    onChange={(e) => updateDestination(dirIdx, destIdx, e.target.value)}
                    placeholder={`目的地 ${destIdx + 1}`}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addDestination(dirIdx)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  添加目的地
                </Button>
              </div>
              
              {/* Shields */}
              <div className="space-y-2">
                <Label>路盾</Label>
                {dir.shields.map((shield, shieldIdx) => (
                  <div key={shieldIdx} className="flex gap-2">
                    <Select
                      value={shield.network}
                      onValueChange={(value) => 
                        updateShield(dirIdx, shieldIdx, { network: value as Shield['network'] })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">M (Motorway)</SelectItem>
                        <SelectItem value="A">A (Highway)</SelectItem>
                        <SelectItem value="B">B (State)</SelectItem>
                        <SelectItem value="LOCAL">Local</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={shield.code}
                      onChange={(e) => updateShield(dirIdx, shieldIdx, { code: e.target.value })}
                      placeholder="号码"
                      className="flex-1"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addShield(dirIdx)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  添加路盾
                </Button>
              </div>
              
              {/* Arrow */}
              <div className="space-y-2">
                <Label>箭头类型</Label>
                <Select
                  value={dir.arrow}
                  onValueChange={(value) => updateDirection(dirIdx, { arrow: value as DirectionBlock['arrow'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="V">↑ Vertical (Ahead)</SelectItem>
                    <SelectItem value="CL">↰ Chevron Left</SelectItem>
                    <SelectItem value="CR">↱ Chevron Right</SelectItem>
                    <SelectItem value="HL">↺ Hook Left</SelectItem>
                    <SelectItem value="HR">↻ Hook Right</SelectItem>
                    <SelectItem value="AL">↖ Angle Left</SelectItem>
                    <SelectItem value="AR">↗ Angle Right</SelectItem>
                    <SelectItem value="EL">⤴ Exit Left</SelectItem>
                    <SelectItem value="ER">⤵ Exit Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Distance */}
              <div className="space-y-2">
                <Label>距离 (km) - 可选</Label>
                <Input
                  type="number"
                  value={dir.distanceKm || ''}
                  onChange={(e) => updateDirection(dirIdx, { 
                    distanceKm: e.target.value ? parseFloat(e.target.value) : undefined 
                  })}
                  placeholder="例如: 5"
                />
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button onClick={addDirection} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          添加方向
        </Button>
      </div>
    </div>
  )
}

