/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import CloseIcon from './assets/icons/close.svg';
import TextIcon from './assets/icons/textIcon.png';
import StickerIcon from './assets/icons/stickerIcon.svg';
import {ISticker} from './src/shared/models/interface/sticker.interface';
import StickersPicker from './src/components/StickersPicker';
import {ActionSheetRef} from 'react-native-actions-sheet';
import ResizableSticker from './src/components/ResizableSticker';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = (): JSX.Element => {
  const cameraRef = useRef<Camera | null>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const sheetRef = useRef<ActionSheetRef>(null);

  const [showCamera, setShowCamera] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [imagePath, setImagePath] = useState<string>('');
  const [_, setSelectedItem] = useState<any | null>(null);
  const [selectedItemsList, setSelectedItemsList] = useState<any[]>([]);

  const checkPermission = useCallback(async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    console.log(newCameraPermission);
    return;
  }, []);

  useEffect(() => {
    checkPermission();
  }, []);

  const capturePhoto = async () => {
    setLoading(true);
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({});
      setImagePath(photo.path);
      setLoading(false);
      setShowCamera(false);
    }
  };

  const handleShowCamera = () => {
    setShowCamera(true);
  };

  const handleOpen = (): void => {
    sheetRef.current?.show();
  };

  const handleClose = (): void => {
    sheetRef?.current?.hide();
  };

  const handleSelect = (event: any, item: ISticker) => {
    console.log(item, 'item');
    setSelectedItem(item);
    setSelectedItemsList([...selectedItemsList, item]);
    Keyboard.dismiss();
    handleClose();
  };

  const saveBtnHandler = () => {
    console.log('save');
  };

  const generateContent = useCallback((): JSX.Element => {
    return !loading && imagePath ? (
      <>
        <Image
          style={styles.image}
          source={{
            uri: `file://'${imagePath}`,
          }}
        />
        {selectedItemsList.length > 0 ? (
          <View style={styles.stickersContainer}>
            {selectedItemsList.map((item, index) => (
              <ResizableSticker key={index} source={item.path} />
            ))}
          </View>
        ) : null}
        <View style={styles.backButton}>
          <TouchableOpacity style={styles.closeBtn} onPress={handleShowCamera}>
            <CloseIcon height={40} color="white" width={40} />
          </TouchableOpacity>
        </View>
        <StickersPicker
          handleSelect={handleSelect}
          handleClose={handleClose}
          bottomSheetRef={sheetRef as any}
        />
        <View style={styles.imageEditingButtons}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => console.log('text icon')}>
            <Image
              source={TextIcon}
              style={{width: 40, height: 40}}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={handleOpen}>
            <StickerIcon
              height={40}
              stroke={'white'}
              fill={'darkgray'}
              width={40}
            />
          </TouchableOpacity>
        </View>
        {selectedItemsList.length > 0 ? (
          <TouchableOpacity style={styles.saveBtn} onPress={saveBtnHandler}>
            <Text>Save in the gallery</Text>
          </TouchableOpacity>
        ) : null}
      </>
    ) : (
      <View style={{flex: 1}}>
        <Text>loading</Text>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }, [
    imagePath,
    loading,
    sheetRef.current,
    handleClose,
    handleSelect,
    selectedItemsList,
  ]);

  if (!device) {
    return (
      <View style={styles.deviceNotAvailableContainer}>
        <Text>Camera not available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <GestureHandlerRootView style={{flex: 1}}>
        <View style={styles.container}>
          {showCamera ? (
            <>
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={showCamera}
                photo={true}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.camButton}
                  onPress={() => capturePhoto()}
                />
              </View>
            </>
          ) : (
            <>{generateContent()}</>
          )}
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  deviceNotAvailableContainer: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
  },
  button: {
    backgroundColor: 'gray',
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    top: 0,
    padding: 20,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 5,
    padding: 20,
    position: 'absolute',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  camButton: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    padding: 5,
    alignSelf: 'center',
    borderWidth: 5,
    borderColor: 'white',
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 9 / 16,
  },
  closeBtn: {
    padding: 10,
    width: 100,
    marginTop: 50,
  },
  retakeBtn: {
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#77c3ec',
  },
  usePhotoBtn: {
    backgroundColor: '#77c3ec',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
  },
  btnText: {
    color: 'white',
    fontWeight: '500',
  },
  retakeBtnText: {
    color: '#77c3ec',
    fontWeight: '500',
  },
  imageEditingButtons: {
    backgroundColor: 'rgba(0,0,0,0.0)',
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    transform: [{translateY: 0}],
    padding: 20,
  },
  stickersContainer: {
    position: 'absolute',
    top: 100,
    left: 100,
    height: '100%',
    width: '100%',
    zIndex: 2,
  },
  deleteButton: {
    position: 'absolute',
    top: -50,
    right: 0,
    left: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'absolute',
    bottom: 46,
    width: '85%',
  },
  saveBtnText: {
    color: '#202020',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default App;
