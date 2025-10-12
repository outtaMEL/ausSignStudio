'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditBoardPage() {
  const params = useParams()
  const router = useRouter()
  const boardId = params.id as string

  const [name, setName] = useState('G1-Wide Compact')
  const [fontPrimary, setFontPrimary] = useState(220)
  const [fontSecondary, setFontSecondary] = useState(165)
  const [lineGap, setLineGap] = useState(0.65)
  const [margins, setMargins] = useState(0.8)
  const [shieldScale, setShieldScale] = useState(0.9)
  const [arrowScale, setArrowScale] = useState(1.0)

  const handleSave = () => {
    // Save logic here
    alert('Parameters saved!')
    router.push('/library/board')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/library/board"
          className="p-2 hover:bg-zinc-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Board Template</h1>
          <p className="text-sm text-zinc-500">Adjust common parameters for this variation</p>
        </div>
      </div>

      <div className="border rounded-2xl p-6 bg-white space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Template Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border"
          />
        </div>

        {/* Font Sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Primary Font (mm)
            </label>
            <input
              type="number"
              value={fontPrimary}
              onChange={e => setFontPrimary(parseFloat(e.target.value))}
              min={180}
              max={400}
              step={10}
              className="w-full px-3 py-2 rounded-lg border"
            />
            <div className="mt-1 text-xs text-zinc-500">Range: 180-400mm</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Secondary Font (mm)
            </label>
            <input
              type="number"
              value={fontSecondary}
              onChange={e => setFontSecondary(parseFloat(e.target.value))}
              min={120}
              max={300}
              step={10}
              className="w-full px-3 py-2 rounded-lg border"
            />
            <div className="mt-1 text-xs text-zinc-500">Range: 120-300mm</div>
          </div>
        </div>

        {/* Spacing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Line Gap (×H)
            </label>
            <input
              type="number"
              value={lineGap}
              onChange={e => setLineGap(parseFloat(e.target.value))}
              min={0.5}
              max={1.5}
              step={0.05}
              className="w-full px-3 py-2 rounded-lg border"
            />
            <div className="mt-1 text-xs text-zinc-500">Recommended: 0.75H</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Margins (×H)
            </label>
            <input
              type="number"
              value={margins}
              onChange={e => setMargins(parseFloat(e.target.value))}
              min={0.5}
              max={2.0}
              step={0.1}
              className="w-full px-3 py-2 rounded-lg border"
            />
            <div className="mt-1 text-xs text-zinc-500">Recommended: 1.0H</div>
          </div>
        </div>

        {/* Scales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Shield Scale
            </label>
            <input
              type="number"
              value={shieldScale}
              onChange={e => setShieldScale(parseFloat(e.target.value))}
              min={0.5}
              max={1.5}
              step={0.1}
              className="w-full px-3 py-2 rounded-lg border"
            />
            <div className="mt-1 text-xs text-zinc-500">Default: 1.0</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Arrow Scale
            </label>
            <input
              type="number"
              value={arrowScale}
              onChange={e => setArrowScale(parseFloat(e.target.value))}
              min={0.5}
              max={1.5}
              step={0.1}
              className="w-full px-3 py-2 rounded-lg border"
            />
            <div className="mt-1 text-xs text-zinc-500">Default: 1.0</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
          <Link
            href="/library/board"
            className="px-4 py-2 rounded-lg border text-sm"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}

