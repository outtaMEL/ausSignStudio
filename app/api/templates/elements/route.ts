import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    
    const where: any = {
      isPublic: true
    }
    
    if (type) {
      where.type = type
    }
    
    if (category) {
      where.category = category
    }
    
    const elements = await prisma.elementTemplate.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' },
        { usageCount: 'desc' },
        { name: 'asc' }
      ]
    })
    
    return NextResponse.json(elements)
  } catch (error) {
    console.error('Error fetching element templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch elements' },
      { status: 500 }
    )
  }
}

