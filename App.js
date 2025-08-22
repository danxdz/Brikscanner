import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import { CameraView, Camera } from 'expo-camera';

// F1 Car Models Lookup Table - Each model has 2 separate codes
const F1_CODE_LOOKUP = {
  // Ferrari
  '6536841': { model: 'Ferrari', codeType: 'Code 1', otherCode: '6538305' },
  '6538305': { model: 'Ferrari', codeType: 'Code 2', otherCode: '6536841' },
  
  // RB20
  '6536842': { model: 'RB20', codeType: 'Code 1', otherCode: '6538306' },
  '6538306': { model: 'RB20', codeType: 'Code 2', otherCode: '6536842' },
  
  // Mercedes-AMG
  '6536843': { model: 'Mercedes-AMG', codeType: 'Code 1', otherCode: '6538307' },
  '6538307': { model: 'Mercedes-AMG', codeType: 'Code 2', otherCode: '6536843' },
  
  // Aston Martin
  '6536844': { model: 'Aston Martin', codeType: 'Code 1', otherCode: '6538308' },
  '6538308': { model: 'Aston Martin', codeType: 'Code 2', otherCode: '6536844' },
  
  // VCARB
  '6536845': { model: 'VCARB', codeType: 'Code 1', otherCode: '6538309' },
  '6538309': { model: 'VCARB', codeType: 'Code 2', otherCode: '6536845' },
  
  // Sauber
  '6536846': { model: 'Sauber', codeType: 'Code 1', otherCode: '6538310' },
  '6538310': { model: 'Sauber', codeType: 'Code 2', otherCode: '6536846' },
  
  // Alpine
  '6536847': { model: 'Alpine', codeType: 'Code 1', otherCode: '6538311' },
  '6538311': { model: 'Alpine', codeType: 'Code 2', otherCode: '6536847' },
  
  // Williams
  '6536848': { model: 'Williams', codeType: 'Code 1', otherCode: '6538312' },
  '6538312': { model: 'Williams', codeType: 'Code 2', otherCode: '6536848' },
  
  // Haas
  '6536849': { model: 'Haas', codeType: 'Code 1', otherCode: '6538313' },
  '6538313': { model: 'Haas', codeType: 'Code 2', otherCode: '6536849' },
  
  // McLaren
  '6536850': { model: 'McLaren', codeType: 'Code 1', otherCode: '6538314' },
  '6538314': { model: 'McLaren', codeType: 'Code 2', otherCode: '6536850' },
  
  // F1
  '6536851': { model: 'F1', codeType: 'Code 1', otherCode: '6538315' },
  '6538315': { model: 'F1', codeType: 'Code 2', otherCode: '6536851' },
  
  // F1 ACADEMY
  '6536852': { model: 'F1 ACADEMY', codeType: 'Code 1', otherCode: '6538316' },
  '6538316': { model: 'F1 ACADEMY', codeType: 'Code 2', otherCode: '6536852' },
};

