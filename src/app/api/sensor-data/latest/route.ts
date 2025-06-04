import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const latest = await prisma.sensorData.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latest) {
      return NextResponse.json({ error: "No data available" }, { status: 404 });
    }

    return NextResponse.json({
      temperature: latest.temperature,
      humidity: latest.humidity,
      moisture: latest.moisture,
      ph: latest.ph,
      createdAt: latest.createdAt.getTime(),
    });
  } catch (err) {
    console.error("[GET /latest]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
