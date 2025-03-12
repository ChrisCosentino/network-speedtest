/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useState } from "react";

import SpeedTestEngine from "@cloudflare/speedtest";
import { sendPostMessage } from "@/lib/send-post-message";

// interface SpeedTestResults {
//   download?: number;
//   upload?: number;
//   downloadedJitter?: number;
//   uploadedJitter?: number;
//   downloadedLatency?: number;
//   uploadedLatency?: number;
//   packetLoss?: number;
//   packetLossDetails?: any;
//   unloadedLatency?: number;
//   unloadedJitter?: number;
//   unloadedLatencyPoints?: any[];
//   downloadedLatencyPoints?: any[];
//   uploadedLatencyPoints?: any[];
//   downloadBandwidth?: number;
//   downloadBandwidthPoints?: any[];
//   uploadBandwidth?: number;
//   uploadBandwidthPoints?: any[];
//   scores?: any;
// }

const updateFinalResults = (res: any) => {
  return {
    download: res.getDownloadBandwidth(),
    upload: res.getUploadBandwidth(),
    unloadedLatency: res.getUnloadedLatency(),
    unloadedJitter: res.getUnloadedJitter(),
    unloadedLatencyPoints: res.getUnloadedLatencyPoints(),
    downloadedLatency: res.getDownLoadedLatency(),
    downloadedJitter: res.getDownLoadedJitter(),
    downloadedLatencyPoints: res?.getDownLoadedLatencyPoints(),
    uploadedLatency: res.getUpLoadedLatency(),
    uploadedJitter: res.getUpLoadedJitter(),
    uploadedLatencyPoints: res.getUpLoadedLatencyPoints(),
    downloadBandwidth: res.getDownloadBandwidth(),
    downloadBandwidthPoints: res.getDownloadBandwidthPoints(),
    uploadBandwidth: res.getUploadBandwidth(),
    uploadBandwidthPoints: res.getUploadBandwidthPoints(),
    packetLoss: res.getPacketLoss(),
    packetLossDetails: res.getPacketLossDetails(),
    scores: res.getScores(),
  };
};

