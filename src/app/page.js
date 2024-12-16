'use client';

import { Button } from '@/components/ui/button';
import {
	DownloadIcon,
	HelpCircle,
	Loader2Icon,
	PlayIcon,
	SaveIcon,
	UploadIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import SpeedTest from '@cloudflare/speedtest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge } from '@/components/ui/gauge';
import {
	PopoverContent,
	PopoverTrigger,
	Popover,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const MetricCard = ({
	title,
	downloadValue,
	uploadValue,
	helpText,
	isRunning = false,
	type,
}) => {
	return (
		<Card
			className={cn(
				'relative w-full',
				isRunning &&
					'before:absolute before:inset-0 before:rounded-xl before:border-4 before:border-primary/50 before:animate-pulse'
			)}>
			<CardHeader className='flex flex-row items-center space-y-0'>
				<CardTitle>{title}</CardTitle>
				<Popover>
					<PopoverTrigger>
						<Button size='icon' variant='ghost'>
							<HelpCircle size={16} className='opacity-60' strokeWidth={2} />
						</Button>
					</PopoverTrigger>
					<PopoverContent>{helpText}</PopoverContent>
				</Popover>
			</CardHeader>
			<CardContent className='grid grid-cols-2 gap-4'>
				<div className='flex flex-col items-center space-y-2'>
					<Gauge
						value={downloadValue}
						size='large'
						showValue={true}
						maxValue={100}
						type={type}
					/>
					<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
						<DownloadIcon size={14} />
						<span>Download</span>
					</div>
				</div>
				<div className='flex flex-col items-center space-y-2'>
					<Gauge
						value={uploadValue}
						size='large'
						showValue={true}
						maxValue={100}
						type={type}
					/>
					<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
						<UploadIcon size={14} />
						<span>Upload</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default function Home() {
	const [ranFirstTest, setRanFirstTest] = useState(false);
	const [speedTest, setSpeedTest] = useState(null);
	const [finalResults, setFinalResults] = useState(null);
	const [results, setResults] = useState(null);
	const [isRunning, setIsRunning] = useState(false);

	const updateResults = (results) => {
		return {
			download: results.getDownloadBandwidth(),
			upload: results.getUploadBandwidth(),

			downloadedJitter: results.getDownLoadedJitter(),
			uploadedJitter: results.getUpLoadedJitter(),

			downloadedLatency: results.getDownLoadedLatency(),
			uploadedLatency: results.getUpLoadedLatency(),

			packetLoss: results.getPacketLoss(),
			packetLossDetails: results.getPacketLossDetails(),

			// unloadedLatency: results.getUnloadedLatency(),
			// unloadedJitter: results.getUnloadedJitter(),
			// unloadedLatencyPoints: results.getUnloadedLatencyPoints(),
			// downloadedLatency: results.getDownLoadedLatency(),
			// downloadedLatencyPoints: results?.getDownLoadedLatencyPoints(),
			// uploadedLatencyPoints: results.getUpLoadedLatencyPoints(),
			// downloadBandwidth: results.getDownloadBandwidth(),
			// downloadBandwidthPoints: results.getDownloadBandwidthPoints(),
			// uploadBandwidth: results.getUploadBandwidth(),
			// uploadBandwidthPoints: results.getUploadBandwidthPoints(),

			// scores: results.getScores(),
		};

		// console.log({ r: results.getSummary(), lat: results.getDownLoadedLatency() });
		// setResults({
		// 	download: results.getDownloadBandwidth(),
		// 	upload: results.getUploadBandwidth(),
		// 	unloadedLatency: results.getUnloadedLatency(),
		// 	unloadedJitter: results.getUnloadedJitter(),
		// 	unloadedLatencyPoints: results.getUnloadedLatencyPoints(),
		// 	downloadedLatency: results.getDownLoadedLatency(),
		// 	downloadJitter: results.getDownLoadedJitter(),
		// 	downloadedLatencyPoints: results?.getDownLoadedLatencyPoints(),
		// 	uploadedLatency: results.getUpLoadedLatency(),
		// 	uploadedJitter: results.getUpLoadedJitter(),
		// 	uploadedLatencyPoints: results.getUpLoadedLatencyPoints(),
		// 	downloadBandwidth: results.getDownloadBandwidth(),
		// 	downloadBandwidthPoints: results.getDownloadBandwidthPoints(),
		// 	uploadBandwidth: results.getUploadBandwidth(),
		// 	uploadBandwidthPoints: results.getUploadBandwidthPoints(),
		// 	packetLoss: results.getPacketLoss(),
		// 	packetLossDetails: results.getPacketLossDetails(),
		// 	scores: results.getScores(),

		// 	// latency: results.getUnloadedLatency(),
		// 	// jitter: results.getUnloadedJitter(),
		// 	// packetLoss: results.getPacketLoss(),
		// 	// scores: results.getScores(),
		// });
	};

	const updateFinalResults = (results) => {
		return {
			download: results.getDownloadBandwidth(),
			upload: results.getUploadBandwidth(),
			unloadedLatency: results.getUnloadedLatency(),
			unloadedJitter: results.getUnloadedJitter(),
			unloadedLatencyPoints: results.getUnloadedLatencyPoints(),
			downloadedLatency: results.getDownLoadedLatency(),
			downloadedJitter: results.getDownLoadedJitter(),
			downloadedLatencyPoints: results?.getDownLoadedLatencyPoints(),
			uploadedLatency: results.getUpLoadedLatency(),
			uploadedJitter: results.getUpLoadedJitter(),
			uploadedLatencyPoints: results.getUpLoadedLatencyPoints(),
			downloadBandwidth: results.getDownloadBandwidth(),
			downloadBandwidthPoints: results.getDownloadBandwidthPoints(),
			uploadBandwidth: results.getUploadBandwidth(),
			uploadBandwidthPoints: results.getUploadBandwidthPoints(),
			packetLoss: results.getPacketLoss(),
			packetLossDetails: results.getPacketLossDetails(),
			scores: results.getScores(),
		};

		// return {
		// 	download: results.getDownloadBandwidth(),
		// 	upload: results.getUploadBandwidth(),

		// 	downloadJitter: results.getDownLoadedJitter(),
		// 	uploadedJitter: results.getUpLoadedJitter(),

		// 	downloadedLatency: results.getDownLoadedLatency(),
		// 	uploadedLatency: results.getUpLoadedLatency(),

		// 	packetLoss: results.getPacketLoss(),
		// 	packetLossDetails: results.getPacketLossDetails(),

		// 	// unloadedLatency: results.getUnloadedLatency(),
		// 	// unloadedJitter: results.getUnloadedJitter(),
		// 	// unloadedLatencyPoints: results.getUnloadedLatencyPoints(),
		// 	// downloadedLatency: results.getDownLoadedLatency(),
		// 	// downloadedLatencyPoints: results?.getDownLoadedLatencyPoints(),
		// 	// uploadedLatencyPoints: results.getUpLoadedLatencyPoints(),
		// 	// downloadBandwidth: results.getDownloadBandwidth(),
		// 	// downloadBandwidthPoints: results.getDownloadBandwidthPoints(),
		// 	// uploadBandwidth: results.getUploadBandwidth(),
		// 	// uploadBandwidthPoints: results.getUploadBandwidthPoints(),

		// 	// scores: results.getScores(),
		// };
	};

	useEffect(() => {
		const st = new SpeedTest({
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

		st.onRunningChange = (running) => setIsRunning(running);
		st.onResultsChange = () => {
			setResults(updateResults(st.results));
		};
		st.onFinish = (results) => {
			setFinalResults(updateFinalResults(results));
		};

		st.onError = (error) => console.error('Speed test error:', error);

		return () => {
			if (st && st.isRunning) {
				st.pause();
			}
		};
	}, []);

	const handleStartTest = () => {
		if (speedTest) {
			speedTest.play();
			setRanFirstTest(true);
		}
	};

	const handleRestartTest = () => {
		if (speedTest) {
			setResults(null);
			setFinalResults(null);
			speedTest.restart();
		}
	};

	if (!ranFirstTest) {
		return (
			<div className='flex justify-center items-center flex-col flex-1 h-screen'>
				<Button className='font-bold w-96' onClick={() => handleStartTest()}>
					<PlayIcon
						className='-ms-1 me-2 opacity-60'
						size={16}
						strokeWidth={2}
						aria-hidden='true'
					/>
					Run Speed Test
				</Button>
			</div>
		);
	}

	const shownResults = finalResults || results || null;

	const handleSaveResults = () => {
		// send the postMessage to rnwebview
		window.ReactNativeWebView.postMessage(JSON.stringify(finalResults));
	};

	return (
		<div className='flex-col space-y-8 pb-16 pt-8 max-w-lg mx-auto px-8'>
			<div className='flex-col flex space-y-4'>
				{finalResults && (
					<Button
						variant='outline'
						className='font-bold w-full'
						onClick={() => handleSaveResults()}>
						<SaveIcon
							className='-ms-1 me-2 opacity-60'
							size={16}
							strokeWidth={2}
							aria-hidden='true'
						/>
						Save Results
					</Button>
				)}

				<Button
					className='font-bold w-full'
					onClick={() => handleRestartTest()}
					disabled={isRunning}>
					{isRunning ? (
						<>
							<Loader2Icon
								className='-ms-1 me-2 opacity-60 animate-spin'
								size={16}
								strokeWidth={2}
								aria-hidden='true'
							/>
							Running Speed Test
						</>
					) : (
						<>
							<PlayIcon
								className='-ms-1 me-2 opacity-60'
								size={16}
								strokeWidth={2}
								aria-hidden='true'
							/>
							Run Speed Test
						</>
					)}
				</Button>
			</div>

			<Card
				className={cn(
					'relative',
					isRunning &&
						'before:absolute before:inset-0 before:rounded-xl before:border-4 before:border-primary/50 before:animate-pulse'
				)}>
				<CardHeader>
					<CardTitle>Download (mbps)</CardTitle>
				</CardHeader>
				<CardContent>
					<Gauge
						value={((shownResults?.download || 0) / 1000000).toFixed(2) || 0}
						size='extraLarge'
						showValue={true}
						type='download'
					/>
				</CardContent>
			</Card>

			<Card
				className={cn(
					'relative',
					isRunning &&
						'before:absolute before:inset-0 before:rounded-xl before:border-4 before:border-primary/50 before:animate-pulse'
				)}>
				<CardHeader>
					<CardTitle>Upload (mbps)</CardTitle>
				</CardHeader>
				<CardContent>
					<Gauge
						value={((shownResults?.upload || 0) / 1000000).toFixed(2)}
						size='extraLarge'
						showValue={true}
						type='upload'
					/>
				</CardContent>
			</Card>

			<MetricCard
				title='Latency (ms)'
				downloadValue={(shownResults?.downloadedLatency || 0)?.toFixed(2)}
				uploadValue={(shownResults?.uploadedLatency || 0)?.toFixed(2)}
				helpText='Latency is the time it takes for data to travel from your device to the speed test servers and back. Lower values mean more responsive connections. Under 50ms is excellent, 50-100ms is good, and over 100ms may cause noticeable delays.'
				isRunning={isRunning}
				type='latency'
			/>
			<MetricCard
				title='Jitter (ms)'
				downloadValue={(shownResults?.downloadedJitter || 0)?.toFixed(2)}
				uploadValue={(shownResults?.uploadedJitter || 0)?.toFixed(2)}
				helpText='Jitter measures the variation in latency over time. Lower jitter means a more stable connection. Under 10ms is excellent, 10-20ms is good, and over 20ms may cause inconsistent performance in real-time applications.'
				isRunning={isRunning}
				type='jitter'
			/>
		</div>
	);
}
