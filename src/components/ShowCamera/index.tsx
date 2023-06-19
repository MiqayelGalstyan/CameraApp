import React, {LegacyRef} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Camera, CameraDevice} from 'react-native-vision-camera';

interface IShowCameraProps {
  capturePhoto: () => Promise<void>;
  cameraVisible: boolean;
  cameraRef: Camera | null | LegacyRef<Camera>;
  device: CameraDevice;
}

const ShowCamera = ({
  capturePhoto,
  cameraVisible,
  cameraRef,
  device,
}: IShowCameraProps): JSX.Element => {
  return (
    <>
      <Camera
        ref={cameraRef as LegacyRef<Camera>}
        style={StyleSheet.absoluteFill}
        device={device as CameraDevice}
        isActive={cameraVisible}
        photo={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.camButton}
          onPress={() => capturePhoto()}
        />
      </View>
    </>
  );
};

export default ShowCamera;

const styles = StyleSheet.create({
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    bottom: 5,
    padding: 20,
    position: 'absolute',
  },
});