export function useSpeedTest() {
  const [speedTest, setSpeedTest] = useState<SpeedTestEngine | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [results, setResults] = useState<any>(null);
  const [progress, setProgress] = useState<number>(0);
  const [progressInterval, setProgressInterval] =
    useState<NodeJS.Timeout | null>(null);

  const startProgressTimer = () => {
    // Clear any existing interval first
    if (progressInterval) {
      clearInterval(progressInterval);
    }

    // Reset progress
    setProgress(0);

    // Create new interval that increments progress by 1 every second
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Cap at 99% until the test is complete
        return prev < 95 ? prev + 3 : prev;
      });
    }, 1000);

    setProgressInterval(interval);
  };

  const stopProgressTimer = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
      setProgressInterval(null);
    }
  };

  useEffect(() => {
    const st = new SpeedTestEngine({
      autoStart: false,
      // measurements: [
      // 	{ type: 'latency', numPackets: 20 },
      // 	{ type: 'download', bytes: 1e5, count: 5 },
      // 	{ type: 'upload', bytes: 1e5, count: 5 },
      // 	{ type: 'download', bytes: 1e6, count: 20 },
      // 	{ type: 'upload', bytes: 1e6, count: 20 },
      // 	{ type: 'packetLoss', numPackets: 1e3, responsesWaitTime: 3000 },
      // ],
      //
    });

    setSpeedTest(st);

    st.onRunningChange = (running) => {
      setIsRunning(running);

      if (running) {
        startProgressTimer();
      } else {
        stopProgressTimer();
      }
    };

    // st.onResultsChange = () => {
    // 	setResults(updateResults(st.results));
    // };

    st.onFinish = (res: any) => {
      const result = updateFinalResults(res);

      setResults(result);

      setProgress(100);
      stopProgressTimer();

      sendPostMessage(result);
    };

    st.onError = (error) => {
      console.error("Speed test error:", error);
      stopProgressTimer();
    };

    return () => {
      if (st && st.isRunning) {
        st.pause();
      }
      stopProgressTimer();
    };
  }, []);

  const handleStartTest = () => {
    if (speedTest) {
      setProgress(0);
      speedTest.play();
    }
  };

  const handleRerunTest = () => {
    if (speedTest) {
      // Reset all states
      setProgress(0);
      setIsRunning(true);
      setResults(null);

      // If test is currently running, stop it first
      if (isRunning) {
        speedTest.pause();
      }

      stopProgressTimer();
      startProgressTimer();

      speedTest.restart();
    }
  };

  const formattedBandwidth = useMemo(() => {
    if (!results)
      return [
        { value: 0, color: "gray", mbps: "0" },
        { value: 0, color: "gray", mbps: "0" },
      ];

    const downloadBytes = results?.download || 0;
    const uploadBytes = results?.upload || 0;

    const downloadMbps = downloadBytes / 1_000_000;
    const uploadMbps = uploadBytes / 1_000_000;

    const maxExpectedMbps = 100;
    const normalizedDownload = Math.min(
      Math.round((downloadMbps / maxExpectedMbps) * 100),
      100
    );
    const normalizedUpload = Math.min(
      Math.round((uploadMbps / maxExpectedMbps) * 100),
      100
    );

    const getSpeedColor = (value: number) => {
      if (value < 30) return "red";
      if (value < 70) return "yellow";
      return "green";
    };

    return [
      {
        value: normalizedDownload,
        color: getSpeedColor(normalizedDownload),
        mbps: Math.round(downloadMbps),
        key: "download",
        title: "Download",
      },
      {
        value: normalizedUpload,
        color: getSpeedColor(normalizedUpload),
        mbps: Math.round(uploadMbps),
        key: "upload",
        title: "Upload",
      },
    ];
  }, [results]);

  const formattedLatency = useMemo(() => {
    if (!results)
      return [
        { value: 0, color: "gray", mbps: "0" },
        { value: 0, color: "gray", mbps: "0" },
      ];

    const downloadLatency = results?.downloadedLatency || 0;
    const uploadLatency = results?.uploadedLatency || 0;

    const getLatencyColor = (value: number) => {
      if (value > 100) return "red";
      if (value > 50) return "yellow";
      return "green";
    };

    const maxExpectedLatency = 200;
    const normalizedDownload = Math.min(
      Math.round((downloadLatency / maxExpectedLatency) * 100),
      100
    );

    const normalizedUpload = Math.min(
      Math.round((uploadLatency / maxExpectedLatency) * 100),
      100
    );

    return [
      {
        value: normalizedDownload,
        color: getLatencyColor(downloadLatency),
        ms: Math.round(downloadLatency),
        key: "downloadLatency",
        title: "Download",
      },
      {
        value: normalizedUpload,
        color: getLatencyColor(uploadLatency),
        ms: Math.round(uploadLatency),
        key: "uploadLatency",
        title: "Upload",
      },
    ];
  }, [results]);

  const formattedJitter = useMemo(() => {
    if (!results)
      return [
        { value: 0, color: "gray", ms: "0" },
        { value: 0, color: "gray", ms: "0" },
      ];

    const downloadJitter = results?.downloadedJitter || 0;
    const uploadJitter = results?.uploadedJitter || 0;

    // For jitter, lower is better, similar to latency
    // Assuming good jitter is under 20ms, and poor is over 50ms
    const getJitterColor = (value: number) => {
      if (value > 50) return "red";
      if (value > 20) return "yellow";
      return "green";
    };

    // For jitter, we normalize against 100ms as the max expected value
    const maxExpectedJitter = 100;
    const normalizedDownload = Math.min(
      Math.round((downloadJitter / maxExpectedJitter) * 100),
      100
    );
    const normalizedUpload = Math.min(
      Math.round((uploadJitter / maxExpectedJitter) * 100),
      100
    );

    return [
      {
        value: normalizedDownload,
        color: getJitterColor(downloadJitter),
        ms: Math.round(downloadJitter),
        key: "downloadJitter",
        title: "Download",
      },
      {
        value: normalizedUpload,
        color: getJitterColor(uploadJitter),
        ms: Math.round(uploadJitter),
        key: "uploadJitter",
        title: "Upload",
      },
    ];
  }, [results]);

  return {
    speedTest,
    isRunning,
    results,
    handleStartTest,
    handleRerunTest,
    progress,
    formattedBandwidth,
    formattedLatency,
    formattedJitter,
  };
}
