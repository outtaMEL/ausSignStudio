import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const family = searchParams.get('family')
    
    const templates = await prisma.signTemplate.findMany({
      where: family ? { family, isActive: true } : { isActive: true },
      include: {
        panels: {
          orderBy: { position: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })
    
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching sign templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

