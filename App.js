import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Platform, Picker } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import WebCamera from './WebCamera';

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
  // Check if the scanned data starts with any of our known codes
  for (const [code, info] of Object.entries(F1_CODE_LOOKUP)) {
    if (scannedData.startsWith(code)) {
      return {
        model: info.model,
        scannedCode: code,
        scannedCodeType: info.codeType,
        otherCode: info.otherCode,
        otherCodeType: info.codeType === 'Code 1' ? 'Code 2' : 'Code 1'
      };
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
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [cameraKey, setCameraKey] = useState(0);

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
            originalLabel: device.label
          };
        });
        
        setAvailableCameras(cameras);
        
        // Try to select back camera by default
        const backCamera = cameras.find(cam => 
          cam.originalLabel && (
            cam.originalLabel.toLowerCase().includes('back') || 
            cam.originalLabel.toLowerCase().includes('rear') ||
            cam.originalLabel.toLowerCase().includes('environment')
          )
        );
        
        if (backCamera) {
          setSelectedCamera(backCamera.deviceId);
        } else if (cameras.length > 1) {
          // If no back camera found, select the second one (often back on mobile)
          setSelectedCamera(cameras[1].deviceId);
        } else if (cameras.length > 0) {
          setSelectedCamera(cameras[0].deviceId);
        }
      }
    } catch (error) {
      console.error('Error enumerating cameras:', error);
    }
  };

  const handleCameraChange = (deviceId) => {
    setSelectedCamera(deviceId);
    // Force camera to reinitialize with new device
    setCameraKey(prev => prev + 1);
  };

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

  // Use custom WebCamera for web, expo-camera for native
  const CameraComponent = Platform.OS === 'web' ? (
    <WebCamera
      style={styles.scanner}
      selectedDeviceId={selectedCamera}
      onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      zoom={zoom}
      flashOn={flashOn}
    />
  ) : (
    <CameraView
      style={styles.scanner}
      facing="back"
      onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      zoom={zoom}
      enableTorch={flashOn}
      barcodeScannerSettings={{
        barcodeTypes: ["qr", "pdf417", "code128", "code39", "code93", "codabar", "ean13", "ean8", "upc_e", "datamatrix", "aztec"],
      }}
    />
  );

  return (
    <View style={styles.container}>
      {CameraComponent}
      
      <View style={styles.bottomContainer}>
        {/* Camera Selector for Web */}
        {Platform.OS === 'web' && availableCameras.length > 0 && !scanned && (
          <View style={styles.cameraSelector}>
            <Text style={styles.selectorLabel}>📷 Camera Selection</Text>
            <select
              value={selectedCamera || ''}
              onChange={(e) => handleCameraChange(e.target.value)}
              style={styles.webSelect}
            >
              {availableCameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label}
                </option>
              ))}
            </select>
            <Text style={styles.cameraCount}>
              Found {availableCameras.length} camera{availableCameras.length !== 1 ? 's' : ''}
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
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  zoomText: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 12,
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
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00ff00',
  },
  f1ModelText: {
    color: '#00ff00',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  f1ScannedText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '600',
  },
  f1OtherText: {
    color: '#cccccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2,
  },
  noMatchContainer: {
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ffa500',
  },
  noMatchText: {
    color: '#ffa500',
    fontSize: 16,
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
});