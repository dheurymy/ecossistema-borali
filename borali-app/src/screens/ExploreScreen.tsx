import React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../styles/homeStyles';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Explorar</Text>
      <Text style={styles.text}>Descubra novos conteúdos</Text>
    </View>
  );
}
