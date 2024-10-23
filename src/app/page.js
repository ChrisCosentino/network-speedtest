// // // 'use client';

// // // import { useState } from 'react';
// // // import SpeedTest from '@cloudflare/speedtest';
// // // import { sendPostMessage } from '@/utils/send-post-message';

// // // export default function Home() {
// // // 	const [results, setResults] = useState(null);
// // // 	const handleSpeedTest = () => {
// // // 		const test = new SpeedTest();

// // // 		test.onRunningChange = (running) => {
// // // 			console.log({ running });
// // // 		};

// // // 		test.onResultsChange = () => {
// // // 			console.log({ sum: test.results?.getSummary() });
// // // 			setResults(test.results?.getSummary());
// // // 		};

// // // 		// test.onRunningChange = (running) => {
// // // 		//   setIsRunning(running);
// // // 		// };

// // // 		// test.onResultsChange = () => {
// // // 		//   setResults(test.results.getSummary());
// // // 		// };

// // // 		// test.onFinish = () => {
// // // 		//   setResults(test.results.getSummary());
// // // 		// };

// // // 		// test.onError = (err) => {
// // // 		//   setError(err);
// // // 		//   setIsRunning(false);
// // // 		// };

// // // 		// new SpeedTest().onFinish = (results) => {
// // // 		// 	const summary = results.getSummary();
// // // 		// 	console.log(summary);
// // // 		// 	sendPostMessage({ type: 'SPEED_TEST', data: summary });
// // // 		// };
// // // 	};

// // // 	return (
// // // 		<div>
// // // 			<button onClick={handleSpeedTest}>Speed Test</button>
// // // 			{results?.download}
// // // 		</div>
// // // 	);
// // // }

// // 'use client';

// // import { useState, useRef, useEffect } from 'react';
// // import SpeedTest from '@cloudflare/speedtest';
// // import { sendPostMessage } from '@/utils/send-post-message';
// // import dynamic from 'next/dynamic';
// // import DownloadSpeedGauge from '@/components/download-speed-gauge';
// // import { Gauge } from '@/components/ui/gauge';
// // import { SpeedGauge } from '@/components/speed-gauge';

// // const GaugeComponent = dynamic(() => import('react-gauge-component'), {
// // 	ssr: false,
// // });

// // // Custom hook for fast-updating values
// // function useFastUpdate(initialValue) {
// // 	const ref = useRef(initialValue);
// // 	const [, forceRender] = useState(0);

// // 	useEffect(() => {
// // 		let animationFrameId;

// // 		function tick() {
// // 			forceRender((i) => i + 1);
// // 			animationFrameId = requestAnimationFrame(tick);
// // 		}

// // 		animationFrameId = requestAnimationFrame(tick);

// // 		return () => {
// // 			cancelAnimationFrame(animationFrameId);
// // 		};
// // 	}, []);

// // 	const current = ref.current;

// // 	return [
// // 		current,
// // 		(newValue) => {
// // 			ref.current = newValue;
// // 		},
// // 	];
// // }

// // export default function Home() {
// // 	const [downloadSpeed, setDownloadSpeed] = useFastUpdate(0);
// // 	const [uploadSpeed, setUploadSpeed] = useFastUpdate(0);
// // 	const [latency, setLatency] = useFastUpdate(0);
// // 	const [isRunning, setIsRunning] = useState(false);
// // 	const testRef = useRef(null);

// // 	const handleSpeedTest = () => {
// // 		const test = new SpeedTest();
// // 		testRef.current = test;
// // 		setIsRunning(true);

// // 		test.onResultsChange = () => {
// // 			const summary = test.results?.getSummary();
// // 			if (summary) {
// // 				setDownloadSpeed(summary.download || 0);
// // 				setUploadSpeed(summary.upload || 0);
// // 				setLatency(summary.latency?.value || 0);
// // 			}
// // 		};

// // 		test.onFinish = () => {
// // 			const summary = test.results.getSummary();
// // 			console.log({ summary });
// // 			sendPostMessage({ type: 'SPEED_TEST', data: summary });
// // 		};

