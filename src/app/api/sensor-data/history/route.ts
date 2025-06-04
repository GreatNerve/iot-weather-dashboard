import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const range = req.nextUrl.searchParams.get("range") || "1h";

  const durationMap: Record<string, number> = {
    "1h": 1,
    "6h": 6,
    "24h": 24,
    "7d": 24 * 7,
  };

  const hours = durationMap[range] ?? 1;
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  try {
    const records = await prisma.sensorData.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
    });

    const historyData = records.map((r) => ({
      createdAt: r.createdAt.toISOString(),
      temperature: r.temperature,
      humidity: r.humidity,
      moisture: r.moisture,
      ph: r.ph,
    }));

    return NextResponse.json(historyData);
  } catch (err) {
    console.error("[GET /history]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
