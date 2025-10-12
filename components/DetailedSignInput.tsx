'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSignStore } from '@/store/signStore'
import { SignFamily, DirectionBlock, ArrowType } from '@/lib/types'
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react'

const SIGN_FAMILIES = [
  { value: 'G1-wide', label: 'G1-1 Stack Wide' },
  { value: 'G1-narrow', label: 'G1-N Stack Narrow' },
  { value: 'G2', label: 'G2 Intersection Type 1' },
  { value: 'G3', label: 'G3 Intersection Type 2' },
  { value: 'TypeD', label: 'Type D Panel' },
  { value: 'Type3', label: 'Type 3 Fingerboard' },
  { value: 'Diagram', label: 'Diagrammatic' },
]

const ARROW_OPTIONS: { value: ArrowType; label: string }[] = [
  { value: 'V', label: '↑ Vertical (Ahead)' },
  { value: 'CL', label: '↰ Chevron Left' },
  { value: 'CR', label: '↱ Chevron Right' },
  { value: 'HL', label: '↺ Hook Left' },
  { value: 'HR', label: '↻ Hook Right' },
  { value: 'AL', label: '↖ Angle Left' },
  { value: 'AR', label: '↗ Angle Right' },
  { value: 'EL', label: '⤴ Exit Left' },
  { value: 'ER', label: '⤵ Exit Right' },
]

type DirectionInput = {
  id: string
  expanded: boolean
  useArrow: boolean
  arrow: ArrowType
  useDestination: boolean
  destinations: string[]
  useRoadNumber: boolean
  roadNetwork: 'M' | 'A' | 'B'
  roadNumber: string
  useRoadName: boolean
  roadName: string
  useDistance: boolean
  distance: string
}

