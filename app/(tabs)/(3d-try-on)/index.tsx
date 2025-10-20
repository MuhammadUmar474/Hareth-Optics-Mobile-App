import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { WebView } from "react-native-webview";

import Button from "@/components/ui/custom-button";
import Typography from "@/components/ui/custom-typography";
import { Header } from "@/components/ui/header";
import { COLORS } from "@/constants/colors";
import { SIZES } from "@/constants/sizes";
import { useLocal } from "@/hooks/use-lang";
import { styles } from "@/styles/3d-try-on/3d-try-on";

const TryOnViewer = () => {
  const{t}=useLocal()
  const [isViewerActive, setIsViewerActive] = useState(false);
  const { frameId: routeFrameId } = useLocalSearchParams<{ frameId?: string }>();

  const apiKey = (process.env.EXPO_PUBLIC_FITTINGBOX_API_KEY as string) || "";
  const frameId = (routeFrameId as string) || ""; // optionally pass via route: /(tabs)/(3d-try-on)?frameId=XXXX

  const fitmixHtml = useMemo(() => {
    // Use https explicitly and fit container to viewport
    const safeApiKey = apiKey.replace(/"/g, "&quot;");
    const safeFrameId = frameId.replace(/"/g, "&quot;");
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <style>
            html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #000; }
            #fitmix-container { position: fixed; inset: 0; width: 100vw; height: 100vh; }
            .fallback { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #888; font-family: -apple-system, Roboto, sans-serif; }
          </style>
          <script src="https://static.fittingbox.com/api/v1/fitmix.js"></script>
        </head>
        <body>
          <div id="fitmix-container"></div>
          <div id="fallback" class="fallback" style="display:none">Loading…</div>
          <script>
            (function() {
              var post = function(type, payload) {
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload || null }));
                }
              };

              try {
                var params = {
                  apiKey: "TBVAcXitApiZPVH791yxdHbAc8AKzBwtCnjtv6Xn",
                  popupIntegration: false,
                  ui: { theme: 'dark' },
                  // Force mobile constraints for camera usage
                  constraints: { audio: false, video: { facingMode: 'user' } },
                };
                var containerId = 'fitmix-container';
                var widget = FitMix.createWidget(containerId, params);

                widget.on('ready', function() { post('ready'); });
                widget.on('error', function(err) { post('error', { message: String(err && err.message || err) }); });
                widget.on('frameChange', function(data){ post('frameChange', data); });

                var fid = "8053672909258";
                if (fid) { widget.setFrame(fid); }

                // Expose minimal API for future use
                window.__FITMIX__ = widget;
              } catch (e) {
                post('bootstrapError', { message: String(e && e.message || e) });
                var fb = document.getElementById('fallback');
                if (fb) fb.style.display = 'flex';
              }
            })();
          </script>
        </body>
      </html>
    `;
  }, [apiKey, frameId]);

  const handleStartTryOn = () => {
    setIsViewerActive(true);
  };

  const handleClose = () => {
    setIsViewerActive(false);
  };

  return (
    <View style={styles.container}>
      <Header
        title={isViewerActive ? "3D Viewer" : "3D Try-on"}
        onBack={handleClose}
      />

      <View style={[styles.contentContainer]}>
        {!isViewerActive ? (
          <>
            <View style={styles.placeholderContainer}>
              <View style={styles.placeholder}>
                <Ionicons
                  name="camera-outline"
                  size={moderateScale(60)}
                  color={COLORS.grey6}
                />
                <Typography
                  title={t("tryOn.cameraPlaceholder")}
                  fontSize={SIZES.desc}
                  color={COLORS.grey6}
                  style={styles.placeholderText}
                />
              </View>
              <Button style={styles.startButton} onPress={handleStartTryOn}>
                <Typography
                  title={t("tryOn.startTryOn")}
                  fontSize={SIZES.desc}
                  color={COLORS.white}
                  style={styles.buttonText}
                />
              </Button>
            </View>
          </>
        ) : (
          <>
            <View style={styles.viewerContainer}>
              <View style={[styles.viewer3D]}>
                <WebView
                  originWhitelist={["*"]}
                  source={{ html: fitmixHtml }}
                  style={{ flex: 1, backgroundColor: "#000" }}
                  javaScriptEnabled
                  domStorageEnabled
                  allowsInlineMediaPlayback
                  mediaPlaybackRequiresUserAction={false}
                  allowsBackForwardNavigationGestures={false}
                  allowsFullscreenVideo
                  mixedContentMode="always"
                  onMessage={(event) => {
                    // Optionally log events for debugging
                    // You may route these to your analytics as needed
                    const data = (() => { try { return JSON.parse(event.nativeEvent.data); } catch { return null; } })();
                    if (__DEV__) {
                      console.log("[FitMix]", data);
                    }
                  }}
                  {...(Platform.OS === 'android'
                    ? {
                        onPermissionRequest: (event: unknown) => {
                          const req = event as { grant: (resources: string[]) => void; resources: string[] };
                          try { req.grant(req.resources); } catch {}
                        },
                      }
                    : {})}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default TryOnViewer;
