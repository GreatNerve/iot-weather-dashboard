import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Thermometer, Droplets, Sprout, FlaskConical } from "lucide-react";
import { LatestSensorData } from "@/types/sensor";

const sensorConfigs = {
  temperature: {
    icon: Thermometer,
    unit: "°C",
    ranges: [
      { min: 0, max: 15, color: "#3b82f6", label: "Cold" },
      { min: 15, max: 20, color: "#eab308", label: "Cool" },
      { min: 20, max: 25, color: "#22c55e", label: "Optimal" },
      { min: 25, max: 30, color: "#f59e0b", label: "Warm" },
      { min: 30, max: 50, color: "#ef4444", label: "Hot" },
    ],
  },
  humidity: {
    icon: Droplets,
    unit: "%",
    ranges: [
      { min: 0, max: 30, color: "#ef4444", label: "Too Dry" },
      { min: 30, max: 40, color: "#f59e0b", label: "Dry" },
      { min: 40, max: 70, color: "#22c55e", label: "Optimal" },
      { min: 70, max: 80, color: "#f59e0b", label: "Humid" },
      { min: 80, max: 100, color: "#ef4444", label: "Too Humid" },
    ],
  },
  moisture: {
    icon: Sprout,
    unit: "%",
    ranges: [
      { min: 0, max: 20, color: "#ef4444", label: "Very Dry" },
      { min: 20, max: 35, color: "#f59e0b", label: "Dry" },
      { min: 35, max: 65, color: "#22c55e", label: "Good" },
      { min: 65, max: 80, color: "#f59e0b", label: "Moist" },
      { min: 80, max: 100, color: "#3b82f6", label: "Wet" },
    ],
  },
  ph: {
    icon: FlaskConical,
    unit: "pH",
    ranges: [
      { min: 0, max: 5.5, color: "#ef4444", label: "Too Acidic" },
      { min: 5.5, max: 6.2, color: "#f59e0b", label: "Acidic" },
      { min: 6.2, max: 7.2, color: "#22c55e", label: "Optimal" },
      { min: 7.2, max: 8, color: "#f59e0b", label: "Alkaline" },
      { min: 8, max: 14, color: "#ef4444", label: "Too Alkaline" },
    ],
  },
};

// Circular gauge component
const CircularGauge = ({
  value,
  config,
  title,
}: {
  value: number;
  config: {
    icon: React.ComponentType<{
      className?: string;
      style?: React.CSSProperties;
    }>;
    unit: string;
    ranges: { min: number; max: number; color: string; label: string }[];
  };
  title: string;
}) => {
  const radius = 80;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Find current range
  const currentRange =
    config.ranges.find((range) => value >= range.min && value < range.max) ||
    config.ranges[0];
  const maxValue = Math.max(...config.ranges.map((r) => r.max));
  const percentage = (value / maxValue) * 100;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="#e5e7eb"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={currentRange.color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <Icon
            className="w-6 h-6 mb-1"
            style={{ color: currentRange.color }}
          />
          <div
            className="text-2xl font-bold"
            style={{ color: currentRange.color }}
          >
            {value.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">{config.unit}</div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="font-semibold text-gray-700 capitalize">{title}</div>
        <div
          className="text-sm px-2 py-1 rounded-full mt-1 inline-block"
          style={{
            backgroundColor: currentRange.color + "20",
            color: currentRange.color,
          }}
        >
          {currentRange.label}
        </div>
      </div>
    </div>
  );
};

type SensorKey = keyof typeof sensorConfigs & keyof LatestSensorData;

export function SensorGauges({ currentData }: {
  currentData: LatestSensorData
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {(Object.keys(sensorConfigs) as SensorKey[]).map((key) => {
        const config = sensorConfigs[key];
        return (
          <Card
            key={key}
            className="shadow-lg border-0 bg-white/80 backdrop-blur-sm"
          >
            <CardContent className="flex items-center justify-center p-2 md:p-6">
              <CircularGauge
                value={currentData[key] ?? 0}
                config={config}
                title={key.replace(/([A-Z])/g, " $1").trim()}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
