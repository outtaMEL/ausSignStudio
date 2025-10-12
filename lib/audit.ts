import { SignDoc, AuditIssue } from './types'
import { RULES } from './rules'

/**
 * Audit engine - checks sign document against design rules
 * This is a MOCK implementation for v1
 */
export function audit(signDoc: SignDoc): { issues: AuditIssue[] } {
  const issues: AuditIssue[] = []
  
  const { fontPrimary, lineGap, margins } = signDoc.tokens
  const family = RULES.families[signDoc.family]
  
  // Check line gap
  if (lineGap < RULES.spacing.lineGapMin) {
    issues.push({
      code: 'LINE_GAP_MIN',
      msg: `Line gap ${lineGap.toFixed(2)}H is below minimum ${RULES.spacing.lineGapMin}H`,
      fixable: true,
      severity: 'error'
    })
  } else if (lineGap > RULES.spacing.lineGapMax) {
    issues.push({
      code: 'LINE_GAP_MAX',
      msg: `Line gap ${lineGap.toFixed(2)}H exceeds maximum ${RULES.spacing.lineGapMax}H`,
      fixable: true,
      severity: 'warning'
    })
  }
  
  // Check margins
  if (margins < 0.5) {
    issues.push({
      code: 'MARGIN_MIN',
      msg: `Margin ${margins.toFixed(2)}H is below recommended minimum 0.75H`,
      fixable: true,
      severity: 'warning'
    })
  }
  
  // Check font size
  if (fontPrimary < 180) {
    issues.push({
      code: 'FONT_SIZE_MIN',
      msg: `Primary font ${fontPrimary}mm is below minimum 180mm for readability`,
      fixable: true,
      severity: 'error'
    })
  }
  
  // Check direction count
  if (signDoc.directions.length > family.maxDirections && family.maxDirections < 10) {
    issues.push({
      code: 'DIRECTION_COUNT',
      msg: `${signDoc.directions.length} directions exceeds ${family.name} maximum of ${family.maxDirections}`,
      fixable: false,
      severity: 'error'
    })
  }
  
  // Check shields allowed
  if (!family.allowsShields) {
    const hasShields = signDoc.directions.some(d => d.shields.length > 0)
    if (hasShields) {
      issues.push({
        code: 'SHIELDS_NOT_ALLOWED',
        msg: `${family.name} does not permit route shields`,
        fixable: false,
        severity: 'error'
      })
    }
  }
  
  // Check for empty destinations
  signDoc.directions.forEach((dir, idx) => {
    if (dir.destinations.length === 0) {
      issues.push({
        code: 'EMPTY_DESTINATION',
        msg: `Direction block ${idx + 1} has no destination text`,
        fixable: false,
        severity: 'error'
      })
    }
  })
  
  // Mock spacing checks
  if (signDoc.spacingRules.length > 0) {
    signDoc.spacingRules.forEach(rule => {
      if (rule.mode === 'multiplier' && rule.value < 0.5) {
        issues.push({
          code: 'SPACING_TOO_SMALL',
          msg: `Spacing rule "${rule.pair}" has value ${rule.value}H below minimum 0.5H`,
          fixable: true,
          severity: 'warning'
        })
      }
    })
  }
  
  return { issues }
}

/**
 * Apply auto-fixes to issues
 */
export function autoFix(signDoc: SignDoc, issueCode: string): Partial<SignDoc> {
  const fixes: Partial<SignDoc> = {}
  
  switch (issueCode) {
    case 'LINE_GAP_MIN':
      fixes.tokens = { ...signDoc.tokens, lineGap: RULES.spacing.lineGapPref }
      break
      
    case 'LINE_GAP_MAX':
      fixes.tokens = { ...signDoc.tokens, lineGap: RULES.spacing.lineGapPref }
      break
      
    case 'MARGIN_MIN':
      fixes.tokens = { ...signDoc.tokens, margins: 1.0 }
      break
      
    case 'FONT_SIZE_MIN':
      fixes.tokens = { ...signDoc.tokens, fontPrimary: 240 }
      break
      
    default:
      break
  }
  
  return fixes
}

