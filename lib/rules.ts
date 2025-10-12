// Australian road sign design rules (AS 1742 / MUTCD simplified)
export const RULES = {
  // Spacing rules (multipliers of primary font height H)
  spacing: {
    lineGapMin: 0.5,
    lineGapPref: 0.75,
    lineGapMax: 1.25,
    interElementMin: 0.75,
    interElementPref: 1.0,
    interGroupMinMultiplier: 2.0,
    interGroupPrefMultiplier: 2.5
  },
  
  // Edge clearances (multipliers of H)
  edgeClear: {
    roadNamePanel: { v: 0.5, h: 0.5 },
    tollPanel: { v: 0.25, h: 0.25 },
    default: { v: 0.75, h: 1.0 }
  },
  
  // Allowed arrow types
  arrowsAllowed: [
    'V', 'CL', 'CR', 'HL', 'HR', 'AL', 'AR', 
    'EL', 'ER', 'SL', 'SR', 'ELS', 'ERS', 'BL', 'BR'
  ] as const,
  
  // Sign family specifications
  families: {
    'G1-wide': {
      name: 'G1 Wide Direction Sign',
      ref: 'AS 1742.6 Section 1.6.2',
      layout: 'LANDSCAPE' as const,
      maxDirections: 3,
      allowsShields: true,
      allowsArrows: true,
      notes: 'For major routes with multiple destinations'
    },
    'G1-narrow': {
      name: 'G1 Narrow Direction Sign',
      ref: 'AS 1742.6 Section 1.6.3',
      layout: 'PORTRAIT' as const,
      maxDirections: 3,
      allowsShields: true,
      allowsArrows: true,
      notes: 'For space-constrained locations; shields/arrows may be stacked'
    },
    'G2': {
      name: 'G2 Advance Direction Sign',
      ref: 'AS 1742.6 Section 1.6.4',
      layout: 'LANDSCAPE' as const,
      maxDirections: 2,
      allowsShields: true,
      allowsArrows: true,
      notes: 'Advance warning 200-500m before junction'
    },
    'G3': {
      name: 'G3 Minor Road Direction',
      ref: 'AS 1742.6 Section 1.6.5',
      layout: 'LANDSCAPE' as const,
      maxDirections: 2,
      allowsShields: false,
      allowsArrows: true,
      notes: 'For local roads, no route shields'
    },
    'Type3': {
      name: 'Type 3 Diagrammatic',
      ref: 'AS 1742.6 Section 3.2',
      layout: 'LANDSCAPE' as const,
      maxDirections: 99,
      allowsShields: true,
      allowsArrows: true,
      notes: 'Complex junctions; free-form diagram with paths and clusters'
    },
    'TypeD': {
      name: 'Type D Directional Panel',
      ref: 'AS 1742.6 Section 3.4',
      layout: 'LANDSCAPE' as const,
      maxDirections: 1,
      allowsShields: false,
      allowsArrows: true,
      notes: 'Single direction panel for stacking'
    },
    'Diagram': {
      name: 'Diagrammatic (Generic)',
      ref: 'Custom',
      layout: 'LANDSCAPE' as const,
      maxDirections: 99,
      allowsShields: true,
      allowsArrows: true,
      notes: 'Free-form diagrammatic design'
    }
  }
} as const

export type ArrowType = typeof RULES.arrowsAllowed[number]
export type SignFamily = keyof typeof RULES.families

