import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
  
  // Pirelli
  '6536852': { model: 'Pirelli', codeType: 'Code 1', otherCode: '6538316' },
  '6538316': { model: 'Pirelli', codeType: 'Code 2', otherCode: '6536852' },
  
  // Silverstone
  '6536853': { model: 'Silverstone', codeType: 'Code 1', otherCode: '6538317' },
  '6538317': { model: 'Silverstone', codeType: 'Code 2', otherCode: '6536853' },
  
  // Monaco
  '6536854': { model: 'Monaco', codeType: 'Code 1', otherCode: '6538318' },
  '6538318': { model: 'Monaco', codeType: 'Code 2', otherCode: '6536854' },
};

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');
  const [zoom, setZoom] = useState(0);
  const [flashOn, setFlashOn] = useState(false);
  const [f1Model, setF1Model] = useState(null);
  const [facing, setFacing] = useState('back');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const getF1Model = (code) => {
    const modelInfo = F1_CODE_LOOKUP[code];
    if (modelInfo) {
      return {
        model: modelInfo.model,
        scannedCode: code,
        scannedCodeType: modelInfo.codeType,
        otherCode: modelInfo.otherCode,
        otherCodeType: modelInfo.codeType === 'Code 1' ? 'Code 2' : 'Code 1'
      };
    }
    return null;
  };

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    setData(data);
    
    // Check if this is an F1 model code
    const model = getF1Model(data);
    setF1Model(model);
  };

  const toggleFlash = () => setFlashOn((prev) => !prev);
  const toggleCamera = () => setFacing(current => (current === 'back' ? 'front' : 'back'));

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
        <Text style={styles.subText}>Please enable camera access in settings</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <CameraView
        style={styles.scanner}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        zoom={zoom}
        enableTorch={flashOn && facing === 'back'}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417", "code128", "code39", "code93", "codabar", "ean13", "ean8", "upc_e", "datamatrix", "aztec"],
        }}
      />
      
      {/* Scan Frame Overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>
      
      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
          <Text style={styles.controlIcon}>🔄</Text>
          <Text style={styles.controlLabel}>Switch</Text>
        </TouchableOpacity>
        
        {facing === 'back' && (
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            <Text style={styles.controlIcon}>{flashOn ? '🔦' : '💡'}</Text>
            <Text style={styles.controlLabel}>{flashOn ? 'Flash ON' : 'Flash OFF'}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Bottom Container */}
      <View style={styles.bottomContainer}>
        {/* Zoom Controls */}
        {!scanned && (
          <View style={styles.zoomContainer}>
            <TouchableOpacity 
              style={styles.zoomButton} 
              onPress={() => setZoom(Math.max(0, zoom - 0.1))}
            >
              <Text style={styles.zoomButtonText}>−</Text>
            </TouchableOpacity>
            
            <View style={styles.zoomInfo}>
              <Text style={styles.zoomLabel}>Zoom</Text>
              <Text style={styles.zoomValue}>{(zoom * 100).toFixed(0)}%</Text>
            </View>
            
            <View style={styles.zoomSliderContainer}>
              <View style={styles.zoomTrack}>
                <View 
                  style={[styles.zoomFill, { width: `${zoom * 100}%` }]}
                />
              </View>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </View>
            
            <TouchableOpacity 
              style={styles.zoomButton} 
              onPress={() => setZoom(Math.min(1, zoom + 0.1))}
            >
              <Text style={styles.zoomButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Status Text */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {scanned ? '✅ Scanned Successfully' : '📷 Point camera at barcode'}
          </Text>
          {scanned && (
            <Text style={styles.dataText}>{data}</Text>
          )}
        </View>
        
        {/* F1 Model Info */}
        {f1Model && (
          <View style={styles.f1InfoContainer}>
            <Text style={styles.f1Title}>🏎️ F1 Model Detected!</Text>
            <Text style={styles.f1ModelText}>{f1Model.model}</Text>
            <View style={styles.codeContainer}>
              <View style={styles.codeBox}>
                <Text style={styles.codeLabel}>Scanned</Text>
                <Text style={styles.codeValue}>{f1Model.scannedCodeType}</Text>
                <Text style={styles.codeNumber}>{f1Model.scannedCode}</Text>
              </View>
              <View style={styles.codeBox}>
                <Text style={styles.codeLabel}>Other Code</Text>
                <Text style={styles.codeValue}>{f1Model.otherCodeType}</Text>
                <Text style={styles.codeNumber}>{f1Model.otherCode}</Text>
              </View>
            </View>
          </View>
        )}
        
        {/* No Match Info */}
        {scanned && !f1Model && (
          <View style={styles.noMatchContainer}>
            <Text style={styles.noMatchText}>ℹ️ Not an F1 model code</Text>
            <Text style={styles.noMatchSubText}>This barcode doesn't match any F1 model</Text>
          </View>
        )}
        
        {/* Scan Again Button */}
        {scanned && (
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => { 
              setScanned(false); 
              setData(''); 
              setF1Model(null);
            }}
          >
            <Text style={styles.scanButtonText}>🔄 Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  permissionText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  subText: {
    fontSize: 14,
    color: '#888',
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#FF1801',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  topControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  controlIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  zoomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
  },
  zoomButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButtonText: {
    fontSize: 24,
    color: '#fff',
  },
  zoomInfo: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  zoomLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  zoomValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  zoomSliderContainer: {
    flex: 1,
    position: 'relative',
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  zoomTrack: {
    height: '100%',
    borderRadius: 5,
  },
  zoomFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#FF1801',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  dataText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  f1InfoContainer: {
    backgroundColor: '#FF1801',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  f1Title: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  f1ModelText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  codeBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    flex: 0.45,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  codeValue: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 2,
  },
  codeNumber: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  noMatchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  noMatchText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  noMatchSubText: {
    fontSize: 12,
    color: '#888',
  },
  scanButton: {
    backgroundColor: '#FF1801',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});