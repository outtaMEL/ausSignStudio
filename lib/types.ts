// Core data types for sign documents

export type Shield = { 
  network: 'M' | 'A' | 'B' | 'LOCAL'
  code: string 
}

export type ArrowType = 
  | 'V' | 'CL' | 'CR' | 'HL' | 'HR' | 'AL' | 'AR' 
  | 'EL' | 'ER' | 'SL' | 'SR' | 'ELS' | 'ERS' | 'BL' | 'BR'

export type DirectionBlock = {
  destinations: { text: string; primary?: boolean }[]
  shields: Shield[]
  arrow: ArrowType
  distanceKm?: number
  services?: string[]
}

// Diagram types
export type Node = { 
  id: string
  kind: 'line' | 'arc' | 'bezier'
  x: number
  y: number
  r?: number // radius for arc
  sweep?: 1 | -1 // arc sweep direction
  c1?: { x: number; y: number } // bezier control point 1
  c2?: { x: number; y: number } // bezier control point 2
}

export type Path = { 
  id: string
  nodes: Node[]
  laneCount?: number
  arrowType?: ArrowType
  stroke?: number
}

export type Anchor =
  | { type: 'along'; pathId: string; s: number; offset: number; orientation: 'tangent' | 'normal' }
  | { type: 'node'; pathId: string; nodeId: string; orientation?: 'tangentOut' | 'tangentIn' }
  | { type: 'free'; x: number; y: number; angle?: number }

export type ClusterItemKind = 
  | 'destination' | 'routeShield' | 'roadName' | 'instruction' | 'distance' | 'service'

export type ClusterItem = { 
  kind: ClusterItemKind
  payload: any 
}

export type Cluster = { 
  id: string
  anchor: Anchor
  items: ClusterItem[]
  order: string[]
}

export type Diagram = { 
  paths: Path[]
  clusters: Cluster[] 
}

export type SignFamily = 
  | 'G1-wide' | 'G1-narrow' | 'G2' | 'G3' | 'Type3' | 'TypeD' | 'Diagram'

export type SpacingRule = { 
  pair: string
  mode: 'abs' | 'multiplier'
  value: number
  min?: number
  max?: number 
}

export type AuditIssue = { 
  code: string
  msg: string
  fixable: boolean
  severity?: 'error' | 'warning' | 'info'
}

export type SignDoc = {
  id: string
  family: SignFamily
  templateId: string
  layout: 'LANDSCAPE' | 'PORTRAIT'
  directions: DirectionBlock[]
  diagram?: Diagram
  tokens: {
    fontPrimary: number
    fontSecondary: number
    lineGap: number
    margins: number
    divider: { show: boolean; thickness: number }
    scales: { shield: number; arrow: number }
  }
  spacingRules: SpacingRule[]
  board: { width: number; height: number }
  svg?: string
  audit?: { issues: AuditIssue[] }
}

// Reflow output types
export type Box = {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'destination' | 'shield' | 'arrow' | 'distance' | 'service' | 'group'
}

export type ReflowResult = {
  boxes: Box[]
  paths: { d: string; id: string }[]
  guides: { x?: number; y?: number; type: 'margin' | 'center' | 'baseline' }[]
  auditIssues: AuditIssue[]
}

