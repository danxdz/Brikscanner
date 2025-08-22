import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, Animated } from 'react-native';
import { CameraView, Camera, CameraType } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// F1 Car Models Lookup Table - Each model has 2 separate codes
const F1_CODE_LOOKUP = {
  // Ferrari
  '6536841': { model: 'Ferrari', codeType: 'Code 1', otherCode: '6538305', color: '#DC0000' },
  '6538305': { model: 'Ferrari', codeType: 'Code 2', otherCode: '6536841', color: '#DC0000' },
  
  // RB20
  '6536842': { model: 'RB20', codeType: 'Code 1', otherCode: '6538306', color: '#1E41FF' },
  '6538306': { model: 'RB20', codeType: 'Code 2', otherCode: '6536842', color: '#1E41FF' },
  
  // Mercedes-AMG
  '6536843': { model: 'Mercedes-AMG', codeType: 'Code 1', otherCode: '6538307', color: '#00D2BE' },
  '6538307': { model: 'Mercedes-AMG', codeType: 'Code 2', otherCode: '6536843', color: '#00D2BE' },
  
  // Aston Martin
  '6536844': { model: 'Aston Martin', codeType: 'Code 1', otherCode: '6538308', color: '#006F62' },
  '6538308': { model: 'Aston Martin', codeType: 'Code 2', otherCode: '6536844', color: '#006F62' },
  
  // VCARB
  '6536845': { model: 'VCARB', codeType: 'Code 1', otherCode: '6538309', color: '#2B4562' },
  '6538309': { model: 'VCARB', codeType: 'Code 2', otherCode: '6536845', color: '#2B4562' },
  
  // Sauber
  '6536846': { model: 'Sauber', codeType: 'Code 1', otherCode: '6538310', color: '#00E701' },
  '6538310': { model: 'Sauber', codeType: 'Code 2', otherCode: '6536846', color: '#00E701' },
  
  // Alpine
  '6536847': { model: 'Alpine', codeType: 'Code 1', otherCode: '6538311', color: '#0090FF' },
  '6538311': { model: 'Alpine', codeType: 'Code 2', otherCode: '6536847', color: '#0090FF' },
  
  // Williams
  '6536848': { model: 'Williams', codeType: 'Code 1', otherCode: '6538312', color: '#005AFF' },
  '6538312': { model: 'Williams', codeType: 'Code 2', otherCode: '6536848', color: '#005AFF' },
  
  // Haas
  '6536849': { model: 'Haas', codeType: 'Code 1', otherCode: '6538313', color: '#FFFFFF' },
  '6538313': { model: 'Haas', codeType: 'Code 2', otherCode: '6536849', color: '#FFFFFF' },
  
  // McLaren
  '6536850': { model: 'McLaren', codeType: 'Code 1', otherCode: '6538314', color: '#FF8700' },
  '6538314': { model: 'McLaren', codeType: 'Code 2', otherCode: '6536850', color: '#FF8700' },
  
  // F1
  '6536851': { model: 'F1', codeType: 'Code 1', otherCode: '6538315', color: '#FF1801' },
  '6538315': { model: 'F1', codeType: 'Code 2', otherCode: '6536851', color: '#FF1801' },
  
  // Pirelli
  '6536852': { model: 'Pirelli', codeType: 'Code 1', otherCode: '6538316', color: '#FFD800' },
  '6538316': { model: 'Pirelli', codeType: 'Code 2', otherCode: '6536852', color: '#FFD800' },
  
  // Silverstone
  '6536853': { model: 'Silverstone', codeType: 'Code 1', otherCode: '6538317', color: '#DA291C' },
  '6538317': { model: 'Silverstone', codeType: 'Code 2', otherCode: '6536853', color: '#DA291C' },
  
  // Monaco
  '6536854': { model: 'Monaco', codeType: 'Code 1', otherCode: '6538318', color: '#CE1126' },
  '6538318': { model: 'Monaco', codeType: 'Code 2', otherCode: '6536854', color: '#CE1126' },
};

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [data, setData] = useState('');
  const [zoom, setZoom] = useState(0);
  const [flashOn, setFlashOn] = useState(false);
  const [f1Model, setF1Model] = useState(null);
  const [cameraFacing, setCameraFacing] = useState(CameraType.back);
  const [isSwitching, setIsSwitching] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (scanned) {
      // Animate result card appearance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
    }
  }, [scanned]);

  const getF1Model = (code) => {
    const modelInfo = F1_CODE_LOOKUP[code];
    if (modelInfo) {
      return {
        model: modelInfo.model,
        scannedCode: code,
        scannedCodeType: modelInfo.codeType,
        otherCode: modelInfo.otherCode,
        otherCodeType: modelInfo.codeType === 'Code 1' ? 'Code 2' : 'Code 1',
        color: modelInfo.color
      };
    }
    return null;
  };

  const handleBarcodeScanned = ({ type, data }) => {
    if (!scanned && !isSwitching) {
      setScanned(true);
      setData(data);
      
      // Check if this is an F1 model code
      const model = getF1Model(data);
      setF1Model(model);
    }
  };

  const toggleFlash = () => {
    if (cameraFacing === CameraType.back) {
      setFlashOn((prev) => !prev);
    }
  };
  
  const toggleCamera = async () => {
    if (isSwitching) return;
    
    setIsSwitching(true);
    
    // Add a small delay to prevent rapid switching
    setTimeout(() => {
      setCameraFacing(current => 
        current === CameraType.back ? CameraType.front : CameraType.back
      );
      // Turn off flash when switching to front camera
      if (cameraFacing === CameraType.back) {
        setFlashOn(false);
      }
      
      // Reset switching state after animation
      setTimeout(() => {
        setIsSwitching(false);
      }, 500);
    }, 100);
  };

  const resetScanner = () => {
    setScanned(false);
    setData('');
    setF1Model(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loadingIcon}>📸</Text>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorIcon}>🚫</Text>
        <Text style={styles.permissionText}>No camera access</Text>
        <Text style={styles.subText}>Please enable camera access in settings</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Camera View with opacity transition during switch */}
      <View style={[styles.cameraContainer, isSwitching && styles.cameraSwitching]}>
        <CameraView
          ref={cameraRef}
          style={styles.scanner}
          facing={cameraFacing}
          onBarcodeScanned={scanned || isSwitching ? undefined : handleBarcodeScanned}
          zoom={zoom}
          enableTorch={flashOn && cameraFacing === CameraType.back}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417", "code128", "code39", "code93", "codabar", "ean13", "ean8", "upc_e", "datamatrix", "aztec"],
          }}
        />
      </View>
      
      {/* Gradient Overlay */}
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />
      
      {/* Scan Frame Overlay */}
      {!scanned && (
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            <Text style={styles.scanHint}>
              {isSwitching ? 'Switching camera...' : 'Align barcode within frame'}
            </Text>
          </View>
        </View>
      )}
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏎️ F1 Scanner</Text>
        <Text style={styles.headerSubtitle}>
          {cameraFacing === CameraType.back ? 'Back Camera' : 'Front Camera'}
        </Text>
      </View>
      
      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity 
          style={[
            styles.controlButton, 
            styles.controlButtonPrimary,
            isSwitching && styles.controlButtonDisabled
          ]} 
          onPress={toggleCamera}
          activeOpacity={0.8}
          disabled={isSwitching}
        >
          <Text style={styles.controlIcon}>
            {isSwitching ? '⏳' : '🔄'}
          </Text>
          <Text style={styles.controlLabel}>
            {isSwitching ? 'Wait...' : (cameraFacing === CameraType.back ? 'Front' : 'Back')}
          </Text>
        </TouchableOpacity>
        
        {cameraFacing === CameraType.back && (
          <TouchableOpacity 
            style={[styles.controlButton, flashOn && styles.controlButtonActive]} 
            onPress={toggleFlash}
            activeOpacity={0.8}
          >
            <Text style={styles.controlIcon}>{flashOn ? '🔦' : '💡'}</Text>
            <Text style={styles.controlLabel}>Flash</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* Bottom Container */}
      <View style={[styles.bottomContainer, scanned && styles.bottomContainerExpanded]}>
        {/* Zoom Controls */}
        {!scanned && (
          <View style={styles.zoomContainer}>
            <TouchableOpacity 
              style={styles.zoomButton} 
              onPress={() => setZoom(Math.max(0, zoom - 0.1))}
              activeOpacity={0.7}
            >
              <Text style={styles.zoomButtonText}>−</Text>
            </TouchableOpacity>
            
            <View style={styles.zoomSliderWrapper}>
              <View style={styles.zoomSliderContainer}>
                <View style={styles.zoomTrack}>
                  <View 
                    style={[styles.zoomFill, { width: `${zoom * 100}%` }]}
                  />
                </View>
                {Platform.OS === 'web' && (
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
                )}
              </View>
              <Text style={styles.zoomValue}>{(zoom * 100).toFixed(0)}%</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.zoomButton} 
              onPress={() => setZoom(Math.min(1, zoom + 0.1))}
              activeOpacity={0.7}
            >
              <Text style={styles.zoomButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Status Text */}
        {!scanned && (
          <View style={styles.statusContainer}>
            <View style={[styles.pulsingDot, isSwitching && styles.pulsingDotYellow]} />
            <Text style={styles.statusText}>
              {isSwitching ? 'Switching camera...' : 'Ready to scan'}
            </Text>
          </View>
        )}
        
        {/* Scan Results */}
        {scanned && (
          <Animated.View 
            style={[
              styles.resultContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* F1 Model Info */}
            {f1Model && (
              <View style={[styles.f1InfoContainer, { backgroundColor: f1Model.color || '#FF1801' }]}>
                <View style={styles.f1Header}>
                  <Text style={styles.f1Icon}>🏁</Text>
                  <Text style={styles.f1Title}>F1 Model Detected!</Text>
                  <Text style={styles.f1Icon}>🏁</Text>
                </View>
                <Text style={styles.f1ModelText}>{f1Model.model}</Text>
                
                <View style={styles.codeContainer}>
                  <View style={styles.codeBox}>
                    <Text style={styles.codeLabel}>✅ Scanned</Text>
                    <Text style={styles.codeValue}>{f1Model.scannedCodeType}</Text>
                    <Text style={styles.codeNumber}>{f1Model.scannedCode}</Text>
                  </View>
                  
                  <View style={styles.codeDivider} />
                  
                  <View style={styles.codeBox}>
                    <Text style={styles.codeLabel}>📋 Pair Code</Text>
                    <Text style={styles.codeValue}>{f1Model.otherCodeType}</Text>
                    <Text style={styles.codeNumber}>{f1Model.otherCode}</Text>
                  </View>
                </View>
              </View>
            )}
            
            {/* No Match Info */}
            {!f1Model && (
              <View style={styles.noMatchContainer}>
                <Text style={styles.noMatchIcon}>❓</Text>
                <Text style={styles.noMatchText}>Unknown Barcode</Text>
                <Text style={styles.dataText}>{data}</Text>
                <Text style={styles.noMatchSubText}>This doesn't match any F1 model</Text>
              </View>
            )}
            
            {/* Scan Again Button */}
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={resetScanner}
              activeOpacity={0.8}
            >
              <Text style={styles.scanButtonIcon}>🔄</Text>
              <Text style={styles.scanButtonText}>Scan Another</Text>
            </TouchableOpacity>
          </Animated.View>
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
    backgroundColor: '#0a0a0a',
  },
  loadingIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  permissionText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
  },
  subText: {
    fontSize: 14,
    color: '#888',
  },
  scanner: {
    flex: 1,
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 260,
    height: 260,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderColor: '#FF1801',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 15,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 15,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 15,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 15,
  },
  scanHint: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  topControls: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 15,
  },
  controlButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  controlButtonPrimary: {
    backgroundColor: 'rgba(255, 24, 1, 0.2)',
    borderColor: '#FF1801',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  controlButtonDisabled: {
    opacity: 0.5,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderColor: 'rgba(128, 128, 128, 0.4)',
  },
  controlIcon: {
    fontSize: 20,
  },
  controlLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 35,
  },
  bottomContainerExpanded: {
    paddingTop: 30,
  },
  zoomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  zoomButton: {
    backgroundColor: 'rgba(255, 24, 1, 0.2)',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF1801',
  },
  zoomButtonText: {
    fontSize: 28,
    color: '#FF1801',
    fontWeight: 'bold',
  },
  zoomSliderWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  zoomSliderContainer: {
    flex: 1,
    position: 'relative',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
  },
  zoomTrack: {
    height: '100%',
    borderRadius: 4,
  },
  zoomFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#FF1801',
  },
  zoomValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF1801',
    marginLeft: 15,
    minWidth: 45,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF00',
  },
  pulsingDotYellow: {
    backgroundColor: '#FFD700',
  },
  statusText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  resultContainer: {
    alignItems: 'center',
  },
  f1InfoContainer: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  f1Header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  f1Icon: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  f1Title: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  f1ModelText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  codeDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 10,
  },
  codeLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    fontWeight: '500',
  },
  codeValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  codeNumber: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  noMatchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  noMatchIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  noMatchText: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
    fontWeight: '600',
  },
  dataText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  noMatchSubText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  scanButton: {
    backgroundColor: '#FF1801',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#FF1801',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanButtonIcon: {
    fontSize: 20,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cameraContainer: {
    flex: 1,
    opacity: 1,
  },
  cameraSwitching: {
    opacity: 0.3,
  },
});