import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      passwordHash: hashedPassword,
      role: 'user',
      preferences: {
        theme: 'light',
        language: 'zh-CN',
        defaultParams: {
          fontPrimary: 240,
          lineGap: 0.75,
          margins: 1.0
        }
      }
    }
  })

  console.log('✅ Created user:', user.email)

  // ==================== Color Schemes ====================
  const colorScheme = await prisma.colorScheme.upsert({
    where: { name: 'AS1742.3 Standard' },
    update: {},
    create: {
      name: 'AS1742.3 Standard',
      description: '澳大利亚标准道路标志配色方案',
      colors: {
        green: '#006747',      // 澳洲标准绿
        white: '#FFFFFF',      // 白色
        yellow: '#FFC72C',     // 黄色（警告）
        blue: '#0066B3',       // 蓝色（服务设施）
        brown: '#6B4423',      // 棕色（旅游景点）
        black: '#000000',      // 黑色（文字）
        red: '#C8102E'         // 红色（禁止）
      },
      usageRules: {
        green: 'Direction signs, guide signs',
        blue: 'Service facility signs',
        brown: 'Tourist and cultural signs',
        yellow: 'Warning signs'
      },
      isDefault: true
    }
  })

  console.log('✅ Created color scheme:', colorScheme.name)

  // ==================== Typography Templates ====================
  const typography = await prisma.typographyTemplate.upsert({
    where: { name: 'AS1744 Standard' },
    update: {},
    create: {
      name: 'AS1744 Standard',
      description: '澳大利亚标准道路标志字体规范',
      fontFamily: 'Transport',
      fontFiles: {
        regular: '/fonts/transport-regular.woff2',
        medium: '/fonts/transport-medium.woff2',
        bold: '/fonts/transport-bold.woff2'
      },
      sizeRules: {
        h1: 260,        // 主要目的地 (mm)
        h2: 200,        // 次要目的地
        body: 180,      // 道路名称
        small: 150,     // 距离、VIA等
        caption: 120    // 说明文字
      },
      weights: {
        normal: 400,
        medium: 500,
        bold: 700
      },
      letterSpacing: {
        normal: 0,
        wide: 0.02,
        wider: 0.05
      },
      lineHeight: {
        tight: 1.1,
        normal: 1.2,
        loose: 1.4
      },
      isDefault: true
    }
  })

  console.log('✅ Created typography:', typography.name)

  // ==================== Sign Templates ====================
  
  // G1-1 (Two-Panel Direction Sign)
  const g11Template = await prisma.signTemplate.create({
    data: {
      code: 'G1-1',
      name: 'Direction Sign (Two-Panel)',
      description: '双面板方向指示标志，用于路口前方指引',
      panelCount: 2,
      layoutType: 'STANDARD',
      defaultWidth: 3800,
      defaultHeight: 1400,
      minWidth: 2400,
      maxWidth: 6000,
      specifications: {
        borderRadius: 30,
        borderWidth: 20,
        panelSpacing: 0,
        padding: { top: 100, right: 120, bottom: 100, left: 120 },
        minPanelHeight: 600
      },
      category: 'DIRECTION',
      family: 'G1',
      isActive: true,
      sortOrder: 1
    }
  })

  // G1-1 Panels
  await prisma.panelTemplate.createMany({
    data: [
      {
        signTemplateId: g11Template.id,
        position: 0,
        name: 'Top Panel',
        type: 'PRIMARY',
        layout: {
          zones: ['route-left', 'destination-center', 'arrow-right'],
          flexGrow: [0.3, 1, 0.3],
          alignment: 'center'
        },
        allowedElements: ['ROUTE', 'DESTINATION', 'ARROW', 'ROAD_NAME'],
        backgroundColor: '#006747',
        borderColor: '#FFFFFF',
        minHeight: 600
      },
      {
        signTemplateId: g11Template.id,
        position: 1,
        name: 'Bottom Panel',
        type: 'PRIMARY',
        layout: {
          zones: ['route-left', 'destination-center', 'arrow-right'],
          flexGrow: [0.3, 1, 0.3],
          alignment: 'center'
        },
        allowedElements: ['ROUTE', 'DESTINATION', 'ARROW', 'ROAD_NAME'],
        backgroundColor: '#006747',
        borderColor: '#FFFFFF',
        minHeight: 600
      }
    ]
  })

  console.log('✅ Created template:', g11Template.code)

  // G1-2 (Three-Panel Direction Sign)
  const g12Template = await prisma.signTemplate.create({
    data: {
      code: 'G1-2',
      name: 'Direction Sign (Three-Panel)',
      description: '三面板方向指示标志，用于复杂路口',
      panelCount: 3,
      layoutType: 'STANDARD',
      defaultWidth: 3800,
      defaultHeight: 2000,
      minWidth: 2400,
      maxWidth: 6000,
      specifications: {
        borderRadius: 30,
        borderWidth: 20,
        panelSpacing: 0,
        padding: { top: 100, right: 120, bottom: 100, left: 120 },
        minPanelHeight: 550
      },
      category: 'DIRECTION',
      family: 'G1',
      isActive: true,
      sortOrder: 2
    }
  })

  // G1-2 Panels
  await prisma.panelTemplate.createMany({
    data: [
      {
        signTemplateId: g12Template.id,
        position: 0,
        name: 'Top Panel',
        type: 'PRIMARY',
        layout: {
          zones: ['route-left', 'destination-center', 'arrow-right'],
          flexGrow: [0.3, 1, 0.3],
          alignment: 'center'
        },
        allowedElements: ['ROUTE', 'DESTINATION', 'ARROW', 'ROAD_NAME'],
        backgroundColor: '#006747',
        borderColor: '#FFFFFF',
        minHeight: 550
      },
      {
        signTemplateId: g12Template.id,
        position: 1,
        name: 'Middle Panel',
        type: 'PRIMARY',
        layout: {
          zones: ['route-left', 'destination-center', 'arrow-right'],
          flexGrow: [0.3, 1, 0.3],
          alignment: 'center'
        },
        allowedElements: ['ROUTE', 'DESTINATION', 'ARROW', 'ROAD_NAME'],
        backgroundColor: '#006747',
        borderColor: '#FFFFFF',
        minHeight: 550
      },
      {
        signTemplateId: g12Template.id,
        position: 2,
        name: 'Bottom Panel',
        type: 'PRIMARY',
        layout: {
          zones: ['route-left', 'destination-center', 'arrow-right'],
          flexGrow: [0.3, 1, 0.3],
          alignment: 'center'
        },
        allowedElements: ['ROUTE', 'DESTINATION', 'ARROW', 'ROAD_NAME'],
        backgroundColor: '#006747',
        borderColor: '#FFFFFF',
        minHeight: 550
      }
    ]
  })

  console.log('✅ Created template:', g12Template.code)

  // G1-1 Focal Point (用于显示前往远程目的地的方向)
  const g11FocalTemplate = await prisma.signTemplate.create({
    data: {
      code: 'G1-1-FOCAL',
      name: 'Direction Sign (Focal Point)',
      description: '双面板方向标志，顶部面板用于远距离目的地',
      panelCount: 2,
      layoutType: 'FOCAL_POINT',
      defaultWidth: 3800,
      defaultHeight: 1600,
      minWidth: 2400,
      maxWidth: 6000,
      specifications: {
        borderRadius: 30,
        borderWidth: 20,
        panelSpacing: 0,
        padding: { top: 100, right: 120, bottom: 100, left: 120 },
        minPanelHeight: 500,
        focalPanelHeight: 700
      },
      category: 'DIRECTION',
      family: 'G1',
      isActive: true,
      sortOrder: 3
    }
  })

  await prisma.panelTemplate.createMany({
    data: [
      {
        signTemplateId: g11FocalTemplate.id,
        position: 0,
        name: 'Focal Panel',
        type: 'PRIMARY',
        layout: {
          zones: ['route-left', 'destination-center', 'arrow-right'],
          flexGrow: [0.3, 1, 0.3],
          alignment: 'center',
          fontSize: 'large'
        },
        allowedElements: ['ROUTE', 'DESTINATION', 'ARROW'],
        backgroundColor: '#006747',
        borderColor: '#FFFFFF',
        minHeight: 700
      },
      {
        signTemplateId: g11FocalTemplate.id,
        position: 1,
        name: 'Direction Panel',
        type: 'SECONDARY',
        layout: {
          zones: ['label-left', 'route-center', 'destination-center', 'arrow-right'],
          flexGrow: [0.2, 0.3, 1, 0.3],
          alignment: 'center'
        },
        allowedElements: ['ROUTE', 'DESTINATION', 'ARROW', 'ROAD_NAME'],
        backgroundColor: '#006747',
        borderColor: '#FFFFFF',
        minHeight: 500
      }
    ]
  })

  console.log('✅ Created template:', g11FocalTemplate.code)

  // ==================== Element Templates ====================
  
  // Arrows
  const arrowElements = [
    {
      name: 'Arrow Up',
      type: 'ARROW',
      category: 'DIRECTIONAL',
      svgPath: 'M 50 10 L 90 50 L 70 50 L 70 90 L 30 90 L 30 50 L 10 50 Z',
      defaultWidth: 180,
      defaultHeight: 180,
      aspectRatio: 1.0,
      tags: ['arrow', 'up', 'straight']
    },
    {
      name: 'Arrow Right',
      type: 'ARROW',
      category: 'DIRECTIONAL',
      svgPath: 'M 10 50 L 50 10 L 50 30 L 90 30 L 90 70 L 50 70 L 50 90 Z',
      defaultWidth: 220,
      defaultHeight: 180,
      aspectRatio: 1.22,
      tags: ['arrow', 'right', 'turn']
    },
    {
      name: 'Arrow Left',
      type: 'ARROW',
      category: 'DIRECTIONAL',
      svgPath: 'M 90 50 L 50 10 L 50 30 L 10 30 L 10 70 L 50 70 L 50 90 Z',
      defaultWidth: 220,
      defaultHeight: 180,
      aspectRatio: 1.22,
      tags: ['arrow', 'left', 'turn']
    },
    {
      name: 'Arrow Up Right',
      type: 'ARROW',
      category: 'DIRECTIONAL',
      svgPath: 'M 30 90 L 30 40 L 50 40 L 50 20 L 90 50 L 50 80 L 50 60 L 50 60 L 10 60 L 10 90 Z',
      defaultWidth: 200,
      defaultHeight: 200,
      aspectRatio: 1.0,
      tags: ['arrow', 'up-right', 'diagonal']
    }
  ]

  for (const arrow of arrowElements) {
    await prisma.elementTemplate.create({
      data: {
        ...arrow,
        userId: null,
        defaultColors: {
          fill: '#FFFFFF',
          stroke: '#000000',
          strokeWidth: 2
        },
        parameters: {
          scale: { min: 0.5, max: 2.0, default: 1.0 },
          rotation: { min: 0, max: 360, default: 0 }
        },
        isPublic: true,
        isDefault: true
      }
    })
  }

  console.log('✅ Created arrow elements')

  // Route Shields
  const shieldElements = [
    {
      name: 'National Highway Shield',
      type: 'ROUTE_SHIELD',
      category: 'NATIONAL',
      svgData: {
        type: 'shield',
        shape: 'rounded-rect',
        width: 200,
        height: 240,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 8,
        textFormat: '{code}',
        textSize: 180,
        textColor: '#000000',
        labelText: 'NATIONAL HIGHWAY',
        labelSize: 40,
        labelColor: '#000000'
      },
      defaultWidth: 200,
      defaultHeight: 240,
      aspectRatio: 0.83,
      tags: ['shield', 'national', 'highway']
    },
    {
      name: 'State Route Shield (Alpha)',
      type: 'ROUTE_SHIELD',
      category: 'STATE',
      svgData: {
        type: 'shield',
        shape: 'rounded-rect',
        width: 180,
        height: 200,
        borderRadius: 15,
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 6,
        textFormat: '{code}',
        textSize: 140,
        textColor: '#000000'
      },
      defaultWidth: 180,
      defaultHeight: 200,
      aspectRatio: 0.9,
      tags: ['shield', 'state', 'alpha']
    },
    {
      name: 'State Route Shield (Metro)',
      type: 'ROUTE_SHIELD',
      category: 'METRO',
      svgData: {
        type: 'shield',
        shape: 'rounded-rect',
        width: 180,
        height: 200,
        borderRadius: 15,
        backgroundColor: '#FFC72C',
        borderColor: '#000000',
        borderWidth: 6,
        textFormat: '{code}',
        textSize: 140,
        textColor: '#000000'
      },
      defaultWidth: 180,
      defaultHeight: 200,
      aspectRatio: 0.9,
      tags: ['shield', 'metro', 'yellow']
    },
    {
      name: 'Tourist Route Shield',
      type: 'ROUTE_SHIELD',
      category: 'TOURIST',
      svgData: {
        type: 'shield',
        shape: 'rounded-rect',
        width: 160,
        height: 180,
        borderRadius: 15,
        backgroundColor: '#6B4423',
        borderColor: '#FFFFFF',
        borderWidth: 6,
        textFormat: '{code}',
        textSize: 120,
        textColor: '#FFFFFF'
      },
      defaultWidth: 160,
      defaultHeight: 180,
      aspectRatio: 0.89,
      tags: ['shield', 'tourist', 'brown']
    }
  ]

  for (const shield of shieldElements) {
    await prisma.elementTemplate.create({
      data: {
        ...shield,
        userId: null,
        defaultColors: shield.svgData?.backgroundColor ? {
          background: shield.svgData.backgroundColor,
          border: shield.svgData.borderColor,
          text: shield.svgData.textColor
        } : undefined,
        parameters: {
          code: { type: 'text', placeholder: 'M1', maxLength: 4 },
          scale: { min: 0.5, max: 2.0, default: 1.0 }
        },
        isPublic: true,
        isDefault: true
      }
    })
  }

  console.log('✅ Created route shield elements')

  // Service Signs
  const serviceElements = [
    {
      name: 'Petrol Station',
      type: 'SERVICE_SIGN',
      category: 'FUEL',
      svgPath: 'M 30 20 L 50 10 L 70 20 L 70 50 L 60 50 L 60 80 L 40 80 L 40 50 L 30 50 Z',
      defaultWidth: 120,
      defaultHeight: 120,
      aspectRatio: 1.0,
      tags: ['service', 'petrol', 'fuel']
    },
    {
      name: 'Restaurant',
      type: 'SERVICE_SIGN',
      category: 'FOOD',
      svgPath: 'M 30 10 L 40 10 L 40 30 L 50 30 L 50 10 L 60 10 L 60 40 L 50 50 L 50 90 L 40 90 L 40 50 L 30 40 Z',
      defaultWidth: 120,
      defaultHeight: 120,
      aspectRatio: 1.0,
      tags: ['service', 'restaurant', 'food']
    },
    {
      name: 'Accommodation',
      type: 'SERVICE_SIGN',
      category: 'LODGING',
      svgPath: 'M 20 50 L 50 20 L 80 50 L 80 90 L 20 90 Z M 35 60 L 35 80 L 50 80 L 50 60 Z',
      defaultWidth: 120,
      defaultHeight: 120,
      aspectRatio: 1.0,
      tags: ['service', 'accommodation', 'hotel']
    }
  ]

  for (const service of serviceElements) {
    await prisma.elementTemplate.create({
      data: {
        ...service,
        userId: null,
        defaultColors: {
          fill: '#FFFFFF',
          background: '#0066B3'
        },
        parameters: {
          scale: { min: 0.5, max: 1.5, default: 1.0 }
        },
        isPublic: true,
        isDefault: true
      }
    })
  }

  console.log('✅ Created service sign elements')

  // ==================== Template Collection ====================
  const collection = await prisma.templateCollection.create({
    data: {
      userId: null,
      name: 'AS1742.6 Standard Direction Signs',
      description: '澳大利亚标准方向指示标志完整集合',
      signTemplates: [g11Template.id, g12Template.id, g11FocalTemplate.id],
      elements: [], // Would be populated with element IDs
      isPublic: true,
      isDefault: true
    }
  })

  console.log('✅ Created template collection:', collection.name)

  // ==================== Sample Sign ====================
  const sign = await prisma.sign.create({
    data: {
      userId: user.id,
      name: 'Sample Direction Sign - Melbourne',
      family: 'G1',
      signTemplateId: g12Template.id,
      layout: 'LANDSCAPE',
      data: {
        templateCode: 'G1-2',
        panels: [
          {
            position: 0,
            elements: [
              { type: 'ROUTE', code: 'A30', network: 'NATIONAL' },
              { type: 'DESTINATION', text: 'Sydney' },
              { type: 'ARROW', direction: 'UP' }
            ]
          },
          {
            position: 1,
            elements: [
              { type: 'ROAD_NAME', text: 'SALTASH HWY' },
              { type: 'DESTINATION', text: 'Plumpton' },
              { type: 'ROUTE', code: 'A85', network: 'STATE' },
              { type: 'ARROW', direction: 'RIGHT' },
              { type: 'DESTINATION', text: 'Hawker' }
            ]
          },
          {
            position: 2,
            elements: [
              { type: 'ROUTE', code: 'A15', network: 'STATE' },
              { type: 'DESTINATION', text: 'Holley' },
              { type: 'ARROW', direction: 'LEFT' },
              { type: 'DESTINATION', text: 'Sunnyside' }
            ]
          }
        ],
        board: {
          width: 3800,
          height: 2000
        }
      },
      tags: ['sample', 'G1-2', 'direction'],
      isFavorite: true
    }
  })

  console.log('✅ Created sample sign:', sign.name)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
