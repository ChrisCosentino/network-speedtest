/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SpeedTestResults {
  download: number | undefined;
  upload: number | undefined;
  downloadedJitter: number | undefined;
  uploadedJitter: number | undefined;
  downloadedLatency: number | undefined;
  uploadedLatency: number | undefined;
  packetLoss: number | undefined;
  packetLossDetails:
    | {
        totalMessages: number;
        numMessagesSent: number;
        packetLoss: number;
        lostMessages: number[];
      }
    | { error: string }
    | undefined;
  unloadedLatency: number | undefined;
  unloadedJitter: number | undefined;
  unloadedLatencyPoints: any[] | undefined;
  downloadedLatencyPoints: any[] | undefined;
  uploadedLatencyPoints: any[] | undefined;
  downloadBandwidth: number | undefined;
  downloadBandwidthPoints: any[] | undefined;
  uploadBandwidth: number | undefined;
  uploadBandwidthPoints: any[] | undefined;
  scores: any | undefined;
}

export interface FormattedStat {
  value: number;
  color: string;
  mbps?: string | number;
  ms?: string | number;
  key?: string;
  title?: string;
}
