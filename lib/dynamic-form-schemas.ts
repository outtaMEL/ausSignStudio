import { SignFamily } from './types'

export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'array' | 'nested'

export type FormField = {
  name: string
  label: string
  type: FieldType
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  required?: boolean
  placeholder?: string
  fields?: FormField[] // for nested objects
}

export type FormSchema = {
  sections: {
    title: string
    fields: FormField[]
  }[]
}

/**
 * Get form schema for a sign family
 */
export function getSchemaForFamily(family: SignFamily): FormSchema {
  switch (family) {
    case 'G1-wide':
    case 'G1-narrow':
      return {
        sections: [
          {
            title: 'Direction Blocks',
            fields: [
              {
                name: 'directions',
                label: 'Directions',
                type: 'array',
                fields: [
                  {
                    name: 'destinations',
                    label: 'Destinations',
                    type: 'array',
                    fields: [
                      { name: 'text', label: 'Text', type: 'text', required: true, placeholder: 'Melbourne' },
                      { name: 'primary', label: 'Primary', type: 'checkbox' }
                    ]
                  },
                  {
                    name: 'shields',
                    label: 'Route Shields',
                    type: 'array',
                    fields: [
                      { 
                        name: 'network', 
                        label: 'Network', 
                        type: 'select',
                        options: [
                          { value: 'M', label: 'M (Motorway)' },
                          { value: 'A', label: 'A (Highway)' },
                          { value: 'B', label: 'B (State Route)' },
                          { value: 'LOCAL', label: 'Local Route' }
                        ]
                      },
                      { name: 'code', label: 'Route Number', type: 'text', placeholder: '1' }
                    ]
                  },
                  {
                    name: 'arrow',
                    label: 'Arrow Type',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'V', label: 'Vertical (Ahead)' },
                      { value: 'CL', label: 'Chevron Left' },
                      { value: 'CR', label: 'Chevron Right' },
                      { value: 'HL', label: 'Hook Left' },
                      { value: 'HR', label: 'Hook Right' },
                      { value: 'AL', label: 'Angle Left' },
                      { value: 'AR', label: 'Angle Right' },
                      { value: 'EL', label: 'Exit Left' },
                      { value: 'ER', label: 'Exit Right' }
                    ]
                  },
                  { name: 'distanceKm', label: 'Distance (km)', type: 'number', min: 0, max: 999 },
                  {
                    name: 'services',
                    label: 'Services',
                    type: 'array',
                    fields: [
                      { name: 'service', label: 'Service Symbol', type: 'text', placeholder: 'H (Hospital)' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }

    case 'G2':
      return {
        sections: [
          {
            title: 'Advance Direction (Max 2)',
            fields: [
              {
                name: 'directions',
                label: 'Directions',
                type: 'array',
                fields: [
                  {
                    name: 'destinations',
                    label: 'Destinations',
                    type: 'array',
                    fields: [
                      { name: 'text', label: 'Text', type: 'text', required: true },
                      { name: 'primary', label: 'Primary', type: 'checkbox' }
                    ]
                  },
                  {
                    name: 'shields',
                    label: 'Route Shields',
                    type: 'array',
                    fields: [
                      { 
                        name: 'network', 
                        label: 'Network', 
                        type: 'select',
                        options: [
                          { value: 'M', label: 'M (Motorway)' },
                          { value: 'A', label: 'A (Highway)' },
                          { value: 'B', label: 'B (State Route)' }
                        ]
                      },
                      { name: 'code', label: 'Route Number', type: 'text' }
                    ]
                  },
                  {
                    name: 'arrow',
                    label: 'Arrow',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'V', label: 'Ahead' },
                      { value: 'AL', label: 'Angle Left' },
                      { value: 'AR', label: 'Angle Right' }
                    ]
                  },
                  { name: 'distanceKm', label: 'Distance (km)', type: 'number', min: 0 }
                ]
              }
            ]
          }
        ]
      }

    case 'G3':
      return {
        sections: [
          {
            title: 'Minor Road Direction',
            fields: [
              {
                name: 'directions',
                label: 'Directions',
                type: 'array',
                fields: [
                  {
                    name: 'destinations',
                    label: 'Destinations',
                    type: 'array',
                    fields: [
                      { name: 'text', label: 'Destination', type: 'text', required: true }
                    ]
                  },
                  {
                    name: 'arrow',
                    label: 'Arrow',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'V', label: 'Ahead' },
                      { value: 'CL', label: 'Left' },
                      { value: 'CR', label: 'Right' }
                    ]
                  },
                  { name: 'distanceKm', label: 'Distance (km)', type: 'number' }
                ]
              }
            ]
          }
        ]
      }

    case 'TypeD':
      return {
        sections: [
          {
            title: 'Single Direction Panel',
            fields: [
              { name: 'destination', label: 'Destination', type: 'text', required: true },
              {
                name: 'arrow',
                label: 'Arrow',
                type: 'select',
                required: true,
                options: [
                  { value: 'V', label: 'Ahead' },
                  { value: 'CL', label: 'Left' },
                  { value: 'CR', label: 'Right' }
                ]
              }
            ]
          }
        ]
      }

    case 'Type3':
    case 'Diagram':
      return {
        sections: [
          {
            title: 'Diagrammatic Layout',
            fields: [
              {
                name: 'mode',
                label: 'Design Mode',
                type: 'select',
                options: [
                  { value: 'template', label: 'Start from Template' },
                  { value: 'draw', label: 'Draw from Scratch' }
                ]
              }
            ]
          }
        ]
      }

    default:
      return { sections: [] }
  }
}

