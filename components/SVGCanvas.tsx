'use client'

import { useRef, useState, useEffect } from 'react'
import { SignDoc, ReflowResult } from '@/lib/types'
import { reflow } from '@/lib/reflow'
import { cn } from '@/lib/utils'
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  doc: SignDoc
  selectedElements: string[]
  hoveredElement: string | null
  onSelectElement: (id: string, multi?: boolean) => void
  onHoverElement: (id: string | null) => void
  editorMode: 'LOCK' | 'UNLOCK'
}

export function SVGCanvas({ 
  doc, 
  selectedElements, 
  hoveredElement,
  onSelectElement, 
  onHoverElement,
  editorMode 
}: Props) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(0.3)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [reflowResult, setReflowResult] = useState<ReflowResult | null>(null)
  
  useEffect(() => {
    const result = reflow(doc)
    setReflowResult(result)
  }, [doc])
  
  const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 2))
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.1))
  const handleFit = () => setZoom(0.3)
  
  const { width, height } = doc.board
  
  return (
    <div className="relative h-full bg-gray-100 overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button size="icon" variant="secondary" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <div className="bg-white px-3 py-2 rounded-md text-sm font-mono">
          {Math.round(zoom * 100)}%
        </div>
        <Button size="icon" variant="secondary" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" onClick={handleFit}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Grid background */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: `${50 * zoom}px ${50 * zoom}px`
        }}
      />
      
      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="absolute inset-0 flex items-center justify-center overflow-auto"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`
        }}
      >
        <div 
          className="relative bg-white shadow-2xl"
          style={{
            width: width * zoom,
            height: height * zoom,
            transformOrigin: 'center'
          }}
        >
          {/* Board background - green for direction signs */}
          <div 
            className="absolute inset-0 bg-[#006747]"
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* Guides */}
          {reflowResult?.guides.map((guide, idx) => (
            <div
              key={idx}
              className={cn(
                "absolute",
                guide.type === 'margin' && "border-dashed border-yellow-400",
                guide.type === 'center' && "border-dashed border-blue-400",
                guide.type === 'baseline' && "border-dashed border-red-400"
              )}
              style={{
                left: guide.x !== undefined ? guide.x * zoom : 0,
                top: guide.y !== undefined ? guide.y * zoom : 0,
                width: guide.x !== undefined ? '1px' : '100%',
                height: guide.y !== undefined ? '1px' : '100%',
                borderWidth: guide.x !== undefined ? '0 0 0 1px' : '1px 0 0 0'
              }}
            />
          ))}
          
          {/* Boxes (mock content) */}
          {reflowResult?.boxes.map((box) => {
            const isSelected = selectedElements.includes(box.id)
            const isHovered = hoveredElement === box.id
            
            return (
              <div
                key={box.id}
                className={cn(
                  "absolute cursor-pointer transition-all",
                  isSelected && "ring-2 ring-blue-500",
                  isHovered && "ring-2 ring-blue-300"
                )}
                style={{
                  left: box.x * zoom,
                  top: box.y * zoom,
                  width: box.width * zoom,
                  height: box.height * zoom,
                  backgroundColor: box.type === 'destination' ? 'rgba(255,255,255,0.9)' :
                                   box.type === 'shield' ? 'rgba(255,215,0,0.9)' :
                                   box.type === 'arrow' ? 'rgba(255,255,255,0.8)' :
                                   'rgba(200,200,200,0.8)'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectElement(box.id, e.shiftKey)
                }}
                onMouseEnter={() => onHoverElement(box.id)}
                onMouseLeave={() => onHoverElement(null)}
              >
                <div className="flex items-center justify-center h-full text-xs text-black/50">
                  {box.type}
                </div>
              </div>
            )
          })}
          
          {/* Paths (for diagrammatic) */}
          {reflowResult?.paths.map((path) => (
            <svg 
              key={path.id}
              className="absolute inset-0 pointer-events-none"
              style={{ width: '100%', height: '100%' }}
            >
              <path
                d={path.d}
                stroke="white"
                strokeWidth={8 * zoom}
                fill="none"
              />
            </svg>
          ))}
          
          {/* Mode indicator */}
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-semibold">
            {editorMode}
          </div>
        </div>
      </div>
      
      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-4 py-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <div>
            Board: {width} × {height} mm
          </div>
          <div>
            {selectedElements.length > 0 && `${selectedElements.length} selected`}
          </div>
        </div>
      </div>
    </div>
  )
}

