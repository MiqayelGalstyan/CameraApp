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
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import CloseIcon from './assets/icons/close.svg';
import TextIcon from './assets/icons/textIcon.svg';
import StickerIcon from './assets/icons/stickerIcon.svg';
import {ISticker} from './src/shared/models/interface/sticker.interface';
import StickersPicker from './src/components/StickersPicker';
import {ActionSheetRef} from 'react-native-actions-sheet';

const App = (): JSX.Element => {
  const cameraRef = useRef<Camera | null>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const sheetRef = useRef<ActionSheetRef>(null);

  const [showCamera, setShowCamera] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [imagePath, setImagePath] = useState<string>('');

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

  const handleSelect = (item: ISticker) => {
    console.log(item, 'item');
  };

  const handleOpen = (): void => {
    sheetRef.current?.show();
  };

  const handleClose = (): void => {
    sheetRef?.current?.hide();
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
            <TextIcon
              height={40}
              width={40}
              color={'black'}
              stroke={'black'}
              fill={'darkgray'}
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
      </>
    ) : (
      <View>
        <Text>loading</Text>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }, [imagePath, loading, sheetRef.current, handleClose, handleSelect]);

  if (!device) {
    return (
      <View style={styles.deviceNotAvailableContainer}>
        <Text>Camera not available</Text>
      </View>
    );
  }

  return (
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
  );
};

const styles = StyleSheet.create({
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
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 5,
    padding: 20,
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
});

export default App;
