import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Camera} from 'react-native-vision-camera';

export const permissionRequest = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Save to Gallery Permission',
          message: 'This app needs access to your gallery to save images.',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Save to gallery permission granted');
      } else {
        Alert.alert('Save to gallery permission denied');
      }
    } else if (Platform.OS === 'ios') {
      const status = await check(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);

      if (status === RESULTS.GRANTED) {
        Alert.alert('Save to gallery permission granted');
      } else if (status === RESULTS.DENIED) {
        const requestStatus = await request(
          PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
        );

        if (requestStatus === RESULTS.GRANTED) {
          Alert.alert('Save to gallery permission denied');
        } else {
          Alert.alert('Save to gallery permission denied');
        }
      } else {
        Alert.alert('Save to gallery permission denied');
      }
    }

    const newCameraPermission = await Camera.requestCameraPermission();

    if (newCameraPermission !== 'authorized') {
      Alert.alert('Please allow camera permission');
    }
  } catch (error) {
    console.log('Error requesting save to gallery permission:', error);
  }
};
