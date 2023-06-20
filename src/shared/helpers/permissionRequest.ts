import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Camera} from 'react-native-vision-camera';

const requestWriteExternalStoragePermission = async () => {
  try {
    const writeExternalStoragePermission =
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    const granted = await PermissionsAndroid.request(
      writeExternalStoragePermission,
      {
        title: 'Write Files Permission',
        message:
          'This app needs permission to write files to your device folders.',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Write files permission granted');
    } else {
      console.log('Write files permission denied');
      const externalStoragePermission =
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
      const grantedPermission = await PermissionsAndroid.request(
        externalStoragePermission,
        {
          title: 'Write Files Permission',
          message:
            'This app needs permission to write files to your device folders.',
          buttonPositive: 'OK',
        },
      );
      if (grantedPermission === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Write files permission granted');
      }
    }
  } catch (error) {
    console.log('Error requesting permissions:', error);
  }
};

export const permissionRequest = async () => {
  try {
    if (Platform.OS === 'android' && Number(Platform.constants.Release) < 13) {
      const writeExternalStoragePermission =
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

      const permissionDenied = await PermissionsAndroid.check(
        writeExternalStoragePermission,
      );

      if (!permissionDenied) {
        Alert.alert(
          'Permission Required',
          'Please allow permission to write files to your device folders.',
          [
            {
              text: 'OK',
              onPress: () => {
                requestWriteExternalStoragePermission();
              },
            },
          ],
          {cancelable: false},
        );
      } else {
        const granted = await PermissionsAndroid.request(
          writeExternalStoragePermission,
          {
            title: 'Write Files Permission',
            message:
              'This app needs permission to write files to your device folders.',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Write files permission granted');
        } else {
          console.log('Write files permission denied');
        }
      }
    } else if (Platform.OS === 'ios') {
      const status = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

      if (status === RESULTS.GRANTED) {
        console.log('Save to gallery permission granted');
      } else if (status === RESULTS.DENIED) {
        const requestStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

        if (requestStatus === RESULTS.GRANTED) {
          console.log('Save to gallery permission denied');
        } else {
          console.log('Save to gallery permission denied');
        }
      } else {
        console.log('Save to gallery permission denied');
      }
    }

    const newCameraPermission = await Camera.requestCameraPermission();

    if (newCameraPermission !== 'authorized') {
      Alert.alert('Please allow camera permission');
    }
  } catch (error) {
    console.log('Error requesting permissions:', error);
  }
};
