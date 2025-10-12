import { SignDoc, ReflowResult, Box, AuditIssue } from './types'

/**
 * Reflow engine - computes layout boxes and SVG paths from sign document
 * This is a MOCK implementation for v1 - provides deterministic results for UI
 */
export function reflow(signDoc: SignDoc): ReflowResult {
  const boxes: Box[] = []
  const paths: { d: string; id: string }[] = []
  const guides: ReflowResult['guides'] = []
  const auditIssues: AuditIssue[] = []

  const { fontPrimary, lineGap, margins } = signDoc.tokens
  const H = fontPrimary // Primary font height in mm
  const gap = H * lineGap
  const marginH = H * margins
  const marginV = H * margins * 0.75

  // Board dimensions
  const { width: boardW, height: boardH } = signDoc.board

  // Add margin guides
  guides.push(
    { x: marginH, type: 'margin' },
    { x: boardW - marginH, type: 'margin' },
    { y: marginV, type: 'margin' },
    { y: boardH - marginV, type: 'margin' },
    { x: boardW / 2, type: 'center' }
  )

  if (signDoc.family === 'Diagram' && signDoc.diagram) {
    // Diagrammatic layout - mock path rendering
    signDoc.diagram.paths.forEach((path, idx) => {
      const pathD = path.nodes.map((node, i) => {
        if (i === 0) return `M ${node.x} ${node.y}`
        if (node.kind === 'line') return `L ${node.x} ${node.y}`
        if (node.kind === 'arc') {
          return `A ${node.r || 100} ${node.r || 100} 0 0 ${node.sweep === 1 ? 1 : 0} ${node.x} ${node.y}`
        }
        if (node.kind === 'bezier') {
          return `C ${node.c1?.x} ${node.c1?.y} ${node.c2?.x} ${node.c2?.y} ${node.x} ${node.y}`
        }
        return ''
      }).join(' ')
      paths.push({ d: pathD, id: path.id })
    })

    // Mock cluster boxes
    signDoc.diagram.clusters.forEach((cluster, idx) => {
      const anchor = cluster.anchor
      let x = 100 + idx * 300
      let y = 100
      
      if (anchor.type === 'free') {
        x = anchor.x
        y = anchor.y
      }

      // Stack cluster items vertically
      cluster.items.forEach((item, itemIdx) => {
        boxes.push({
          id: `${cluster.id}-item-${itemIdx}`,
          x: x - 100,
          y: y + itemIdx * (H + gap * 0.5),
          width: 200,
          height: H,
          type: item.kind as any
        })
      })
    })
  } else {
    // Standard linear layout (G1/G2/G3/TypeD)
    let currentY = marginV

    signDoc.directions.forEach((dir, idx) => {
      const groupStartY = currentY

      // Mock destination text boxes
      dir.destinations.forEach((dest, destIdx) => {
        boxes.push({
          id: `dir-${idx}-dest-${destIdx}`,
          x: marginH,
          y: currentY,
          width: 800,
          height: dest.primary ? H : H * 0.75,
          type: 'destination'
        })
        currentY += (dest.primary ? H : H * 0.75) + gap
      })

      // Mock shields
      if (dir.shields.length > 0) {
        let shieldX = marginH + 850
        dir.shields.forEach((shield, sIdx) => {
          boxes.push({
            id: `dir-${idx}-shield-${sIdx}`,
            x: shieldX,
            y: groupStartY,
            width: H * 1.2,
            height: H * 1.2,
            type: 'shield'
          })
          shieldX += H * 1.2 + H * 0.5
        })
      }

      // Mock arrow
      boxes.push({
        id: `dir-${idx}-arrow`,
        x: boardW - marginH - H * 1.5,
        y: groupStartY,
        width: H * 1.5,
        height: H * 1.5,
        type: 'arrow'
      })

      // Mock distance
      if (dir.distanceKm) {
        boxes.push({
          id: `dir-${idx}-distance`,
          x: boardW - marginH - H * 3,
          y: groupStartY,
          width: H * 1.2,
          height: H * 0.75,
          type: 'distance'
        })
      }

      // Inter-group spacing
      currentY += gap * 2
    })

    // Check if content overflows
    if (currentY > boardH - marginV) {
      auditIssues.push({
        code: 'CONTENT_OVERFLOW',
        msg: `Content height ${Math.round(currentY)}mm exceeds board height ${boardH}mm`,
        fixable: true,
        severity: 'error'
      })
    }

    // Check line gap
    if (lineGap < 0.5) {
      auditIssues.push({
        code: 'LINE_GAP_MIN',
        msg: `Line gap ${lineGap.toFixed(2)}H is below minimum 0.5H`,
        fixable: true,
        severity: 'warning'
      })
    }
  }

  return { boxes, paths, guides, auditIssues }
}

/**
 * Generate SVG string from reflow result
 */
export function generateSVG(signDoc: SignDoc, reflow: ReflowResult): string {
  const { width, height } = signDoc.board
  
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n`
  
  // Background
  svg += `  <rect width="${width}" height="${height}" fill="#006747" />\n`
  
  // Render paths (for diagrammatic)
  reflow.paths.forEach(path => {
    svg += `  <path d="${path.d}" stroke="white" stroke-width="8" fill="none" />\n`
  })
  
  // Render boxes
  reflow.boxes.forEach(box => {
    const color = box.type === 'destination' ? '#FFFFFF' : 
                  box.type === 'shield' ? '#FFD700' :
                  box.type === 'arrow' ? '#FFFFFF' : '#CCCCCC'
    
    svg += `  <rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" fill="${color}" opacity="0.9" />\n`
    svg += `  <text x="${box.x + box.width/2}" y="${box.y + box.height/2}" text-anchor="middle" dominant-baseline="middle" fill="#000" font-size="14">${box.type}</text>\n`
  })
  
  svg += '</svg>'
  return svg
}

