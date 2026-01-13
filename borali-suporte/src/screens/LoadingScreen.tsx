import React, { useEffect } from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { authService } from '../services/authService';
import { theme } from '../styles/theme';

type LoadingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Loading'
>;

type Props = {
  navigation: LoadingScreenNavigationProp;
};

export default function LoadingScreen({ navigation }: Props) {
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isAuth = await authService.isAuthenticated();
      
      // Aguarda um pouco para mostrar a tela de loading
      setTimeout(() => {
        if (isAuth) {
          navigation.replace('MainApp');
        } else {
          navigation.replace('Welcome');
        }
      }, 1500);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      navigation.replace('Welcome');
    }
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Image
        source={require('../../assets/borali-splash.png')}
        style={{
          width: 200,
          height: 200,
          marginBottom: 40,
        }}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color={theme.colors.white} />
    </View>
  );
}