// // 		test.onError = (err) => {
// // 			console.error(err);
// // 			setIsRunning(false);
// // 		};

// // 		test.play();
// // 	};

// // 	if (!isRunning) {
// // 		return (
// // 			<div>
// // 				<button onClick={handleSpeedTest} disabled={isRunning}>
// // 					{isRunning ? 'Test in Progress' : 'Start Speed Test'}
// // 				</button>
// // 			</div>
// // 		);
// // 	}

// // 	return (
// // 		<div>
// // 			{/* <button onClick={handleSpeedTest} disabled={isRunning}>
// // 				{isRunning ? 'Test in Progress' : 'Start Speed Test'}
// // 			</button> */}

// {/* <Gauge
// 	value={(downloadSpeed / 1000000).toFixed(2)}
// 	size='extraLarge'
// 	showValue={true}
// /> */}

// // 			<SpeedGauge value={(downloadSpeed / 1000000).toFixed(2)} label='Download' />
// // 			<SpeedGauge value={(uploadSpeed / 1000000).toFixed(2)} label='Upload' />
// // 		</div>
// // 	);
// // }
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { Download, Upload, Zap, Activity, WifiOff } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import SpeedTest from '@cloudflare/speedtest';

// const SpeedTestPage = () => {
// 	const [isRunning, setIsRunning] = useState(false);
// 	const [results, setResults] = useState({
// 		download: null,
// 		upload: null,
// 		latency: null,
// 		jitter: null,
// 		packetLoss: null,
// 	});
// 	const [speedTest, setSpeedTest] = useState(null);

// 	useEffect(() => {
// 		const st = new SpeedTest({
// 			autoStart: false,
// 			measurements: [
// 				{ type: 'latency', numPackets: 20 },
// 				{ type: 'download', bytes: 1e5, count: 5 },
// 				{ type: 'upload', bytes: 1e5, count: 5 },
// 				{ type: 'download', bytes: 1e6, count: 3 },
// 				{ type: 'upload', bytes: 1e6, count: 3 },
// 				{ type: 'packetLoss', numPackets: 1e3, responsesWaitTime: 3000 },
// 			],
// 		});

// 		st.onRunningChange = (running) => setIsRunning(running);
// 		st.onResultsChange = ({ type }) => updateResults(st.results);
// 		st.onFinish = (results) => {
// 			updateResults(results);
// 			setIsRunning(false);
// 		};
// 		st.onError = (error) => console.error('Speed test error:', error);

// 		setSpeedTest(st);

// 		return () => {
// 			if (st && st.isRunning) {
// 				st.pause();
// 			}
// 		};
// 	}, []);

// 	const updateResults = (results) => {
// 		setResults({
// 			download: results.getDownloadBandwidth(),
// 			upload: results.getUploadBandwidth(),
// 			latency: results.getUnloadedLatency(),
// 			jitter: results.getUnloadedJitter(),
// 			packetLoss: results.getPacketLoss(),
// 		});
// 	};

// 	const runSpeedTest = () => {
// 		if (speedTest) {
// 			speedTest.play();
// 		}
// 	};

// 	const formatBandwidth = (bps) => {
// 		if (bps === null) return '-';
// 		return `${(bps / 1e6).toFixed(2)} Mbps`;
// 	};

// 	const formatLatency = (ms) => {
// 		if (ms === null) return '-';
// 		return `${ms.toFixed(2)} ms`;
// 	};

// 	const formatPacketLoss = (ratio) => {
// 		if (ratio === null) return '-';
// 		return `${(ratio * 100).toFixed(2)}%`;
// 	};

