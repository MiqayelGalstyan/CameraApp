import React, {useRef, useState} from 'react';
import ShowCamera from '../components/ShowCamera';
import {
  Alert,
  Dimensions,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import {captureRef} from 'react-native-view-shot';
import {request, PERMISSIONS} from 'react-native-permissions';
import {ActionSheetRef} from 'react-native-actions-sheet';
import {Camera, CameraDevice} from 'react-native-vision-camera';
import ImageEditor from '../components/ImageEditor';

interface IMainLayout {
  device: CameraDevice;
}

const MainLayout = ({device}: IMainLayout): JSX.Element => {
  const [cameraVisible, setCameraVisible] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [imagePath, setImagePath] = useState<string>('');

  const componentRef = useRef<React.MutableRefObject<null | any>>(null);
  const sheetRef = useRef<ActionSheetRef>(null);
  const cameraRef = useRef<Camera | null>(null);

  const capturePhoto = async () => {
    setLoading(true);
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({});
      setImagePath(photo.path);
      setLoading(false);
      setCameraVisible(false);
    }
  };

  const handleShowCamera = () => {
    setCameraVisible(true);
  };

  const saveBtnHandler = async () => {
    try {
      const uri = await captureRef(componentRef, {
        format: 'jpg',
        quality: 0.8,
      });
      const uniqueId = Date.now();
      const filename = `${uniqueId}.jpg`;
      let destinationPath;

      if (Platform.OS === 'android') {
        if (Number(Platform.constants.Release) < 13) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Save folder Permission',
              message: 'App needs access to your library folder ,please allow',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert(
              '',
              'App needs access to your library folder ,please allow',
              [
                {
                  text: 'Ok',
                  onPress: () => Linking.openSettings(),
                },
              ],
              {cancelable: false},
            );
            return;
          } else {
            destinationPath = `${RNFS.DownloadDirectoryPath}/${filename}`;
          }
        } else {
          destinationPath = `${RNFS.DownloadDirectoryPath}/${filename}`;
        }
      } else {
        const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;

        const permissionStatus = await request(permission);

        if (permissionStatus === 'granted') {
          destinationPath = `${RNFS.LibraryDirectoryPath}/${filename}`;
        }
      }

      await RNFS.moveFile(uri, destinationPath as string);
      Alert.alert('Image saved successfully!');
      setCameraVisible(true);
    } catch (error) {
      Alert.alert(
        'Error while capturing and saving the image:',
        error?.toString(),
      );
    }
  };

  return (
    <>
      <View style={styles.container}>
        {cameraVisible ? (
          <ShowCamera
            cameraVisible={cameraVisible}
            cameraRef={cameraRef}
            device={device as CameraDevice}
            capturePhoto={capturePhoto}
          />
        ) : (
          <ImageEditor
            componentRef={componentRef}
            handleShowCamera={handleShowCamera}
            imagePath={imagePath}
            saveBtnHandler={saveBtnHandler}
            loading={loading}
            sheetRef={sheetRef}
          />
        )}
      </View>
    </>
  );
};

export default MainLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
  },
});
