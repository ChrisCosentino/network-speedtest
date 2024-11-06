'use client';

import { Button } from '@/components/ui/button';
import {
	DownloadIcon,
	Loader2Icon,
	PlayIcon,
	SaveIcon,
	UploadIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import SpeedTest from '@cloudflare/speedtest';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Gauge } from '@/components/ui/gauge';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

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
		});

		setSpeedTest(st);

		st.onRunningChange = (running) => setIsRunning(running);
		st.onResultsChange = () => {
			setResults(updateResults(st.results));
		};
		st.onFinish = (results) => {
			setFinalResults(updateFinalResults(results));
		};
		// st.onResultsChange = () => updateResults(st.results);
		// st.onFinish = (results) => {
		// 	console.log({ results });
		// 	// updateResults(results);
		// 	setIsRunning(false);
		// };

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

	console.log({ results, finalResults });

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

			<Card>
				<CardHeader>
					<CardTitle>Download (mbps)</CardTitle>
				</CardHeader>
				<CardContent>
					<Gauge
						value={((shownResults?.download || 0) / 1000000).toFixed(2) || 0}
						size='extraLarge'
						showValue={true}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Upload (mbps)</CardTitle>
				</CardHeader>
				<CardContent>
					<Gauge
						value={((shownResults?.upload || 0) / 1000000).toFixed(2)}
						size='extraLarge'
						showValue={true}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Latency (mbps)</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex justify-center items-center space-x-8'>
						<div className='flex flex-col items-start'>
							<div className='text-4xl font-bold'>
								{(shownResults?.downloadedLatency || 0)?.toFixed(2)}
							</div>
							<div className='flex space-x-2 items-center'>
								Download
								<DownloadIcon
									className='-ms-1 me-2 opacity-60 ml-2'
									size={16}
									strokeWidth={2}
									aria-hidden='true'
								/>
							</div>
						</div>
						<div className='flex flex-col items-start'>
							<div className='text-4xl font-bold'>
								{(shownResults?.uploadedLatency || 0)?.toFixed(2)}
							</div>
							<div className='flex space-x-2 items-center'>
								Upload
								<UploadIcon
									className='-ms-1 me-2 opacity-60 ml-2'
									size={16}
									strokeWidth={2}
									aria-hidden='true'
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Jitter</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex justify-center items-center space-x-8'>
						<div className='flex flex-col items-start'>
							<div className='text-4xl font-bold'>
								{(shownResults?.downloadedJitter || 0)?.toFixed(2)}
							</div>
							<div className='flex space-x-2 items-center'>
								Download
								<DownloadIcon
									className='-ms-1 me-2 opacity-60 ml-2'
									size={16}
									strokeWidth={2}
									aria-hidden='true'
								/>
							</div>
						</div>
						<div className='flex flex-col items-start'>
							<div className='text-4xl font-bold'>
								{(shownResults?.uploadedJitter || 0)?.toFixed(2)}
							</div>
							<div className='flex space-x-2 items-center'>
								Upload
								<UploadIcon
									className='-ms-1 me-2 opacity-60 ml-2'
									size={16}
									strokeWidth={2}
									aria-hidden='true'
								/>
							</div>
						</div>
					</div>
				</CardContent>
				{/* <CardFooter>
					<Accordion className='w-full' type='single' collapsible>
						<AccordionItem value='item-1'>
							<AccordionTrigger>Is it accessible?</AccordionTrigger>
							<AccordionContent>
								Yes. It adheres to the WAI-ARIA design pattern.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value='item-2'>
							<AccordionTrigger>Is it accessible?</AccordionTrigger>
							<AccordionContent>
								Yes. It adheres to the WAI-ARIA design pattern.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</CardFooter> */}
			</Card>
		</div>
	);
}
