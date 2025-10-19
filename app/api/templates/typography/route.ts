import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const typographyTemplates = await prisma.typographyTemplate.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' }
      ]
    })
    
    return NextResponse.json(typographyTemplates)
  } catch (error) {
    console.error('Error fetching typography templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch typography templates' },
      { status: 500 }
    )
  }
}

