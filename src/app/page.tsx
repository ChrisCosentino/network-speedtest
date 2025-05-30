"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GaugeChart } from "@/components/ui/charts/gauge";
import { Progress } from "@/components/ui/charts/progress";
import { useSpeedTest } from "@/hooks/use-speed-test";
import { cn } from "@/lib/utils";
import { FormattedStat } from "@/types";

export default function Home() {
  const {
    isRunning,
    results,
    handleStartTest,
    handleRerunTest,
    progress,
    formattedBandwidth,
    formattedLatency,
    formattedJitter,
  } = useSpeedTest();

  if (isRunning) {
    return (
      <div className="px-4">
        <div className="rounded-lg bg-primary p-8 max-w-lg mx-auto mt-8 mx-8">
          <div className="flex flex-col space-y-2 text-gray-50">
            <h1 className="text-gray-50">Running Speed Test</h1>
            <span>
              <strong>{progress}%</strong> progress
            </span>
          </div>
          <div className="h-[12px] w-full pt-3">
            <Progress progress={progress} />
          </div>
        </div>
      </div>
    );
  }

  const alreadyRanTest = results && !isRunning;

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="my-8">
        <Button
          className="w-full"
          onClick={() => {
            return alreadyRanTest ? handleRerunTest() : handleStartTest();
          }}
        >
          {alreadyRanTest ? "Rerun Test" : "Start Speed Test"}
        </Button>
      </div>

      {results && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Download & Upload (Mbps)</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex ">
                {formattedBandwidth?.map((bandwidth: FormattedStat) => (
                  <div
                    className="flex flex-col items-center flex-1"
                    key={bandwidth.key}
                  >
                    <GaugeChart
                      circleWidth={10}
                      gap={100}
                      progress={bandwidth.value}
                      progressWidth={10}
                      rounded
                      showValue
                      size={100}
                      displayValue={bandwidth.mbps}
                      progressClassName={cn(
                        bandwidth.color === "red" && "text-red-500",
                        bandwidth.color === "yellow" && "text-yellow-500",
                        bandwidth.color === "green" && "text-green-500"
                      )}
                    />
                    <p>{bandwidth.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Latency (ms)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex">
                {formattedLatency?.map((latency: FormattedStat) => (
                  <div
                    key={latency?.key}
                    className="flex flex-col items-center flex-1"
                  >
                    <GaugeChart
                      circleWidth={10}
                      gap={100}
                      progress={latency.value}
                      progressWidth={10}
                      rounded
                      showValue
                      displayValue={latency.ms}
                      size={100}
                      progressClassName={cn(
                        latency.color === "red" && "text-red-500",
                        latency.color === "yellow" && "text-yellow-500",
                        latency.color === "green" && "text-green-500"
                      )}
                    />
                    <p>{latency.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4 mb-8">
            <CardHeader>
              <CardTitle>Jitter (ms)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex">
                {formattedJitter?.map((jitter: FormattedStat) => (
                  <div
                    key={jitter?.key}
                    className="flex flex-col items-center flex-1"
                  >
                    <GaugeChart
                      circleWidth={10}
                      gap={100}
                      progress={jitter.value}
                      progressWidth={10}
                      rounded
                      showValue
                      size={100}
                      displayValue={jitter.ms}
                      progressClassName={cn(
                        jitter.color === "red" && "text-red-500",
                        jitter.color === "yellow" && "text-yellow-500",
                        jitter.color === "green" && "text-green-500"
                      )}
                    />
                    <p>{jitter.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
