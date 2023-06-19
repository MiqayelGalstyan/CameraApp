import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

const Loader = (): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>loading...</Text>
      <ActivityIndicator size="large" color="orange" />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'darkgray',
    width: '100%',
  },
  text: {
    fontSize: 20,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
  },
});
