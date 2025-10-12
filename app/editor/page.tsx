'use client'

import { useSignStore } from '@/store/signStore'
import { SVGCanvas } from '@/components/SVGCanvas'
import { LayerTree } from '@/components/LayerTree'
import { PropertyPanel } from '@/components/PropertyPanel'
import { SpacingPanel } from '@/components/SpacingPanel'
import { AuditPanel } from '@/components/AuditPanel'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Lock, Unlock, Save, Download } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function EditorPage() {
  const router = useRouter()
  const {
    doc,
    editorMode,
    selectedElements,
    hoveredElement,
    setDoc,
    setEditorMode,
    setSelectedElements,
    setHoveredElement,
    reflow,
    audit,
    applyFix,
    saveDocument
  } = useSignStore()
  
  useEffect(() => {
    // Initial reflow and audit
    reflow()
    audit()
  }, [reflow, audit])
  
  const handleSave = () => {
    saveDocument()
    alert('文档已保存')
  }
  
  const handleExport = () => {
    router.push('/export')
  }
  
  const handleSelectElement = (id: string, multi?: boolean) => {
    if (multi) {
      if (selectedElements.includes(id)) {
        setSelectedElements(selectedElements.filter(e => e !== id))
      } else {
        setSelectedElements([...selectedElements, id])
      }
    } else {
      setSelectedElements([id])
    }
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">{doc.family} 编辑器</h1>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
              <Label htmlFor="mode-switch" className="text-sm cursor-pointer">
                {editorMode === 'LOCK' ? (
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>LOCK 模式</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Unlock className="h-4 w-4" />
                    <span>UNLOCK 模式</span>
                  </div>
                )}
              </Label>
              <Switch
                id="mode-switch"
                checked={editorMode === 'UNLOCK'}
                onCheckedChange={(checked) => setEditorMode(checked ? 'UNLOCK' : 'LOCK')}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
            <Button variant="default" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </div>
      </div>
      
      {/* Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Layer Tree */}
        <div className="w-64 border-r bg-white p-4 overflow-auto">
          <LayerTree
            doc={doc}
            selectedElements={selectedElements}
            onSelectElement={handleSelectElement}
          />
        </div>
        
        {/* Center - Canvas */}
        <div className="flex-1">
          <SVGCanvas
            doc={doc}
            selectedElements={selectedElements}
            hoveredElement={hoveredElement}
            onSelectElement={handleSelectElement}
            onHoverElement={setHoveredElement}
            editorMode={editorMode}
          />
        </div>
        
        {/* Right Panel - Properties/Spacing/Audit */}
        <div className="w-80 border-l bg-white overflow-auto">
          <Tabs defaultValue="properties" className="h-full">
            <TabsList className="grid w-full grid-cols-3 sticky top-0 bg-white z-10">
              <TabsTrigger value="properties">属性</TabsTrigger>
              <TabsTrigger value="spacing">间距</TabsTrigger>
              <TabsTrigger value="audit">审计</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="p-4">
              <PropertyPanel
                doc={doc}
                selectedElements={selectedElements}
                onChange={(partial) => {
                  setDoc(partial)
                  setTimeout(() => {
                    reflow()
                    audit()
                  }, 100)
                }}
              />
            </TabsContent>
            
            <TabsContent value="spacing" className="p-4">
              <SpacingPanel
                doc={doc}
                onChange={(partial) => {
                  setDoc(partial)
                  setTimeout(() => {
                    reflow()
                    audit()
                  }, 100)
                }}
              />
            </TabsContent>
            
            <TabsContent value="audit" className="p-4">
              <AuditPanel
                doc={doc}
                onApplyFix={(code) => {
                  applyFix(code)
                  setTimeout(() => {
                    reflow()
                    audit()
                  }, 100)
                }}
                onRefresh={() => {
                  reflow()
                  audit()
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