// 	return (
// 		<div className='container mx-auto p-4'>
// 			<h1 className='text-3xl font-bold mb-6 text-center'>
// 				Cloudflare Speed Test
// 			</h1>
// 			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
// 				<Card>
// 					<CardHeader>
// 						<CardTitle className='flex items-center'>
// 							<Download className='mr-2' /> Download Speed
// 						</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						<p className='text-2xl font-semibold'>
// 							{formatBandwidth(results.download)}
// 						</p>
// 					</CardContent>
// 				</Card>
// 				<Card>
// 					<CardHeader>
// 						<CardTitle className='flex items-center'>
// 							<Upload className='mr-2' /> Upload Speed
// 						</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						<p className='text-2xl font-semibold'>
// 							{formatBandwidth(results.upload)}
// 						</p>
// 					</CardContent>
// 				</Card>
// 				<Card>
// 					<CardHeader>
// 						<CardTitle className='flex items-center'>
// 							<Zap className='mr-2' /> Latency
// 						</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						<p className='text-2xl font-semibold'>{formatLatency(results.latency)}</p>
// 					</CardContent>
// 				</Card>
// 				<Card>
// 					<CardHeader>
// 						<CardTitle className='flex items-center'>
// 							<Activity className='mr-2' /> Jitter
// 						</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						<p className='text-2xl font-semibold'>{formatLatency(results.jitter)}</p>
// 					</CardContent>
// 				</Card>
// 				<Card>
// 					<CardHeader>
// 						<CardTitle className='flex items-center'>
// 							<WifiOff className='mr-2' /> Packet Loss
// 						</CardTitle>
// 					</CardHeader>
// 					<CardContent>
// 						<p className='text-2xl font-semibold'>
// 							{formatPacketLoss(results.packetLoss)}
// 						</p>
// 					</CardContent>
// 				</Card>
// 			</div>
// 			<div className='text-center'>
// 				<Button
// 					onClick={runSpeedTest}
// 					disabled={isRunning}
// 					className='px-6 py-3 text-lg'>
// 					{isRunning ? 'Running Test...' : 'Run Speed Test'}
// 				</Button>
// 			</div>
// 		</div>
// 	);
// };

// export default SpeedTestPage;

'use client';

import { Button } from '@/components/ui/button';
import { DownloadIcon, Loader2Icon, PlayIcon, UploadIcon } from 'lucide-react';
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

	return (
		<div className='flex-col space-y-8 py-16 max-w-lg mx-auto px-8'>
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
				<CardFooter>
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
				</CardFooter>
			</Card>
		</div>
	);
}
// 'use client';

// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Gauge } from '@/components/ui/gauge';
// import SpeedTest from '@cloudflare/speedtest';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';

// export default function Home() {
// 	const [speedTest, setSpeedTest] = useState(null);
// 	const [isRunning, setIsRunning] = useState(false);
// 	const [results, setResults] = useState(null);
// 	const [ranFirstTest, setRanFirstTest] = useState(false);

// 	const updateResults = (results) => {
// 		console.log({ r: results.getSummary(), lat: results.getDownLoadedLatency() });
// 		setResults({
// 			download: results.getDownloadBandwidth(),
// 			upload: results.getUploadBandwidth(),
// 			unloadedLatency: results.getUnloadedLatency(),
// 			unloadedJitter: results.getUnloadedJitter(),
// 			unloadedLatencyPoints: results.getUnloadedLatencyPoints(),
// 			downloadedLatency: results.getDownLoadedLatency(),
// 			downloadJitter: results.getDownLoadedJitter(),
// 			downloadedLatencyPoints: results?.getDownLoadedLatencyPoints(),
// 			uploadedLatency: results.getUpLoadedLatency(),
// 			uploadedJitter: results.getUpLoadedJitter(),
// 			uploadedLatencyPoints: results.getUpLoadedLatencyPoints(),
// 			downloadBandwidth: results.getDownloadBandwidth(),
// 			downloadBandwidthPoints: results.getDownloadBandwidthPoints(),
// 			uploadBandwidth: results.getUploadBandwidth(),
// 			uploadBandwidthPoints: results.getUploadBandwidthPoints(),
// 			packetLoss: results.getPacketLoss(),
// 			packetLossDetails: results.getPacketLossDetails(),
// 			scores: results.getScores(),

// 			// latency: results.getUnloadedLatency(),
// 			// jitter: results.getUnloadedJitter(),
// 			// packetLoss: results.getPacketLoss(),
// 			// scores: results.getScores(),
// 		});
// 	};

