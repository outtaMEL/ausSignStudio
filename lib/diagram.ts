import { Path, Node, Anchor, Cluster } from './types'

/**
 * Diagram utility functions for path manipulation and Frenet frame calculations
 */

/**
 * Calculate point and tangent along a path at parameter s (0 to 1)
 */
export function getPointOnPath(path: Path, s: number): { x: number; y: number; tx: number; ty: number } {
  const nodes = path.nodes
  if (nodes.length === 0) return { x: 0, y: 0, tx: 1, ty: 0 }
  
  // Simple linear interpolation for mock
  const totalSegments = nodes.length - 1
  if (totalSegments === 0) {
    const n = nodes[0]
    return { x: n.x, y: n.y, tx: 1, ty: 0 }
  }
  
  const segmentIndex = Math.min(Math.floor(s * totalSegments), totalSegments - 1)
  const segmentS = (s * totalSegments) - segmentIndex
  
  const n1 = nodes[segmentIndex]
  const n2 = nodes[segmentIndex + 1]
  
  const x = n1.x + (n2.x - n1.x) * segmentS
  const y = n1.y + (n2.y - n1.y) * segmentS
  
  // Tangent vector (normalized)
  const dx = n2.x - n1.x
  const dy = n2.y - n1.y
  const len = Math.sqrt(dx * dx + dy * dy)
  const tx = len > 0 ? dx / len : 1
  const ty = len > 0 ? dy / len : 0
  
  return { x, y, tx, ty }
}

/**
 * Calculate normal vector (perpendicular to tangent)
 */
export function getNormal(tx: number, ty: number): { nx: number; ny: number } {
  return { nx: -ty, ny: tx }
}

/**
 * Get anchor position and orientation
 */
export function resolveAnchor(anchor: Anchor, paths: Path[]): { x: number; y: number; angle: number } {
  if (anchor.type === 'free') {
    return { x: anchor.x, y: anchor.y, angle: anchor.angle || 0 }
  }
  
  if (anchor.type === 'along') {
    const path = paths.find(p => p.id === anchor.pathId)
    if (!path) return { x: 0, y: 0, angle: 0 }
    
    const { x, y, tx, ty } = getPointOnPath(path, anchor.s)
    
    if (anchor.orientation === 'normal') {
      const { nx, ny } = getNormal(tx, ty)
      return {
        x: x + nx * anchor.offset,
        y: y + ny * anchor.offset,
        angle: Math.atan2(ny, nx) * 180 / Math.PI
      }
    } else {
      return {
        x: x + tx * anchor.offset,
        y: y + ty * anchor.offset,
        angle: Math.atan2(ty, tx) * 180 / Math.PI
      }
    }
  }
  
  if (anchor.type === 'node') {
    const path = paths.find(p => p.id === anchor.pathId)
    if (!path) return { x: 0, y: 0, angle: 0 }
    
    const node = path.nodes.find(n => n.id === anchor.nodeId)
    if (!node) return { x: 0, y: 0, angle: 0 }
    
    // Calculate tangent at node (mock - use next/prev node)
    const nodeIdx = path.nodes.indexOf(node)
    let tx = 1, ty = 0
    
    if (anchor.orientation === 'tangentOut' && nodeIdx < path.nodes.length - 1) {
      const next = path.nodes[nodeIdx + 1]
      tx = next.x - node.x
      ty = next.y - node.y
    } else if (anchor.orientation === 'tangentIn' && nodeIdx > 0) {
      const prev = path.nodes[nodeIdx - 1]
      tx = node.x - prev.x
      ty = node.y - prev.y
    }
    
    const len = Math.sqrt(tx * tx + ty * ty)
    if (len > 0) {
      tx /= len
      ty /= len
    }
    
    return {
      x: node.x,
      y: node.y,
      angle: Math.atan2(ty, tx) * 180 / Math.PI
    }
  }
  
  return { x: 0, y: 0, angle: 0 }
}

/**
 * Snap angle to nearest increment (0, 15, 30, 45, 90 degrees)
 */
export function snapAngle(angle: number, increment: number = 15): number {
  return Math.round(angle / increment) * increment
}

/**
 * Calculate intersection of two line segments
 */
export function lineIntersection(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  p4: { x: number; y: number }
): { x: number; y: number } | null {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x)
  if (Math.abs(d) < 0.001) return null // parallel
  
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d
  const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / d
  
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return {
      x: p1.x + t * (p2.x - p1.x),
      y: p1.y + t * (p2.y - p1.y)
    }
  }
  
  return null
}

