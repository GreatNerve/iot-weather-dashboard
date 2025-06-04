"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Thermometer, Droplets, Sprout, FlaskConical } from "lucide-react";
import { useSensorStore } from "@/store/useSensorStore";

const sensorConfigs = {
  temperature: { icon: Thermometer, unit: "°C" },
  humidity: { icon: Droplets, unit: "%" },
  moisture: { icon: Sprout, unit: "%" },
  ph: { icon: FlaskConical, unit: "pH" },
};

export function SensorCharts() {
  const { historyData, setHistoryData } = useSensorStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState("1h");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `/api/sensor-data/history?range=${selectedTimeRange}`
        );
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistoryData(data);
      } catch (err) {
        console.error("History fetch error:", err);
      }
    };

    fetchHistory();
  }, [selectedTimeRange, setHistoryData]);

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-md rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
            Historical Data
          </CardTitle>
          <Tabs
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
            className="w-full sm:w-auto"
          >
            <TabsList className="flex gap-1 overflow-x-auto rounded-md bg-gray-100 p-1 scroll-smooth sm:gap-2 sm:overflow-visible">
              {["1h", "6h", "24h", "7d"].map((range) => (
                <TabsTrigger
                  key={range}
                  value={range}
                  className="text-xs sm:text-sm px-3 py-1 whitespace-nowrap"
                >
                  <span className="sm:hidden">{range}</span>
                  <span className="hidden sm:inline">
                    {range === "1h"
                      ? "1 Hour"
                      : range === "6h"
                      ? "6 Hours"
                      : range === "24h"
                      ? "24 Hours"
                      : "7 Days"}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="temperature" className="w-full">
          <TabsList className="grid grid-cols-4 bg-gray-100 rounded-md mb-4 p-1">
            {Object.entries(sensorConfigs).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="flex flex-col items-center justify-center px-2 py-1 text-xs sm:flex-row sm:gap-1 sm:justify-start"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline capitalize">{key}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(sensorConfigs).map(([key, config]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    key={key} 
                    data={historyData ?? []}
                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="createdAt"
                      stroke="#6b7280"
                      fontSize={10}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      }
                    />
                    <YAxis
                      stroke="#6b7280"
                      fontSize={10}
                      domain={["dataMin - 1", "dataMax + 1"]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        boxShadow:
                          "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
                      }}
                      formatter={(value) => [
                        `${
                          typeof value === "number" ? value.toFixed(1) : value
                        } ${config.unit}`,
                        key.charAt(0).toUpperCase() + key.slice(1),
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey={key}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      isAnimationActive={false}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                      activeDot={{ r: 5, stroke: "#3b82f6", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
