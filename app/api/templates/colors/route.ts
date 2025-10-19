import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const colorSchemes = await prisma.colorScheme.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' }
      ]
    })
    
    return NextResponse.json(colorSchemes)
  } catch (error) {
    console.error('Error fetching color schemes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch color schemes' },
      { status: 500 }
    )
  }
}

