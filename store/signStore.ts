import { create } from 'zustand'
import { SignDoc, AuditIssue } from '@/lib/types'
import { reflow as runReflow, generateSVG } from '@/lib/reflow'
import { audit as runAudit, autoFix } from '@/lib/audit'

export type EditorMode = 'LOCK' | 'UNLOCK'

type SignState = {
  // Current document
  doc: SignDoc
  
  // Editor state
  editorMode: EditorMode
  selectedElements: string[]
  hoveredElement: string | null
  
  // UI state
  wizardStep: number
  previewScale: number
  
  // Recent documents
  recentDocs: { id: string; name: string; thumbnail?: string; updatedAt: string }[]
  
  // Actions
  setDoc: (partial: Partial<SignDoc>) => void
  setEditorMode: (mode: EditorMode) => void
  setSelectedElements: (ids: string[]) => void
  setHoveredElement: (id: string | null) => void
  setWizardStep: (step: number) => void
  setPreviewScale: (scale: number) => void
  
  // Document operations
  reflow: () => void
  audit: () => void
  applyFix: (issueCode: string) => void
  exportSVG: () => string
  
  // Document management
  newDocument: (family: SignDoc['family'], templateId: string) => void
  saveDocument: () => void
  loadDocument: (id: string) => void
}

const DEFAULT_DOC: SignDoc = {
  id: 'tmp-' + Date.now(),
  family: 'G1-wide',
  templateId: 'default-au',
  layout: 'LANDSCAPE',
  directions: [],
  tokens: {
    fontPrimary: 240,
    fontSecondary: 180,
    lineGap: 0.75,
    margins: 1.0,
    divider: { show: true, thickness: 8 },
    scales: { shield: 1.0, arrow: 1.0 }
  },
  spacingRules: [],
  board: { width: 3800, height: 1400 }
}

export const useSignStore = create<SignState>((set, get) => ({
  // Initial state
  doc: DEFAULT_DOC,
  editorMode: 'LOCK',
  selectedElements: [],
  hoveredElement: null,
  wizardStep: 0,
  previewScale: 0.2,
  recentDocs: [],
  
  // Basic setters
  setDoc: (partial) => {
    set(state => ({
      doc: { ...state.doc, ...partial }
    }))
  },
  
  setEditorMode: (mode) => set({ editorMode: mode }),
  
  setSelectedElements: (ids) => set({ selectedElements: ids }),
  
  setHoveredElement: (id) => set({ hoveredElement: id }),
  
  setWizardStep: (step) => set({ wizardStep: step }),
  
  setPreviewScale: (scale) => set({ previewScale: scale }),
  
  // Document operations
  reflow: () => {
    const { doc } = get()
    const result = runReflow(doc)
    const svg = generateSVG(doc, result)
    
    set(state => ({
      doc: {
        ...state.doc,
        svg,
        audit: {
          issues: [...(state.doc.audit?.issues || []), ...result.auditIssues]
        }
      }
    }))
  },
  
  audit: () => {
    const { doc } = get()
    const result = runAudit(doc)
    
    set(state => ({
      doc: {
        ...state.doc,
        audit: result
      }
    }))
  },
  
  applyFix: (issueCode) => {
    const { doc } = get()
    const fixes = autoFix(doc, issueCode)
    
    if (Object.keys(fixes).length > 0) {
      set(state => ({
        doc: { ...state.doc, ...fixes }
      }))
      
      // Re-audit after applying fix
      setTimeout(() => get().audit(), 0)
    }
  },
  
  exportSVG: () => {
    const { doc } = get()
    if (!doc.svg) {
      get().reflow()
    }
    return get().doc.svg || ''
  },
  
  // Document management
  newDocument: (family, templateId) => {
    const boardSizes = {
      'G1-wide': { width: 3800, height: 1400 },
      'G1-narrow': { width: 1800, height: 2400 },
      'G2': { width: 2400, height: 1200 },
      'G3': { width: 1800, height: 900 },
      'Type3': { width: 3000, height: 2000 },
      'TypeD': { width: 2400, height: 600 },
      'Diagram': { width: 3000, height: 2000 }
    }
    
    const layout = family === 'G1-narrow' ? 'PORTRAIT' : 'LANDSCAPE'
    
    set({
      doc: {
        ...DEFAULT_DOC,
        id: 'doc-' + Date.now(),
        family,
        templateId,
        layout,
        board: boardSizes[family] || { width: 3000, height: 1500 }
      },
      wizardStep: 0,
      selectedElements: [],
      hoveredElement: null
    })
  },
  
  saveDocument: () => {
    const { doc, recentDocs } = get()
    
    // Mock save - in real app would persist to backend
    const docInfo = {
      id: doc.id,
      name: `${doc.family} - ${new Date().toLocaleDateString()}`,
      updatedAt: new Date().toISOString()
    }
    
    const updated = [docInfo, ...recentDocs.filter(d => d.id !== doc.id)].slice(0, 10)
    
    set({ recentDocs: updated })
    
    console.log('Document saved:', docInfo)
  },
  
  loadDocument: (id) => {
    // Mock load - in real app would fetch from backend
    console.log('Loading document:', id)
    
    // For now, just create a new document
    get().newDocument('G1-wide', 'default-au')
  }
}))

