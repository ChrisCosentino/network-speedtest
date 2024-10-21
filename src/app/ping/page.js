'use client';

import { sendPostMessage } from '@/utils/send-post-message';

export default function PingPage() {
	const handlePing = () => {
		sendPostMessage({ type: 'PING', data: 'Hello from React!' });
	};

	return (
		<div>
			<button onClick={handlePing}>Ping</button>
		</div>
	);
}
