"use client";

import { useEffect, useMemo, useState } from "react";

import SpeedTestEngine, { Results } from "@cloudflare/speedtest";
import { sendPostMessage } from "@/lib/send-post-message";
import { FormattedStat, SpeedTestResults } from "@/types";

const updateFinalResults = (res: Results): SpeedTestResults => {
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
  const [results, setResults] = useState<SpeedTestResults | null>(null);
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

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) {
          // Initial phase (latency tests) - faster progress
          return prev + 5;
        } else if (prev < 60) {
          // Mid phase (small download/upload tests) - medium progress
          return prev + 3;
        } else if (prev < 90) {
          // Final phase (large download/upload tests) - slower progress
          return prev + 1;
        }
        // Cap at 95% until the test is complete
        return Math.min(prev + 0.5, 95);
      });
    }, 200);

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
      measurements: [
        // unloaded latency + jitter
        { type: "latency", numPackets: 5 },

        // Small download/upload for low-speed environments
        { type: "download", bytes: 1e5, count: 1 },
        { type: "upload", bytes: 1e5, count: 1 },

        // Mid-size warmup
        { type: "download", bytes: 1e6, count: 1 },
        { type: "upload", bytes: 1e6, count: 1 },

        // Large-size bandwidth
        { type: "download", bytes: 5e7, count: 1 },
        { type: "upload", bytes: 5e7, count: 1 },

        // Optional but still quick packet loss
        { type: "packetLoss", numPackets: 100, responsesWaitTime: 500 },
      ],

      bandwidthMinRequestDuration: 100,
      loadedLatencyThrottle: 300,
      measureDownloadLoadedLatency: true,
      measureUploadLoadedLatency: true,
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

    st.onFinish = (res: Results) => {
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

  const formattedBandwidth: FormattedStat[] = useMemo(() => {
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

  const formattedLatency: FormattedStat[] = useMemo(() => {
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

  const formattedJitter: FormattedStat[] = useMemo(() => {
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
