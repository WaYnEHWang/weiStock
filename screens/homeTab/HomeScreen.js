import {Text, View, StyleSheet} from 'react-native';
import React from 'react';

export default function HomeScreen({navigation}) {
  return (
    <View style={styles.container}>
      <Text>HomeScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
