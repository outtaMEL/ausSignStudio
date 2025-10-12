'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Settings } from 'lucide-react'

type BoardVariation = {
  id: string
  name: string
  baseType: string
  fontPrimary: number
  lineGap: number
  margins: number
  customParams: Record<string, any>
  lastUsed: string
}

const MOCK_BOARDS: BoardVariation[] = [
  {
    id: '1',
    name: 'G1-Wide Standard',
    baseType: 'G1-wide',
    fontPrimary: 240,
    lineGap: 0.75,
    margins: 1.0,
    customParams: {},
    lastUsed: '2025-01-15'
  },
  {
    id: '2',
    name: 'G1-Wide Compact',
    baseType: 'G1-wide',
    fontPrimary: 220,
    lineGap: 0.65,
    margins: 0.8,
    customParams: { shieldScale: 0.9 },
    lastUsed: '2025-01-14'
  },
  {
    id: '3',
    name: 'G2 Highway Style',
    baseType: 'G2',
    fontPrimary: 260,
    lineGap: 0.8,
    margins: 1.2,
    customParams: { arrowScale: 1.1 },
    lastUsed: '2025-01-13'
  },
  {
    id: '4',
    name: 'G3 Urban',
    baseType: 'G3',
    fontPrimary: 200,
    lineGap: 0.7,
    margins: 0.9,
    customParams: {},
    lastUsed: '2025-01-12'
  },
]

const BOARD_TYPES = ['G1-wide', 'G1-narrow', 'G2', 'G3', 'Type3', 'TypeD', 'Diagram']

export default function BoardLibraryPage() {
  const [selectedType, setSelectedType] = useState<string>('all')
  
  const groupedBoards = selectedType === 'all'
    ? BOARD_TYPES.reduce((acc, type) => {
        acc[type] = MOCK_BOARDS.filter(b => b.baseType === type)
        return acc
      }, {} as Record<string, BoardVariation[]>)
    : { [selectedType]: MOCK_BOARDS.filter(b => b.baseType === selectedType) }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Board Templates</h1>
          <p className="text-sm text-zinc-500 mt-1">
            管理不同标志类型的自定义变体和常用参数配置
          </p>
        </div>
        <Link
          href="/new"
          className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New
        </Link>
      </div>

      {/* Type Filter */}
      <div className="border rounded-xl p-3 bg-white">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-zinc-500">Filter:</span>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedType === 'all' ? 'bg-emerald-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200'
            }`}
          >
            All Types
          </button>
          {BOARD_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedType === type ? 'bg-emerald-700 text-white' : 'bg-zinc-100 hover:bg-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped Boards */}
      {Object.entries(groupedBoards).map(([type, boards]) => (
        boards.length > 0 && (
          <div key={type} className="border rounded-2xl p-4 bg-white">
            <h2 className="text-lg font-semibold mb-3">{type}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.map(board => (
                <div key={board.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1">{board.name}</h3>
                      <p className="text-xs text-zinc-500">Last used: {board.lastUsed}</p>
                    </div>
                    <Link
                      href={`/library/board/${board.id}/edit`}
                      className="p-1.5 hover:bg-zinc-100 rounded"
                      title="Edit parameters"
                    >
                      <Settings className="h-4 w-4 text-zinc-500" />
                    </Link>
                  </div>

                  <div className="space-y-1.5 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Font Primary:</span>
                      <span className="font-mono">{board.fontPrimary}mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Line Gap:</span>
                      <span className="font-mono">{board.lineGap}H</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Margins:</span>
                      <span className="font-mono">{board.margins}H</span>
                    </div>
                    {Object.keys(board.customParams).length > 0 && (
                      <div className="text-zinc-500 pt-1 border-t">
                        +{Object.keys(board.customParams).length} custom params
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/new?board=${board.id}`}
                    className="block w-full py-2 text-center rounded-lg bg-emerald-700 text-white text-xs hover:bg-emerald-800"
                  >
                    Use This Template
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      {Object.values(groupedBoards).every(boards => boards.length === 0) && (
        <div className="border rounded-2xl p-12 bg-white text-center">
          <p className="text-zinc-500">No board templates found for this type</p>
          <Link href="/new" className="text-emerald-700 text-sm hover:underline mt-2 inline-block">
            Create your first template
          </Link>
        </div>
      )}
    </div>
  )
}

