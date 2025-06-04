import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { temperature, humidity, moisture, ph } = body

  if (
    typeof temperature !== 'number' ||
    typeof humidity !== 'number' ||
    typeof moisture !== 'number' ||
    typeof ph !== 'number'
  ) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  await prisma.sensorData.create({
    data: {
      temperature,
      humidity,
      moisture,
      ph,
    },
  })

  return NextResponse.json({ success: true })
}