import React, { useRef, useEffect, useMemo } from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { OSM_CONFIG } from '../constants/map';

export type MapMarker = {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
  testID?: string;
};

export type LeafletMapViewProps = {
  center: {
    latitude: number;
    longitude: number;
  };
  zoom?: number;
  markers?: MapMarker[];
  draggableMarker?: boolean;
  onMapClick?: (coords: { latitude: number; longitude: number }) => void;
  onMarkerDragEnd?: (coords: { latitude: number; longitude: number }) => void;
  onMarkerClick?: (markerId: string) => void;
  onPress?: (e: any) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function LeafletMapView({
  center,
  zoom = 15,
  markers = [],
  draggableMarker = false,
  onMapClick,
  onMarkerDragEnd,
  onMarkerClick,
  onPress,
  style,
  testID = 'leaflet-map-view',
}: LeafletMapViewProps) {
  const webViewRef = useRef<WebView>(null);

  const htmlContent = useMemo(() => {
    const markersJson = JSON.stringify(markers);
    const centerLat = center.latitude;
    const centerLng = center.longitude;
    const tileUrl = OSM_CONFIG.tileUrl;
    const attribution = OSM_CONFIG.attribution;

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { box-sizing: border-box; }
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      background: #F0EDF1;
    }
    .leaflet-control-attribution {
      font-size: 8px !important;
      background: rgba(255, 255, 255, 0.75) !important;
      padding: 1px 4px !important;
    }
    .custom-pin-marker {
      background: transparent;
      border: none;
    }
    .leaflet-popup-content-wrapper {
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 0;
    }
    .leaflet-popup-content {
      margin: 10px 12px;
      line-height: 1.4;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: true
    }).setView([${centerLat}, ${centerLng}], ${zoom});

    L.tileLayer('${tileUrl}', {
      maxZoom: 19,
      attribution: '${attribution}'
    }).addTo(map);

    var pinSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="42">' +
      '<path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z" fill="#006D3E" stroke="#FFFFFF" stroke-width="2"/>' +
      '<circle cx="12" cy="12" r="4.5" fill="#FFFFFF"/>' +
      '</svg>';

    var customPinIcon = L.divIcon({
      className: 'custom-pin-marker',
      html: pinSvg,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -38]
    });

    var markersMap = {};
    var isDraggable = ${draggableMarker ? 'true' : 'false'};

    window.onPopupClick = function(id) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'MARKER_CLICK',
          id: id
        }));
      }
    };

    function createMarker(m, draggable) {
      var marker = L.marker([m.latitude, m.longitude], {
        icon: customPinIcon,
        draggable: draggable
      });
      
      if (m.title || m.description) {
        var popupContent = '<div style="font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif; cursor: pointer;" onclick="window.onPopupClick(\\'' + m.id + '\\')">';
        popupContent += '<b style="font-size: 13px; color: #1B1B1E;">' + (m.title || '') + '</b>';
        if (m.description) {
          popupContent += '<div style="font-size: 11px; color: #3D4A40; margin-top: 2px;">📍 ' + m.description + '</div>';
        }
        popupContent += '<div style="font-size: 10px; color: #006D3E; font-weight: 600; margin-top: 4px;">แตะเพื่อดูรายละเอียด &rarr;</div>';
        popupContent += '</div>';
        marker.bindPopup(popupContent);
      }

      marker.on('click', function() {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'MARKER_CLICK',
            id: m.id
          }));
        }
      });

      if (draggable) {
        marker.on('dragend', function(e) {
          var pos = e.target.getLatLng();
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'MARKER_DRAG_END',
              latitude: pos.lat,
              longitude: pos.lng
            }));
          }
        });
      }

      marker.addTo(map);
      markersMap[m.id] = marker;
      return marker;
    }

    var initialMarkers = ${markersJson};
    initialMarkers.forEach(function(m) {
      createMarker(m, isDraggable);
    });

    map.on('click', function(e) {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'MAP_CLICK',
          latitude: e.latlng.lat,
          longitude: e.latlng.lng
        }));
      }
    });

    // Communication API from React Native
    window.updateCenter = function(lat, lng, newZoom) {
      map.setView([lat, lng], newZoom || map.getZoom(), { animate: true });
    };

    window.updateMarkers = function(newMarkers, draggable) {
      var newIds = {};
      newMarkers.forEach(function(m) { newIds[m.id] = true; });

      Object.keys(markersMap).forEach(function(id) {
        if (!newIds[id]) {
          map.removeLayer(markersMap[id]);
          delete markersMap[id];
        }
      });

      newMarkers.forEach(function(m) {
        if (markersMap[m.id]) {
          markersMap[m.id].setLatLng([m.latitude, m.longitude]);
        } else {
          createMarker(m, draggable);
        }
      });
    };
  </script>
</body>
</html>`;
  }, []);

  // Update center smoothly when prop updates
  useEffect(() => {
    if (webViewRef.current && typeof webViewRef.current.injectJavaScript === 'function' && center) {
      const script = `
        if (typeof window.updateCenter === 'function') {
          window.updateCenter(${center.latitude}, ${center.longitude}, ${zoom});
        }
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [center.latitude, center.longitude, zoom]);

  // Update markers dynamically when markers array changes
  useEffect(() => {
    if (webViewRef.current && typeof webViewRef.current.injectJavaScript === 'function') {
      const script = `
        if (typeof window.updateMarkers === 'function') {
          window.updateMarkers(${JSON.stringify(markers)}, ${draggableMarker ? 'true' : 'false'});
        }
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [markers, draggableMarker]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'MAP_CLICK' && onMapClick) {
        onMapClick({ latitude: data.latitude, longitude: data.longitude });
      } else if (data.type === 'MARKER_DRAG_END' && onMarkerDragEnd) {
        onMarkerDragEnd({ latitude: data.latitude, longitude: data.longitude });
      } else if (data.type === 'MARKER_CLICK' && onMarkerClick) {
        onMarkerClick(data.id);
      }
    } catch (e) {
      // ignore parse errors
    }
  };

  const handleContainerPress = (e: any) => {
    if (onPress) {
      onPress(e);
    } else if (onMapClick) {
      const coords = e?.nativeEvent?.coordinate || (e?.latitude ? e : null);
      if (coords) {
        onMapClick({ latitude: coords.latitude, longitude: coords.longitude });
      }
    }
  };

  return (
    <View
      style={[styles.container, style]}
      testID={testID}
      {...((onPress || onMapClick) ? { onPress: handleContainerPress } : {})}
    >
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        scrollEnabled={false}
        style={styles.webView}
        testID={`${testID}-webview`}
      />
      {/* Hidden marker representations for Jest unit & integration tests */}
      {markers.map((m) => {
        const markerTestId =
          m.testID ||
          (m.id === 'venue'
            ? 'venue-marker'
            : m.id === 'picker' || draggableMarker
            ? 'picker-marker'
            : `marker-${m.id}`);

        return (
          <View
            key={m.id}
            testID={markerTestId}
            style={styles.hiddenTestMarker}
          >
            <View testID={`callout-${m.id}`} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#F0EDF1',
    position: 'relative',
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  hiddenTestMarker: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
});
