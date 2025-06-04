import { create } from "zustand";
import type { LatestSensorData, HistorySensorData } from "@/types/sensor";

type SensorState = {
  currentData: LatestSensorData | null;
  historyData: HistorySensorData;
  isLive: boolean;
  setCurrentData: (data: LatestSensorData) => void;
  setHistoryData: (data: HistorySensorData) => void;
  setIsLive: (live: boolean) => void;
  pushToHistory: (data: LatestSensorData) => void;
};

export const useSensorStore = create<SensorState>((set) => ({
  currentData: null,
  historyData: [],
  isLive: false,
  setCurrentData: (data) => set({ currentData: data }),
  setHistoryData: (data: HistorySensorData) => set({ historyData: data }),
  setIsLive: (live) => set({ isLive: live }),

  pushToHistory: (data) =>
    set((state) => {
      const exists = state.historyData.find((d) => d.createdAt === data.createdAt);
      const newEntry = {
        createdAt: data.createdAt,
        temperature: data.temperature,
        humidity: data.humidity,
        moisture: data.moisture,
        ph: data.ph,
      };

      const updatedHistory = exists
        ? state.historyData.map((d) => (d.createdAt === data.createdAt ? newEntry : d))
        : [...state.historyData, newEntry];

      return { historyData: updatedHistory };
    }),
}));
