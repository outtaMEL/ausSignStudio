'use client'

import { SignDoc, SpacingRule } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  doc: SignDoc
  onChange: (doc: Partial<SignDoc>) => void
}

export function SpacingPanel({ doc, onChange }: Props) {
  const addRule = () => {
    const newRule: SpacingRule = {
      pair: 'Group↔Group',
      mode: 'multiplier',
      value: 2.0,
      min: 1.5,
      max: 3.0
    }
    
    onChange({
      spacingRules: [...doc.spacingRules, newRule]
    })
  }
  
  const updateRule = (idx: number, updated: Partial<SpacingRule>) => {
    const newRules = [...doc.spacingRules]
    newRules[idx] = { ...newRules[idx], ...updated }
    onChange({ spacingRules: newRules })
  }
  
  const removeRule = (idx: number) => {
    onChange({
      spacingRules: doc.spacingRules.filter((_, i) => i !== idx)
    })
  }
  
  const getRuleStatus = (rule: SpacingRule): 'ok' | 'warning' | 'error' => {
    if (rule.mode === 'multiplier') {
      if (rule.min && rule.value < rule.min) return 'error'
      if (rule.max && rule.value > rule.max) return 'warning'
      if (rule.value < 0.5) return 'error'
    } else {
      if (rule.value < 0) return 'error'
    }
    return 'ok'
  }
  
  return (
    <Card className="h-full overflow-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">间距规则</CardTitle>
          <Button size="sm" onClick={addRule}>
            <Plus className="h-4 w-4 mr-1" />
            添加
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          定义元素对之间的间距规则，支持绝对值(mm)或倍数(×H)
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {doc.spacingRules.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            暂无自定义间距规则<br/>
            点击"添加"创建规则
          </div>
        ) : (
          doc.spacingRules.map((rule, idx) => {
            const status = getRuleStatus(rule)
            
            return (
              <Card key={idx} className={cn(
                "border",
                status === 'error' && "border-red-300 bg-red-50",
                status === 'warning' && "border-yellow-300 bg-yellow-50"
              )}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {status === 'ok' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      {status === 'error' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <span className="text-sm font-semibold">规则 {idx + 1}</span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => removeRule(idx)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">元素对</Label>
                      <Select
                        value={rule.pair}
                        onValueChange={(value) => updateRule(idx, { pair: value })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Group↔Group">Group ↔ Group</SelectItem>
                          <SelectItem value="Group↔Arrow">Group ↔ Arrow</SelectItem>
                          <SelectItem value="Destination↔Shield">Destination ↔ Shield</SelectItem>
                          <SelectItem value="Shield↔Arrow">Shield ↔ Arrow</SelectItem>
                          <SelectItem value="RoadName↔Any">RoadName ↔ Any</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">模式</Label>
                        <Select
                          value={rule.mode}
                          onValueChange={(value) => updateRule(idx, { mode: value as 'abs' | 'multiplier' })}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="abs">绝对值 (mm)</SelectItem>
                            <SelectItem value="multiplier">倍数 (×H)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs">值</Label>
                        <Input
                          type="number"
                          value={rule.value}
                          onChange={(e) => updateRule(idx, { value: parseFloat(e.target.value) })}
                          step={rule.mode === 'multiplier' ? 0.25 : 10}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">最小值</Label>
                        <Input
                          type="number"
                          value={rule.min || ''}
                          onChange={(e) => updateRule(idx, { min: e.target.value ? parseFloat(e.target.value) : undefined })}
                          step={rule.mode === 'multiplier' ? 0.25 : 10}
                          className="h-8 text-xs"
                          placeholder="可选"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs">最大值</Label>
                        <Input
                          type="number"
                          value={rule.max || ''}
                          onChange={(e) => updateRule(idx, { max: e.target.value ? parseFloat(e.target.value) : undefined })}
                          step={rule.mode === 'multiplier' ? 0.25 : 10}
                          className="h-8 text-xs"
                          placeholder="可选"
                        />
                      </div>
                    </div>
                    
                    {status !== 'ok' && (
                      <div className="text-xs">
                        {status === 'error' && (
                          <Badge variant="destructive" className="text-xs">
                            值超出允许范围
                          </Badge>
                        )}
                        {status === 'warning' && (
                          <Badge variant="outline" className="text-xs">
                            建议调整到推荐范围内
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
        
        <div className="pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            应用到模板
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

