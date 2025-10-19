'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

type SignTemplate = {
  id: string
  code: string
  name: string
  panelCount: number
  panels: Array<{
    position: number
    backgroundColor: string
  }>
}

type ElementTemplate = {
  id: string
  name: string
  type: string
  category: string | null
  usageCount: number
}

export default function LibraryPage() {
  const [signTemplates, setSignTemplates] = useState<SignTemplate[]>([])
  const [elements, setElements] = useState<ElementTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/templates/signs').then(r => r.json()),
      fetch('/api/templates/elements').then(r => r.json())
    ]).then(([signs, elems]) => {
      setSignTemplates(signs)
      setElements(elems)
      setLoading(false)
    }).catch(error => {
      console.error('Failed to load library:', error)
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

  return (
    <>
      <section className="border rounded-2xl p-4 mb-6 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold mb-1">Board Templates</h2>
            <p className="text-sm text-zinc-500">所有板式模板（基于 AS1742 标准）</p>
          </div>
          <Link 
            href="/templates" 
            className="text-emerald-700 text-sm font-medium hover:underline"
          >
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {signTemplates.map(template => (
            <div 
              key={template.id} 
              className="border rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow"
            >
              <div className="h-24 flex flex-col gap-1 p-2 bg-zinc-50">
                {template.panels.map(panel => (
                  <div
                    key={panel.position}
                    className="flex-1 rounded border border-white"
                    style={{ backgroundColor: panel.backgroundColor }}
                  />
                ))}
              </div>
              <div className="p-2">
                <div className="text-sm font-medium">{template.code}</div>
                <div className="text-xs text-zinc-500">{template.panelCount} 面板</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border rounded-2xl p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold mb-1">Element Library</h2>
            <p className="text-sm text-zinc-500">路盾、箭头、服务符号</p>
          </div>
          <Link 
            href="/templates?tab=elements" 
            className="text-emerald-700 text-sm font-medium hover:underline"
          >
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {elements.slice(0, 12).map(element => (
            <div 
              key={element.id} 
              className="h-16 border rounded-lg flex flex-col items-center justify-center text-xs text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              <div className="font-medium line-clamp-1 px-1 text-center">
                {element.name}
              </div>
              <div className="text-[10px] text-zinc-400">
                {element.type}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
