'use client'

import { useState } from 'react'
import { Plus, Upload } from 'lucide-react'

type Element = {
  id: string
  name: string
  category: 'shield' | 'arrow' | 'service' | 'symbol'
  isDefault: boolean
  preview: string
}

const DEFAULT_ELEMENTS: Element[] = [
  { id: '1', name: 'M Shield', category: 'shield', isDefault: true, preview: '🛡️ M' },
  { id: '2', name: 'A Shield', category: 'shield', isDefault: true, preview: '🛡️ A' },
  { id: '3', name: 'B Shield', category: 'shield', isDefault: true, preview: '🛡️ B' },
  { id: '4', name: 'Vertical Arrow', category: 'arrow', isDefault: true, preview: '↑' },
  { id: '5', name: 'Chevron Left', category: 'arrow', isDefault: true, preview: '↰' },
  { id: '6', name: 'Chevron Right', category: 'arrow', isDefault: true, preview: '↱' },
  { id: '7', name: 'Hospital', category: 'service', isDefault: true, preview: 'H' },
  { id: '8', name: 'Fuel', category: 'service', isDefault: true, preview: '⛽' },
  { id: '9', name: 'Parking', category: 'service', isDefault: true, preview: 'P' },
]

const ADDED_ELEMENTS: Element[] = [
  { id: '101', name: 'Custom Exit Left', category: 'arrow', isDefault: false, preview: '⤴️' },
  { id: '102', name: 'Custom Highway Logo', category: 'symbol', isDefault: false, preview: '🏛️' },
  { id: '103', name: 'Restaurant Symbol', category: 'service', isDefault: false, preview: '🍽️' },
]

export default function ElementLibraryPage() {
  const [activeTab, setActiveTab] = useState<'default' | 'added'>('default')
  const [filter, setFilter] = useState<'all' | 'shield' | 'arrow' | 'service' | 'symbol'>('all')

  const elements = activeTab === 'default' ? DEFAULT_ELEMENTS : ADDED_ELEMENTS
  const filteredElements = filter === 'all' ? elements : elements.filter(e => e.category === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Element Library</h1>
          <p className="text-sm text-zinc-500 mt-1">
            路盾、箭头、服务符号等设计元素
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Element
        </button>
      </div>

      {/* Tabs */}
      <div className="border rounded-xl bg-white overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('default')}
            className={`flex-1 px-6 py-3 text-sm font-medium ${
              activeTab === 'default'
                ? 'bg-emerald-700 text-white'
                : 'hover:bg-zinc-50'
            }`}
          >
            Default Elements
            <span className="ml-2 text-xs opacity-75">({DEFAULT_ELEMENTS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('added')}
            className={`flex-1 px-6 py-3 text-sm font-medium border-l ${
              activeTab === 'added'
                ? 'bg-emerald-700 text-white'
                : 'hover:bg-zinc-50'
            }`}
          >
            Added by You
            <span className="ml-2 text-xs opacity-75">({ADDED_ELEMENTS.length})</span>
          </button>
        </div>

        {/* Category Filter */}
        <div className="p-4 border-b bg-zinc-50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-zinc-500">Category:</span>
            {(['all', 'shield', 'arrow', 'service', 'symbol'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs ${
                  filter === cat
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white border hover:bg-zinc-50'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Elements Grid */}
        <div className="p-4">
          {filteredElements.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p>No elements found</p>
              {activeTab === 'added' && (
                <button className="text-emerald-700 text-sm hover:underline mt-2">
                  Upload your first element
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredElements.map(element => (
                <div
                  key={element.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="aspect-square bg-zinc-50 rounded-lg flex items-center justify-center text-4xl mb-2">
                    {element.preview}
                  </div>
                  <div className="text-xs font-medium truncate">{element.name}</div>
                  <div className="text-xs text-zinc-500 capitalize">{element.category}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {activeTab === 'added' && (
        <div className="border rounded-xl p-4 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Plus className="h-5 w-5 text-blue-700 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-blue-900 mb-1">Add Custom Elements</h3>
              <p className="text-xs text-blue-700">
                Upload SVG files or create custom symbols for your signs. Accepted formats: SVG, PNG (with transparency).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