export default function DetailedSignInput() {
  const router = useRouter()
  const { newDocument, setDoc, reflow, audit } = useSignStore()
  
  const [family, setFamily] = useState<SignFamily>('G1-wide')
  const [directions, setDirections] = useState<DirectionInput[]>([
    {
      id: '1',
      expanded: true,
      useArrow: true,
      arrow: 'V',
      useDestination: true,
      destinations: ['Sydney'],
      useRoadNumber: true,
      roadNetwork: 'A',
      roadNumber: '30',
      useRoadName: false,
      roadName: '',
      useDistance: false,
      distance: ''
    }
  ])

  // Auto-reflow when inputs change
  useEffect(() => {
    handlePreview()
  }, [family, directions])

  const addDirection = () => {
    setDirections([
      ...directions,
      {
        id: Date.now().toString(),
        expanded: true,
        useArrow: true,
        arrow: 'V',
        useDestination: true,
        destinations: [''],
        useRoadNumber: false,
        roadNetwork: 'M',
        roadNumber: '',
        useRoadName: false,
        roadName: '',
        useDistance: false,
        distance: ''
      }
    ])
  }

  const removeDirection = (id: string) => {
    setDirections(directions.filter(d => d.id !== id))
  }

  const updateDirection = (id: string, updates: Partial<DirectionInput>) => {
    setDirections(directions.map(d => (d.id === id ? { ...d, ...updates } : d)))
  }

  const toggleExpanded = (id: string) => {
    setDirections(directions.map(d => (d.id === id ? { ...d, expanded: !d.expanded } : d)))
  }

  const addDestination = (dirId: string) => {
    setDirections(
      directions.map(d =>
        d.id === dirId ? { ...d, destinations: [...d.destinations, ''] } : d
      )
    )
  }

  const updateDestination = (dirId: string, destIdx: number, value: string) => {
    setDirections(
      directions.map(d =>
        d.id === dirId
          ? {
              ...d,
              destinations: d.destinations.map((dest, idx) =>
                idx === destIdx ? value : dest
              )
            }
          : d
      )
    )
  }

  const removeDestination = (dirId: string, destIdx: number) => {
    setDirections(
      directions.map(d =>
        d.id === dirId
          ? { ...d, destinations: d.destinations.filter((_, idx) => idx !== destIdx) }
          : d
      )
    )
  }

  const handlePreview = () => {
    // Convert inputs to DirectionBlock[]
    const blocks: DirectionBlock[] = directions.map(dir => ({
      destinations: dir.useDestination
        ? dir.destinations.filter(d => d.trim()).map(text => ({ text }))
        : [],
      shields: dir.useRoadNumber && dir.roadNumber.trim()
        ? [{ network: dir.roadNetwork, code: dir.roadNumber }]
        : [],
      arrow: dir.useArrow ? dir.arrow : 'V',
      distanceKm: dir.useDistance && dir.distance ? parseFloat(dir.distance) : undefined,
      services: []
    }))

    newDocument(family, 'detailed-input')
    setDoc({ directions: blocks })
    setTimeout(() => {
      reflow()
      audit()
    }, 50)
  }

  const handleCreate = () => {
    handlePreview()
    setTimeout(() => router.push('/editor'), 100)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: Live Preview */}
      <div className="space-y-4">
        <div className="border rounded-xl p-4 bg-white">
          <h3 className="font-semibold mb-3">Live Preview</h3>
          <div className="bg-zinc-50 rounded-lg p-4 min-h-[400px] border-2 border-dashed border-zinc-300">
            <LivePreview />
          </div>
        </div>
      </div>

      {/* RIGHT: Input Form */}
      <div className="space-y-4">
        {/* Sign Type Selection */}
        <div className="border rounded-xl p-4 bg-white">
          <label className="block text-sm font-semibold mb-2">Sign Type</label>
          <select
            value={family}
            onChange={e => setFamily(e.target.value as SignFamily)}
            className="w-full px-3 py-2 rounded-lg border bg-white"
          >
            {SIGN_FAMILIES.map(f => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Directions */}
        <div className="border rounded-xl p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Directions</h3>
            <button
              onClick={addDirection}
              className="px-3 py-1 rounded-lg bg-emerald-700 text-white text-sm flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {directions.map((dir, idx) => (
              <div key={dir.id} className="border rounded-lg overflow-hidden">
                {/* Header */}
                <div
                  className="flex items-center justify-between p-3 bg-zinc-50 cursor-pointer"
                  onClick={() => toggleExpanded(dir.id)}
                >
                  <div className="flex items-center gap-2">
                    {dir.expanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium text-sm">Direction {idx + 1}</span>
                  </div>
                  {directions.length > 1 && (
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        removeDirection(dir.id)
                      }}
                      className="p-1 hover:bg-zinc-200 rounded"
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </button>
                  )}
                </div>

                {/* Content */}
                {dir.expanded && (
                  <div className="p-3 space-y-3 text-sm">
                    {/* Arrow */}
                    <div>
                      <label className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={dir.useArrow}
                          onChange={e =>
                            updateDirection(dir.id, { useArrow: e.target.checked })
                          }
                        />
                        <span className="font-medium">Arrow</span>
                      </label>
                      {dir.useArrow && (
                        <select
                          value={dir.arrow}
                          onChange={e =>
                            updateDirection(dir.id, { arrow: e.target.value as ArrowType })
                          }
                          className="w-full px-2 py-1 rounded border text-xs"
                        >
                          {ARROW_OPTIONS.map(a => (
                            <option key={a.value} value={a.value}>
                              {a.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Destinations */}
                    <div>
                      <label className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={dir.useDestination}
                          onChange={e =>
                            updateDirection(dir.id, { useDestination: e.target.checked })
                          }
                        />
                        <span className="font-medium">Destination(s)</span>
                      </label>
                      {dir.useDestination && (
                        <div className="space-y-1">
                          {dir.destinations.map((dest, destIdx) => (
                            <div key={destIdx} className="flex gap-1">
                              <input
                                type="text"
                                value={dest}
                                onChange={e =>
                                  updateDestination(dir.id, destIdx, e.target.value)
                                }
                                placeholder="e.g., Sydney"
                                className="flex-1 px-2 py-1 rounded border text-xs"
                              />
                              {dir.destinations.length > 1 && (
                                <button
                                  onClick={() => removeDestination(dir.id, destIdx)}
                                  className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            onClick={() => addDestination(dir.id)}
                            className="text-xs text-emerald-700 hover:underline"
                          >
                            + Add destination
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Road Number */}
                    <div>
                      <label className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={dir.useRoadNumber}
                          onChange={e =>
                            updateDirection(dir.id, { useRoadNumber: e.target.checked })
                          }
                        />
                        <span className="font-medium">Road Number (Shield)</span>
                      </label>
                      {dir.useRoadNumber && (
                        <div className="flex gap-2">
                          <select
                            value={dir.roadNetwork}
                            onChange={e =>
                              updateDirection(dir.id, {
                                roadNetwork: e.target.value as 'M' | 'A' | 'B'
                              })
                            }
                            className="px-2 py-1 rounded border text-xs"
                          >
                            <option value="M">M</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                          </select>
                          <input
                            type="text"
                            value={dir.roadNumber}
                            onChange={e =>
                              updateDirection(dir.id, { roadNumber: e.target.value })
                            }
                            placeholder="30"
                            className="flex-1 px-2 py-1 rounded border text-xs"
                          />
                        </div>
                      )}
                    </div>

                    {/* Road Name */}
                    <div>
                      <label className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={dir.useRoadName}
                          onChange={e =>
                            updateDirection(dir.id, { useRoadName: e.target.checked })
                          }
                        />
                        <span className="font-medium">Road Name</span>
                      </label>
                      {dir.useRoadName && (
                        <input
                          type="text"
                          value={dir.roadName}
                          onChange={e =>
                            updateDirection(dir.id, { roadName: e.target.value })
                          }
                          placeholder="e.g., SALTASH HWY"
                          className="w-full px-2 py-1 rounded border text-xs"
                        />
                      )}
                    </div>

                    {/* Distance */}
                    <div>
                      <label className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={dir.useDistance}
                          onChange={e =>
                            updateDirection(dir.id, { useDistance: e.target.checked })
                          }
                        />
                        <span className="font-medium">Distance (km)</span>
                      </label>
                      {dir.useDistance && (
                        <input
                          type="number"
                          value={dir.distance}
                          onChange={e =>
                            updateDirection(dir.id, { distance: e.target.value })
                          }
                          placeholder="5"
                          className="w-full px-2 py-1 rounded border text-xs"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreate}
            className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm"
          >
            Create & Open in Editor
          </button>
          <button
            onClick={handlePreview}
            className="px-4 py-2 rounded-lg border text-sm"
          >
            Update Preview
          </button>
        </div>
      </div>
    </div>
  )
}

function LivePreview() {
  const doc = useSignStore(state => state.doc)
  
  if (!doc.svg) {
    return (
      <div className="h-full flex items-center justify-center text-zinc-400 text-sm">
        Fill in the form to see live preview
      </div>
    )
  }

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: doc.svg }}
    />
  )
}

