'use client';

export default function Home() {
	const sendPostMessage = (message) => {
		// Check if we're running in a WebView environment
		if (window.ReactNativeWebView) {
			// Send a message to React Native
			window.ReactNativeWebView.postMessage(JSON.stringify(message));
		} else {
			console.log('Not running in React Native WebView');
		}
	};

	const handlePing = () => {
		sendPostMessage({ type: 'PING', data: 'Hello from React!' });
	};

	const handleSpeedTest = () => {
		new SpeedTest().onFinish = (results) => {
			const summary = results.getSummary();
			console.log(summary);
			sendPostMessage({ type: 'SPEED_TEST', data: summary });
		};
	};

	return (
		<div>
			<button onClick={handlePing}>Ping</button>
			<button onClick={handleSpeedTest}>Speed Test</button>
		</div>
	);
}
