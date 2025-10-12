'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignStore } from '@/store/signStore'

type FamilyCategory = 'non-diagram' | 'diagram'

const NON_DIAGRAM_FAMILIES = [
  { value: 'G1-wide', label: 'G1-wide' },
  { value: 'G1-narrow', label: 'G1-narrow' },
  { value: 'G2', label: 'G2' },
  { value: 'G3', label: 'G3' },
  { value: 'TypeD', label: 'TypeD' },
] as const

const DIAGRAM_FAMILIES = [
  { value: 'Diagram', label: 'Diagram' },
  { value: 'Type3', label: 'Type3' },
] as const

export default function QuickStartForm() {
  const router = useRouter()
  const { newDocument, setDoc, reflow, audit } = useSignStore()

  const [category, setCategory] = useState<FamilyCategory>('non-diagram')
  const families = category === 'non-diagram' ? NON_DIAGRAM_FAMILIES : DIAGRAM_FAMILIES
  const [family, setFamily] = useState<string>(families[0].value)
  const [dirCount, setDirCount] = useState<number>(2)
  const [includeShields, setIncludeShields] = useState<boolean>(true)
  const [includeDistance, setIncludeDistance] = useState<boolean>(false)
  const [goTo, setGoTo] = useState<'editor'|'preview'>('editor')

  // keep selected family in sync when category switches
  useMemo(() => {
    if (category === 'non-diagram' && !NON_DIAGRAM_FAMILIES.find(f => f.value === family)) {
      setFamily(NON_DIAGRAM_FAMILIES[0].value)
    }
    if (category === 'diagram' && !DIAGRAM_FAMILIES.find(f => f.value === family)) {
      setFamily(DIAGRAM_FAMILIES[0].value)
    }
  }, [category])

  const handleCreate = () => {
    // 1) 基于 family 新建文档
    newDocument(family as any, 'quick')

    // 2) 生成方向内容占位
    const count = Math.max(1, Math.min(3, dirCount))
    const directions = Array.from({ length: count }).map((_, i) => ({
      destinations: [{ text: i === 0 ? 'Sample Destination' : `Dest ${i+1}`, primary: i === 0 }],
      shields: includeShields ? [{ network: 'M', code: '1' }] : [],
      arrow: 'V' as const,
      distanceKm: includeDistance ? 5 : undefined,
      services: [] as string[],
    }))

    setDoc({ directions })

    // 3) 运行一次布局与审计
    setTimeout(() => { reflow(); audit(); }, 0)

    // 4) 跳转
    if (goTo === 'editor') router.push('/editor')
    else router.push('/export')
  }

  return (
    <div className="space-y-4">
      {/* Row 1: Category & Family */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Category</label>
          <div className="flex rounded-lg border overflow-hidden">
            <button
              type="button"
              className={`flex-1 px-3 py-2 text-sm ${category==='non-diagram'?'bg-emerald-700 text-white':'bg-white hover:bg-zinc-50'}`}
              onClick={() => setCategory('non-diagram')}
            >Non-diagram</button>
            <button
              type="button"
              className={`flex-1 px-3 py-2 text-sm ${category==='diagram'?'bg-emerald-700 text-white':'bg-white hover:bg-zinc-50'}`}
              onClick={() => setCategory('diagram')}
            >Diagram</button>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-zinc-500 mb-1">Sign Type</label>
          <select
            value={family}
            onChange={(e)=>setFamily(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border bg-white"
          >
            {families.map(f=> (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2: Variables */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Directions</label>
          <input
            type="number"
            min={1}
            max={3}
            value={dirCount}
            onChange={(e)=>setDirCount(parseInt(e.target.value || '1',10))}
            className="w-full px-3 py-2 rounded-lg border"
          />
        </div>
        <div className="flex items-center gap-2">
          <input id="shield" type="checkbox" checked={includeShields} onChange={(e)=>setIncludeShields(e.target.checked)} />
          <label htmlFor="shield" className="text-sm text-zinc-700">Include Shields</label>
        </div>
        <div className="flex items-center gap-2">
          <input id="dist" type="checkbox" checked={includeDistance} onChange={(e)=>setIncludeDistance(e.target.checked)} />
          <label htmlFor="dist" className="text-sm text-zinc-700">Include Distance</label>
        </div>
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Open</label>
          <select value={goTo} onChange={(e)=>setGoTo(e.target.value as any)} className="w-full px-3 py-2 rounded-lg border bg-white">
            <option value="editor">Editor</option>
            <option value="preview">Export Preview</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={handleCreate}
          className="px-3 py-2 rounded-lg bg-emerald-700 text-white text-sm"
        >
          Create
        </button>
        <span className="text-xs text-zinc-500">选择类型并填写变量，一步生成并进入编辑器</span>
      </div>
    </div>
  )
}


