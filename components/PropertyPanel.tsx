'use client'

import { SignDoc } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type Props = {
  doc: SignDoc
  selectedElements: string[]
  onChange: (doc: Partial<SignDoc>) => void
}

export function PropertyPanel({ doc, selectedElements, onChange }: Props) {
  const updateTokens = (key: string, value: any) => {
    onChange({
      tokens: { ...doc.tokens, [key]: value }
    })
  }
  
  const updateBoard = (key: 'width' | 'height', value: number) => {
    onChange({
      board: { ...doc.board, [key]: value }
    })
  }
  
  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">属性</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="tokens">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tokens">令牌</TabsTrigger>
            <TabsTrigger value="board">画板</TabsTrigger>
            <TabsTrigger value="element">元素</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tokens" className="space-y-4 mt-4">
            {/* Font sizes */}
            <div className="space-y-2">
              <Label>主字号 (mm)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={doc.tokens.fontPrimary}
                  onChange={(e) => updateTokens('fontPrimary', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground self-center">
                  {doc.tokens.fontPrimary}mm
                </span>
              </div>
              <Slider
                value={[doc.tokens.fontPrimary]}
                onValueChange={([v]) => updateTokens('fontPrimary', v)}
                min={120}
                max={400}
                step={10}
              />
            </div>
            
            <div className="space-y-2">
              <Label>副字号 (mm)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={doc.tokens.fontSecondary}
                  onChange={(e) => updateTokens('fontSecondary', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground self-center">
                  {doc.tokens.fontSecondary}mm
                </span>
              </div>
              <Slider
                value={[doc.tokens.fontSecondary]}
                onValueChange={([v]) => updateTokens('fontSecondary', v)}
                min={80}
                max={300}
                step={10}
              />
            </div>
            
            {/* Line gap */}
            <div className="space-y-2">
              <Label>行距 (×H)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={doc.tokens.lineGap}
                  onChange={(e) => updateTokens('lineGap', parseFloat(e.target.value))}
                  step={0.05}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground self-center">
                  {doc.tokens.lineGap}H
                </span>
              </div>
              <Slider
                value={[doc.tokens.lineGap * 100]}
                onValueChange={([v]) => updateTokens('lineGap', v / 100)}
                min={25}
                max={200}
                step={5}
              />
            </div>
            
            {/* Margins */}
            <div className="space-y-2">
              <Label>边距 (×H)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={doc.tokens.margins}
                  onChange={(e) => updateTokens('margins', parseFloat(e.target.value))}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground self-center">
                  {doc.tokens.margins}H
                </span>
              </div>
              <Slider
                value={[doc.tokens.margins * 100]}
                onValueChange={([v]) => updateTokens('margins', v / 100)}
                min={25}
                max={200}
                step={5}
              />
            </div>
            
            {/* Scales */}
            <div className="space-y-2">
              <Label>路盾缩放</Label>
              <Slider
                value={[doc.tokens.scales.shield * 100]}
                onValueChange={([v]) => updateTokens('scales', { ...doc.tokens.scales, shield: v / 100 })}
                min={50}
                max={150}
                step={5}
              />
              <span className="text-xs text-muted-foreground">
                {Math.round(doc.tokens.scales.shield * 100)}%
              </span>
            </div>
            
            <div className="space-y-2">
              <Label>箭头缩放</Label>
              <Slider
                value={[doc.tokens.scales.arrow * 100]}
                onValueChange={([v]) => updateTokens('scales', { ...doc.tokens.scales, arrow: v / 100 })}
                min={50}
                max={150}
                step={5}
              />
              <span className="text-xs text-muted-foreground">
                {Math.round(doc.tokens.scales.arrow * 100)}%
              </span>
            </div>
          </TabsContent>
          
          <TabsContent value="board" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>宽度 (mm)</Label>
              <Input
                type="number"
                value={doc.board.width}
                onChange={(e) => updateBoard('width', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>高度 (mm)</Label>
              <Input
                type="number"
                value={doc.board.height}
                onChange={(e) => updateBoard('height', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>布局</Label>
              <Select
                value={doc.layout}
                onValueChange={(value) => onChange({ layout: value as 'LANDSCAPE' | 'PORTRAIT' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LANDSCAPE">横向 (Landscape)</SelectItem>
                  <SelectItem value="PORTRAIT">纵向 (Portrait)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="element" className="space-y-4 mt-4">
            {selectedElements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                请选择元素以编辑属性
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  已选择 {selectedElements.length} 个元素
                </p>
                {/* Element-specific properties would go here */}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