const getF1Model = (scannedData) => {
  const raw = String(scannedData ?? '').trim();
  if (!raw) {
    return null;
  }

  // Safari-safe: extract numeric clusters and only accept exact 7-digit clusters
  const clusters = raw.match(/\d+/g) || [];
  for (const cluster of clusters) {
    if (cluster.length === 7) {
      const info = F1_CODE_LOOKUP[cluster];
      if (info) {
        return {
          model: info.model,
          scannedCode: cluster,
          scannedCodeType: info.codeType,
          otherCode: info.otherCode,
          otherCodeType: info.codeType === 'Code 1' ? 'Code 2' : 'Code 1'
        };
      }
    }
  }

  return null;
};

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');
  const [f1Model, setF1Model] = useState(null);
  const [zoom, setZoom] = useState(0);
  const [flashOn, setFlashOn] = useState(false);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [selectedCameraIndex, setSelectedCameraIndex] = useState(0);
  const [cameraKey, setCameraKey] = useState(0);

  // Web-only refs/state for direct getUserMedia control
  const webVideoRef = useRef(null);
  const webStreamRef = useRef(null);
  const webVideoTrackRef = useRef(null);
  const webScanRafRef = useRef(null);
  const webCanvasRef = useRef(null);
  const webDetectorRef = useRef(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      // After permission, enumerate cameras on web
      if (status === 'granted' && Platform.OS === 'web') {
        enumerateCameras();
      }
    };

    getCameraPermissions();
  }, []);

  // Force remount on web when camera list or selection changes
  useEffect(() => {
    if (Platform.OS === 'web') {
      setCameraKey(prev => prev + 1);
    }
  }, [availableCameras.length, selectedCameraIndex]);

  const enumerateCameras = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        // First get permission by accessing camera once
        await navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          stream.getTracks().forEach(track => track.stop());
        });
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        console.log('Found cameras:', videoDevices);
        
        // Create camera list with better labels
        const cameras = videoDevices.map((device, index) => {
          let label = device.label || `Camera ${index + 1}`;
          
          // Try to identify camera type from label
          if (label.toLowerCase().includes('back') || label.toLowerCase().includes('rear')) {
            label = `📷 Back Camera`;
          } else if (label.toLowerCase().includes('front')) {
            label = `🤳 Front Camera`;
          } else if (label.toLowerCase().includes('wide')) {
            label = `📐 Wide Camera`;
          } else if (label.toLowerCase().includes('telephoto')) {
            label = `🔭 Telephoto Camera`;
          } else if (label.toLowerCase().includes('ultra')) {
            label = `🌐 Ultra-wide Camera`;
          } else {
            label = `📹 Camera ${index + 1}`;
          }
          
          return {
            deviceId: device.deviceId,
            label: label,
            originalLabel: device.label,
            index: index
          };
        });
        
        setAvailableCameras(cameras);
        
        // Try to select back camera by default
        const backCameraIndex = cameras.findIndex(cam => 
          cam.originalLabel && (
            cam.originalLabel.toLowerCase().includes('back') || 
            cam.originalLabel.toLowerCase().includes('rear') ||
            cam.originalLabel.toLowerCase().includes('environment')
          )
        );
        
        if (backCameraIndex !== -1) {
          setSelectedCameraIndex(backCameraIndex);
        } else if (cameras.length > 1) {
          // If no back camera found, select the last one (often back on mobile)
          setSelectedCameraIndex(cameras.length - 1);
        }
      }
    } catch (error) {
      console.error('Error enumerating cameras:', error);
    }
  };

  const handleCameraChange = (index) => {
    setSelectedCameraIndex(parseInt(index));
    // Force camera to reinitialize
    setCameraKey(prev => prev + 1);
  };

  // Start/stop web camera with explicit deviceId constraints
  const stopWebCamera = () => {
    if (webScanRafRef.current) {
      cancelAnimationFrame(webScanRafRef.current);
      webScanRafRef.current = null;
    }
    if (webStreamRef.current) {
      try {
        webStreamRef.current.getTracks().forEach(t => t.stop());
      } catch {}
      webStreamRef.current = null;
    }
    webVideoTrackRef.current = null;
    if (webVideoRef.current) {
      webVideoRef.current.srcObject = null;
    }
  };

  const startWebCamera = async () => {
    if (Platform.OS !== 'web') return;
    try {
      stopWebCamera();

      const current = availableCameras[selectedCameraIndex];
      const constraints = current && current.deviceId
        ? { video: { deviceId: { exact: current.deviceId } } }
        : { video: { facingMode: { exact: 'environment' } } };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      webStreamRef.current = stream;
      if (webVideoRef.current) {
        webVideoRef.current.srcObject = stream;
      }
      const track = stream.getVideoTracks()[0];
      webVideoTrackRef.current = track;

      // Try to apply torch if requested
      if (flashOn && track && track.applyConstraints) {
        try { await track.applyConstraints({ advanced: [{ torch: true }] }); } catch {}
      }

      // Kick off scanning if supported
      startWebScanning();
    } catch (err) {
      // Fallback: try without exact environment constraint
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        webStreamRef.current = stream;
        if (webVideoRef.current) {
          webVideoRef.current.srcObject = stream;
        }
        webVideoTrackRef.current = stream.getVideoTracks()[0];
        startWebScanning();
      } catch (e2) {
        console.error('Web camera error:', e2);
      }
    }
  };

  const startWebScanning = () => {
    if (typeof window === 'undefined' || !webVideoRef.current) return;
    if (!('BarcodeDetector' in window)) return;

    if (!webDetectorRef.current) {
      webDetectorRef.current = new window.BarcodeDetector({
        formats: ['code_128', 'code_39', 'code_93', 'ean_13', 'ean_8', 'upc_e', 'qr_code', 'pdf417', 'aztec', 'data_matrix']
      });
    }

    const scan = async () => {
      if (!webVideoRef.current || scanned) return;
      try {
        const video = webVideoRef.current;
        const vw = video.videoWidth || 0;
        const vh = video.videoHeight || 0;
        if (vw && vh) {
          // Prepare canvas matching a centered crop region (60% of min dimension)
          const cropScale = 0.6;
          const cropW = Math.floor(vw * cropScale);
          const cropH = Math.floor(vh * cropScale);
          const sx = Math.floor((vw - cropW) / 2);
          const sy = Math.floor((vh - cropH) / 2);

          if (!webCanvasRef.current) {
            webCanvasRef.current = document.createElement('canvas');
          }
          const canvas = webCanvasRef.current;
          canvas.width = cropW;
          canvas.height = cropH;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(video, sx, sy, cropW, cropH, 0, 0, cropW, cropH);

          const detector = webDetectorRef.current;
          const barcodes = await detector.detect(canvas);

          if (barcodes && barcodes.length > 0) {
            // Prefer any barcode whose rawValue resolves to a valid F1 model
            let chosen = null;
            for (const b of barcodes) {
              const candidate = getF1Model(b.rawValue);
              if (candidate) {
                chosen = { data: b.rawValue, model: candidate };
                break;
              }
            }
            // Fallback to first if none matched, but proceed to next frame
            if (chosen) {
              handleBarcodeScanned({ type: 'web', data: chosen.data });
              return;
            }
          }
        }
      } catch {}
      webScanRafRef.current = requestAnimationFrame(scan);
    };

    webScanRafRef.current = requestAnimationFrame(scan);
  };

  // React to selection/permission changes on web to start camera
  useEffect(() => {
    if (Platform.OS === 'web' && hasPermission) {
      startWebCamera();
      return () => stopWebCamera();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPermission, selectedCameraIndex, cameraKey]);

  // Apply flash on web when toggled
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const track = webVideoTrackRef.current;
    if (!track) return;
    if (track.applyConstraints) {
      track.applyConstraints({ advanced: [{ torch: !!flashOn }] }).catch(() => {
        // If not supported, restart stream to try torch
        startWebCamera();
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashOn]);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
    
    // Check if this is an F1 model code
    const model = getF1Model(data);
    setF1Model(model);
  };

  const increaseZoom = () => setZoom((prev) => Math.min(prev + 0.1, 1));
  const decreaseZoom = () => setZoom((prev) => Math.max(prev - 0.1, 0));
  const toggleFlash = () => setFlashOn((prev) => !prev);

  if (hasPermission === null) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.permissionText}>No camera access</Text>
      </View>
    );
  }

  // Determine facing based on camera selection
  const getFacing = () => {
    if (Platform.OS !== 'web') {
      return 'back';
    }

    const current = availableCameras[selectedCameraIndex];
    if (current && current.originalLabel) {
      const labelLower = current.originalLabel.toLowerCase();
      const isBackLabeled = labelLower.includes('back') || labelLower.includes('rear') || labelLower.includes('environment');
      const desired = isBackLabeled ? 'back' : 'front';
      // Invert on web to address devices where facing is reversed
      return desired === 'back' ? 'front' : 'back';
    }

    // Fallback: prefer back when multiple devices are present
    return availableCameras.length > 1 ? 'back' : 'front';
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={styles.scanner}>
          <video
            ref={webVideoRef}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </View>
      ) : (
        <CameraView
          key={cameraKey}
          style={styles.scanner}
          facing={getFacing()}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          zoom={zoom}
          enableTorch={flashOn && getFacing() === 'back'}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417", "code128", "code39", "code93", "codabar", "ean13", "ean8", "upc_e", "datamatrix", "aztec"],
          }}
        />
      )}
      
      <View style={styles.bottomContainer}>
        {/* Camera Selector for Web */}
        {Platform.OS === 'web' && availableCameras.length > 0 && !scanned && (
          <View style={styles.cameraSelector}>
            <Text style={styles.selectorLabel}>📷 Camera Selection</Text>
            <select
              value={selectedCameraIndex}
              onChange={(e) => handleCameraChange(e.target.value)}
              style={styles.webSelect}
            >
              {availableCameras.map((camera) => (
                <option key={camera.index} value={camera.index}>
                  {camera.label}
                </option>
              ))}
            </select>
            <Text style={styles.cameraCount}>
              Found {availableCameras.length} camera{availableCameras.length !== 1 ? 's' : ''}
            </Text>
            <Text style={styles.cameraHint}>
              Try each camera to find the back one
            </Text>
          </View>
        )}
        
        <Text style={styles.statusText}>
          {scanned ? `Scanned: ${data}` : 'Point camera at a barcode or QR code'}
        </Text>
        {!scanned && (
          <Text style={styles.zoomText}>
            Zoom: {(zoom * 100).toFixed(0)}% | Flash: {flashOn ? 'ON' : 'OFF'}
          </Text>
        )}
        
        {f1Model && (
          <View style={styles.f1InfoContainer}>
            <Text style={styles.f1ModelText}>🏎️ {f1Model.model}</Text>
            <Text style={styles.f1ScannedText}>
              ✅ Scanned: {f1Model.scannedCodeType} ({f1Model.scannedCode})
            </Text>
            <Text style={styles.f1OtherText}>
              🔍 Other: {f1Model.otherCodeType} ({f1Model.otherCode})
            </Text>
          </View>
        )}
        
        {scanned && !f1Model && (
          <View style={styles.noMatchContainer}>
            <Text style={styles.noMatchText}>ℹ️ Not an F1 model code</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          {!scanned && (
            <>
              <Button title="🔍+" onPress={increaseZoom} />
              <Button title="🔍-" onPress={decreaseZoom} />
              <Button 
                title={flashOn ? "💡OFF" : "💡ON"} 
                onPress={toggleFlash} 
              />
            </>
          )}
          
          {scanned && (
            <Button 
              title="Scan Again" 
              onPress={() => { 
                setScanned(false); 
                setData(''); 
                setF1Model(null);
              }} 
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scanner: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  zoomText: {
    color: '#cccccc',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 8,
  },
  f1InfoContainer: {
    backgroundColor: 'rgba(0, 255, 0, 0.18)',
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  f1ModelText: {
    color: '#00ff00',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  f1ScannedText: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '600',
  },
  f1OtherText: {
    color: '#cccccc',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 0,
  },
  noMatchContainer: {
    backgroundColor: 'rgba(255, 165, 0, 0.18)',
    borderRadius: 6,
    padding: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ffa500',
  },
  noMatchText: {
    color: '#ffa500',
    fontSize: 12,
    textAlign: 'center',
  },
  cameraSelector: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectorLabel: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '600',
  },
  webSelect: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    color: 'black',
    minWidth: '200px',
    marginBottom: 5,
  },
  cameraCount: {
    color: '#00ff00',
    fontSize: 12,
    marginTop: 5,
  },
  cameraHint: {
    color: '#ffa500',
    fontSize: 11,
    marginTop: 3,
    fontStyle: 'italic',
  },
});