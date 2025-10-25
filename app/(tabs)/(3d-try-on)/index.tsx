import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { WebView } from "react-native-webview";

import { Header } from "@/components/ui/header";
import { useLocal } from "@/hooks/use-lang";
import { styles } from "@/styles/3d-try-on/3d-try-on";

const TryOnViewer = () => {
  const { t } = useLocal();
  const [isViewerActive, setIsViewerActive] = useState(true);
  const { frameId: routeFrameId } = useLocalSearchParams<{ frameId?: string }>();

  const apiKey = process.env.EXPO_PUBLIC_FITTINGBOX_API_KEY ?? "TBVAcXitApiZPVH791yxdHbAc8AKzBwtCnjtv6Xn";
  const frameId = routeFrameId ?? "8053672909258"; // default frame

  const fitmixHtml = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
          <style>
            html, body {
              margin: 0;
              padding: 0;
              height: 100%;
              background: #000;
              overflow: hidden;
            }
            #fitmix-container {
              position: fixed;
              inset: 0;
              width: 100vw;
              height: 100vh;
              background: #000;
              overflow: hidden;
            }
            .controls {
              position: absolute;
              top: 20px;
              left: 20px;
              display: flex;
              flex-direction: column;
              gap: 8px;
              z-index: 9999;
            }
            button {
              background: #fff;
              color: #000;
              border: none;
              padding: 8px 16px;
              font-size: 14px;
              border-radius: 4px;
              cursor: pointer;
            }
          </style>
          <script src="https://vto-advanced-integration-api.fittingbox.com/index.js" type="text/javascript"></script>
        </head>
        <body>
          <div class="controls">
            <button onclick="fitmixInstance.setFrame('8053672909258')">Frame 1</button>
            <button onclick="fitmixInstance.setFrame('0888392486523')">Frame 2</button>
            <button onclick="fitmixInstance.setFrame('8056597233958')">Frame 3</button>
            <button onclick="openVto()">Start VTO</button>
            <button onclick="stopVto()">Stop VTO</button>
          </div>
          <div id="fitmix-container"></div>

          <script>
            (function () {
              function post(type, payload = {}) {
                window.ReactNativeWebView?.postMessage(JSON.stringify({ type, payload }));
              }

              function hide() {
                document.getElementById("fitmix-container").style.display = "none";
              }

              function show() {
                document.getElementById("fitmix-container").style.display = "block";
              }

              window.onload = function () {
                try {
                  const params = {
                    apiKey: "${apiKey}",
                    frame: "${frameId}",
                    onStopVto: hide,
                    onIssue: (data) => post("issue", data),
                  };

                  window.fitmixInstance = FitMix.createWidget("fitmix-container", params, function () {
                    post("ready", { message: "VTO module ready" });
                  });
                } catch (err) {
                  post("error", { message: err?.message || String(err) });
                }
              };

              function openVto() {
                try {
                  window.fitmixInstance?.startVto("live");
                  show();
                  post("vtoStarted");
                } catch (err) {
                  post("error", { message: err?.message || String(err) });
                }
              }

              function stopVto() {
                try {
                  window.fitmixInstance?.stopVto();
                  post("vtoStopped");
                } catch (err) {
                  post("error", { message: err?.message || String(err) });
                }
              }

              window.openVto = openVto;
              window.stopVto = stopVto;
            })();
          </script>
        </body>
      </html>
    `;
  }, [apiKey, frameId]);

  const handleClose = () => setIsViewerActive(false);

  return (
    <View style={styles.container}>
      <Header title={t("3D Viewer")} onBack={handleClose} />
      {isViewerActive && (
        <View style={styles.viewerContainer}>
          <WebView
            originWhitelist={["*"]}
            source={{ html: fitmixHtml, baseUrl: "https://vto-advanced-integration-api.fittingbox.com/" }}
            style={{ flex: 1, backgroundColor: "#000" }}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            mixedContentMode="always"
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                console.log("[FitMix Event]", data);
              } catch (err) {
                console.warn("WebView message parse error:", err);
              }
            }}
            {...(Platform.OS === "android"
              ? {
                  onPermissionRequest: (event: any) => {
                    event.grant(event.resources);
                  },
                }
              : {})}
          />
        </View>
      )}
    </View>
  );
};

export default TryOnViewer;
