/**
 * Native Bridge Utility
 * Handles interface communication between the React web viewport and native host shells (Flutter WebView / Capacitor).
 */

// Extend window interface for Flutter InAppWebView message handlers
declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler: (handlerName: string, ...args: any[]) => Promise<any>;
    };
    Capacitor?: {
      Plugins: any;
    };
  }
}

/**
 * Generic caller to dispatch triggers to Flutter WebView handlers
 */
export async function callNativeHandler(handlerName: string, payload: any = {}): Promise<any> {
  // 1. Check if hosted inside Flutter WebView
  if (window.flutter_inappwebview) {
    try {
      const response = await window.flutter_inappwebview.callHandler(handlerName, payload);
      return response;
    } catch (err) {
      console.error(`[NativeBridge] Error calling Flutter handler "${handlerName}":`, err);
      throw err;
    }
  }

  // 2. Check if hosted inside Capacitor
  if (window.Capacitor && window.Capacitor.Plugins[handlerName]) {
    try {
      return await window.Capacitor.Plugins[handlerName].execute(payload);
    } catch (err) {
      console.error(`[NativeBridge] Error calling Capacitor plugin "${handlerName}":`, err);
      throw err;
    }
  }

  // 3. Fallback mock behaviors for standalone web debugging
  console.warn(`[NativeBridge] Standalone web mode. Mocking execution for: "${handlerName}"`);
  return getMockResponse(handlerName, payload);
}

/**
 * Trigger native camera view and run Google ML Kit OCR scanning natively.
 * Returns parsed text lines or expense totals.
 */
export async function triggerNativeCameraOCR(mode: 'receipt' | 'document'): Promise<any> {
  return await callNativeHandler('triggerOCR', { mode });
}

/**
 * Fetch FCM device registration token for Push Notifications
 */
export async function requestFCMToken(): Promise<string> {
  return await callNativeHandler('getFCMToken');
}

/**
 * Trigger TouchID / FaceID biometrics authentication
 */
export async function toggleNativeBiometrics(): Promise<boolean> {
  return await callNativeHandler('authenticateBiometrics');
}

/**
 * Dispatch local sync indicators or analytics logs
 */
export async function sendAnalyticsToNative(event: string, data: any): Promise<void> {
  await callNativeHandler('logEvent', { event, data });
}

/**
 * Standalone mock responses for web development previews
 */
function getMockResponse(handlerName: string, payload: any): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (handlerName) {
        case 'triggerOCR':
          if (payload.mode === 'receipt') {
            resolve({
              merchant: "Mock Pharmacy Store",
              amount: 3600,
              tax: 240,
              items: ["Vitamin C Tablets", "Surgical Masks"]
            });
          } else {
            resolve({ text: "SmartLife specifications outline parsed successfully." });
          }
          break;
        case 'getFCMToken':
          resolve("mock-fcm-token-12345-abcde");
          break;
        case 'authenticateBiometrics':
          resolve(true);
          break;
        default:
          resolve({ success: true });
      }
    }, 1000);
  });
}
