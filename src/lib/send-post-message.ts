export const sendPostMessage = (message: string): void => {
  // Check if we're in a React Native WebView
  if (typeof window !== "undefined" && window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(message);
  } else if (typeof window !== "undefined" && window.parent) {
    // Otherwise try to send to parent window
    window.parent.postMessage(message, "*");
  } else {
    console.log("No suitable target for postMessage found");
  }
};

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
