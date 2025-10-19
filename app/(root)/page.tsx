'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

function SectionCard({ title, subtitle, children }: any) {
  return (
    <section className="border rounded-2xl p-4 mb-6 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-zinc-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}

type SignTemplate = {
  id: string
  code: string
  name: string
  description: string
  panelCount: number
  family: string
  panels: Array<{
    position: number
    backgroundColor: string
  }>
}

export default function DashboardPage() {
  const [templates, setTemplates] = useState<SignTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/templates/signs')
      .then(res => res.json())
      .then(data => {
        setTemplates(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load templates:', error)
        setLoading(false)
      })
  }, [])

  return (
    <>
      {/* 顶部两块并排 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SectionCard title="Saved" subtitle="你保存的标志与模板">
          <div className="text-zinc-500 text-sm">暂无保存内容</div>
        </SectionCard>
        <SectionCard title="Recent" subtitle="最近打开">
          <div className="text-zinc-500 text-sm">暂无最近记录</div>
        </SectionCard>
      </div>

      {/* 下方：所有模板 */}
      <SectionCard title="All Templates" subtitle="选择模板开始；Details 可查看参数">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {templates.map((t) => (
              <div key={t.code} className="border rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] flex flex-col gap-1 p-3 bg-zinc-50">
                  {/* 显示面板预览 */}
                  {t.panels.map((panel) => (
                    <div 
                      key={panel.position}
                      className="flex-1 rounded border-2 border-white"
                      style={{ backgroundColor: panel.backgroundColor }}
                    />
                  ))}
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{t.code}</div>
                    </div>
                  </div>
                  <div className="text-xs text-zinc-600 mb-3 line-clamp-2">
                    {t.description}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-zinc-500">
                      {t.panelCount} 面板
                    </div>
                    <div className="flex items-center gap-2">
                      <Link 
                        href="/new" 
                        className="text-emerald-700 text-sm font-medium hover:text-emerald-800"
                      >
                        Use
                      </Link>
                      <Link 
                        href={`/templates/${t.code}`} 
                        className="text-zinc-500 text-xs underline hover:text-zinc-700"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </>
  )
}
