"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendPostMessage = (message: any) => {
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  } else {
    console.log("Not running in React Native WebView");
  }
};

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