// 	useEffect(() => {
// 		const st = new SpeedTest({
// 			autoStart: false,
// 			// measurements: [
// 			// 	{ type: 'latency', numPackets: 20 },
// 			// 	{ type: 'download', bytes: 1e5, count: 5 },
// 			// 	{ type: 'upload', bytes: 1e5, count: 5 },
// 			// 	{ type: 'download', bytes: 1e6, count: 20 },
// 			// 	{ type: 'upload', bytes: 1e6, count: 20 },
// 			// 	{ type: 'packetLoss', numPackets: 1e3, responsesWaitTime: 3000 },
// 			// ],
// 		});

// 		setSpeedTest(st);

// 		st.onRunningChange = (running) => setIsRunning(running);
// 		st.onResultsChange = () => updateResults(st.results);
// 		st.onFinish = (results) => {
// 			console.log({ results });
// 			updateResults(results);
// 			setIsRunning(false);
// 		};

// 		st.onError = (error) => console.error('Speed test error:', error);

// 		return () => {
// 			if (st && st.isRunning) {
// 				st.pause();
// 			}
// 		};
// 	}, []);

// 	console.log({ results });

// 	const handleStartTest = () => {
// 		if (speedTest) {
// 			speedTest.play();
// 			setRanFirstTest(true);
// 		}
// 	};

// 	const handleRestartTest = () => {
// 		if (speedTest) {
// 			speedTest?.restart();
// 		}
// 	};

// 	console.log({ results });

// 	return (
// 		<div className='max-w-3xl mx-auto flex-col space-y-8 px-8'>
// 			<div className='pt-8'>
// 				<Button variant='outline' className='aspect-square max-sm:p-0'>
// 					<Plus
// 						className='opacity-60 sm:-ms-1 sm:me-2'
// 						size={16}
// 						strokeWidth={2}
// 						aria-hidden='true'
// 					/>
// 					<span className='max-sm:sr-only'>Add new</span>
// 				</Button>

// 				<Button
// 					className='w-full'
// 					onClick={
// 						!ranFirstTest ? () => handleStartTest() : () => handleRestartTest()
// 					}
// 					// onClick={() => (!ranFirstTest ? handleStartTest() : handleRestartTest())}
// 					disabled={isRunning}>
// 					{ranFirstTest ? 'Restart Test' : 'Start Test'}
// 				</Button>
// 				{/* {!ranFirstTest ? (
// 					<Button
// 						className='w-full'
// 						onClick={() => handleStartTest()}
// 						disabled={isRunning}>
// 						Start Test
// 					</Button>
// 				) : (
// 					<Button className='w-full' disabled={isRunning}>
// 						Run Test
// 					</Button>
// 				)} */}
// 			</div>
// 			{ranFirstTest && (
// 				<>
// 					<Card>
// 						<CardHeader>
// 							<CardTitle>Download (mbps)</CardTitle>
// 						</CardHeader>
// 						<CardContent>
// 							<Gauge
// 								value={(results?.download / 1000000).toFixed(2) || 0}
// 								size='extraLarge'
// 								showValue={true}
// 							/>
// 						</CardContent>
// 					</Card>

// <Card>
// 	<CardHeader>
// 		<CardTitle>Upload (mbps)</CardTitle>
// 	</CardHeader>
// 	<CardContent>
// 		<Gauge
// 			value={(results?.upload / 1000000).toFixed(2) || 0}
// 			size='extraLarge'
// 			showValue={true}
// 		/>
// 	</CardContent>
// </Card>

// 					<Card>
// 						<CardHeader>
// 							<CardTitle>Title Here</CardTitle>
// 						</CardHeader>
// 						<CardContent>
// 							<div>
// 								Latency: {results?.latency}
// 								Jitter: {results?.jitter}
// 								Packet Loss: {results?.packetLoss}
// 							</div>
// 						</CardContent>
// 					</Card>
// 				</>
// 			)}
// 		</div>
// 	);
// }
