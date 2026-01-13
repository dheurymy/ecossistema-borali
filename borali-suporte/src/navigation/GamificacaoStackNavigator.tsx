import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GamificacaoMenuScreen from '../screens/GamificacaoMenuScreen';
import ConquistasStackNavigator from './ConquistasStackNavigator';
import MissoesStackNavigator from './MissoesStackNavigator';
import FigurinhasStackNavigator from './FigurinhasStackNavigator';
import ConfigPontosScreen from '../screens/ConfigPontosScreen';

const Stack = createNativeStackNavigator();

export default function GamificacaoStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GamificacaoMenu" component={GamificacaoMenuScreen} />
      <Stack.Screen name="ConquistasStack" component={ConquistasStackNavigator} />
      <Stack.Screen name="MissoesStack" component={MissoesStackNavigator} />
      <Stack.Screen name="FigurinhasStack" component={FigurinhasStackNavigator} />
      <Stack.Screen name="ConfigPontosScreen" component={ConfigPontosScreen} />
    </Stack.Navigator>
  );
}
