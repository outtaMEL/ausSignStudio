'use client'

import { SignDoc } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronDown, Eye, EyeOff, Lock, Unlock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type LayerNode = {
  id: string
  label: string
  type: 'group' | 'element'
  children?: LayerNode[]
  visible?: boolean
  locked?: boolean
}

type Props = {
  doc: SignDoc
  selectedElements: string[]
  onSelectElement: (id: string, multi?: boolean) => void
}

export function LayerTree({ doc, selectedElements, onSelectElement }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['root']))
  
  // Build mock layer tree from directions
  const buildLayerTree = (): LayerNode => {
    const root: LayerNode = {
      id: 'root',
      label: '标志内容',
      type: 'group',
      visible: true,
      children: []
    }
    
    doc.directions.forEach((dir, idx) => {
      const dirNode: LayerNode = {
        id: `dir-${idx}`,
        label: `方向 ${idx + 1}`,
        type: 'group',
        visible: true,
        children: []
      }
      
      // Destinations
      dir.destinations.forEach((dest, destIdx) => {
        dirNode.children?.push({
          id: `dir-${idx}-dest-${destIdx}`,
          label: dest.text || `目的地 ${destIdx + 1}`,
          type: 'element',
          visible: true
        })
      })
      
      // Shields
      dir.shields.forEach((shield, sIdx) => {
        dirNode.children?.push({
          id: `dir-${idx}-shield-${sIdx}`,
          label: `${shield.network}${shield.code}`,
          type: 'element',
          visible: true
        })
      })
      
      // Arrow
      dirNode.children?.push({
        id: `dir-${idx}-arrow`,
        label: `箭头 (${dir.arrow})`,
        type: 'element',
        visible: true
      })
      
      root.children?.push(dirNode)
    })
    
    return root
  }
  
  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }
  
  const renderNode = (node: LayerNode, depth: number = 0) => {
    const isExpanded = expanded.has(node.id)
    const isSelected = selectedElements.includes(node.id)
    const hasChildren = node.children && node.children.length > 0
    
    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-100",
            isSelected && "bg-blue-50"
          )}
          style={{ paddingLeft: depth * 16 + 8 }}
          onClick={() => onSelectElement(node.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(node.id)
              }}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          
          {!hasChildren && <div className="w-4" />}
          
          <span className="flex-1 text-sm truncate">{node.label}</span>
          
          <div className="flex gap-0.5">
            <button className="p-0.5 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100">
              {node.visible ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </button>
            <button className="p-0.5 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100">
              {node.locked ? (
                <Lock className="h-3 w-3" />
              ) : (
                <Unlock className="h-3 w-3" />
              )}
            </button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children?.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }
  
  const tree = buildLayerTree()
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">图层</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto group">
          {renderNode(tree)}
        </div>
      </CardContent>
    </Card>
  )
}

