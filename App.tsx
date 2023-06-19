import React, {useEffect} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Dimensions} from 'react-native';
import {useCameraDevices} from 'react-native-vision-camera';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {permissionRequest} from './src/shared/helpers/permissionRequest';
import MainLayout from './src/layout/MainLayout';

const App = (): JSX.Element => {
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    permissionRequest();
  }, []);

  if (!device) {
    return (
      <View style={styles.deviceNotAvailableContainer}>
        <Text>Camera not available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <MainLayout device={device} />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  gestureContainer: {
    flex: 1,
  },
  deviceNotAvailableContainer: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
