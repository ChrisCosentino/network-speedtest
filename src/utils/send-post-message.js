export const sendPostMessage = (message) => {
	// Check if we're running in a WebView environment
	if (window.ReactNativeWebView) {
		// Send a message to React Native
		window.ReactNativeWebView.postMessage(JSON.stringify(message));
	} else {
		console.log('Not running in React Native WebView');
	}
};
