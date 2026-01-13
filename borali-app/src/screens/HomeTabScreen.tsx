import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { styles } from '../styles/homeStyles';
import authService from '../services/authService';
import { getFirstName } from '../utils/helpers';

export default function HomeTabScreen() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await authService.getUser();
    if (user) {
      setUserName(getFirstName(user.nome));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Início</Text>
      <Text style={styles.text}>{userName ? `Bem-vindo, ${userName}!` : 'Bem-vindo ao Borali!'}</Text>
    </View>
  );
}
