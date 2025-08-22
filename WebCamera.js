import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WebCamera = ({ onBarcodeScanned, zoom, flashOn, selectedDeviceId, style }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, [selectedDeviceId]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    try {
      stopCamera();
      setError(null);

      const constraints = {
        video: selectedDeviceId 
          ? { deviceId: { exact: selectedDeviceId } }
          : { facingMode: { ideal: 'environment' } }, // Try back camera by default
        audio: false
      };

      console.log('Starting camera with constraints:', constraints);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Set up barcode scanning with BarcodeDetector API if available
      if ('BarcodeDetector' in window) {
        setupBarcodeScanning();
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError(err.message);
    }
  };

  const setupBarcodeScanning = () => {
    if (!onBarcodeScanned) return;

    const barcodeDetector = new window.BarcodeDetector({
      formats: ['qr_code', 'code_128', 'code_39', 'code_93', 'codabar', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'pdf417', 'aztec', 'data_matrix']
    });

    const scanInterval = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        try {
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes.length > 0) {
            onBarcodeScanned({
              type: barcodes[0].format,
              data: barcodes[0].rawValue
            });
          }
        } catch (err) {
          console.error('Barcode detection error:', err);
        }
      }
    }, 500);

    return () => clearInterval(scanInterval);
  };

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.errorText}>Camera Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          // Don't mirror the video - back camera should not be mirrored
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
});

export default WebCamera;