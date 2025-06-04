"use client";

import { SensorCharts } from "@/components/SensorCharts";
import { SensorGauges } from "@/components/SensorGauges";
import { useSensorStore } from "@/store/useSensorStore";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const {
    currentData,
    isLive,
    setCurrentData,
    setIsLive,

    pushToHistory,
  } = useSensorStore();

  const [lastUpdateTime, setLastUpdateTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchData = async () => {
      if (document.visibilityState !== "visible") return;

      try {
        const latestRes = await fetch("/api/sensor-data/latest");
        if (!latestRes.ok) throw new Error("Failed to fetch latest");
        const latest = await latestRes.json();

        if (!lastUpdateTime || latest.createdAt !== lastUpdateTime) {
          setCurrentData(latest);
          setLastUpdateTime(latest.createdAt);
          pushToHistory(latest);
          setIsLive(true);
        } else {
          setIsLive(false);
        }
      } catch {
        setIsLive(false);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchData();
        interval = setInterval(fetchData, 3000);
      } else {
        clearInterval(interval);
      }
    };

    if (document.visibilityState === "visible") {
      fetchData();
      interval = setInterval(fetchData, 3000);
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lastUpdateTime, setCurrentData, setIsLive, pushToHistory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Sensor Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time environmental monitoring
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Activity
              className={`w-5 h-5 ${
                isLive ? "text-green-500" : "text-red-500"
              }`}
            />
            <span
              className={`font-medium ${
                isLive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isLive ? "Live" : "Offline"}
            </span>
            <div
              className={`w-2 h-2 rounded-full ${
                isLive ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            ></div>
          </div>
        </div>

        {currentData ? (
          <SensorGauges currentData={currentData} />
        ) : (
          <div className="text-center text-gray-500">
            Loading sensor data...
          </div>
        )}

        <SensorCharts />
      </div>
    </div>
  );
}
