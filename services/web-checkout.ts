import * as WebBrowser from 'expo-web-browser';

/**
 * Web-based checkout implementation as fallback for Expo Go
 * This opens the Shopify checkout URL in the device's browser
 */
export class WebCheckoutService {
  /**
   * Open Shopify checkout in browser
   */
  static async presentCheckout(checkoutUrl: string): Promise<boolean> {
    try {
      const result = await WebBrowser.openBrowserAsync(checkoutUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
        controlsColor: '#007AFF',
        showTitle: true,
        enableBarCollapsing: false,
        showInRecents: true,
      });

      // Check if the user completed the checkout
      return result.type === 'dismiss' && result.url?.includes('thank_you');
    } catch (error) {
      console.error('Web checkout error:', error);
      return false;
    }
  }

  /**
   * Open checkout in external browser
   */
  static async openInExternalBrowser(checkoutUrl: string): Promise<void> {
    try {
      await WebBrowser.openBrowserAsync(checkoutUrl, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        controlsColor: '#007AFF',
        showTitle: true,
        enableBarCollapsing: false,
        showInRecents: true,
      });
    } catch (error) {
      console.error('External browser checkout error:', error);
    }
  }
}
