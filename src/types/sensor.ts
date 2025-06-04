export interface LatestSensorData {
  temperature: number;
  humidity: number;
  moisture: number;
  ph: number;
  createdAt: string; // ISO string format
}

export type HistorySensorData = {
  createdAt: string;
  temperature: number;
  humidity: number;
  moisture: number;
  ph: number;
}[];
