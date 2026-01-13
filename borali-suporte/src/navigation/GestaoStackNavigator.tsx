import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GestaoMenuScreen from '../screens/GestaoMenuScreen';
import UsersStackNavigator from './UsersStackNavigator';
import PontosStackNavigator from './PontosStackNavigator';
import NegociosStackNavigator from './NegociosStackNavigator';
import CuponsStackNavigator from './CuponsStackNavigator';

const Stack = createNativeStackNavigator();

export default function GestaoStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GestaoMenu" component={GestaoMenuScreen} />
      <Stack.Screen name="UsersStack" component={UsersStackNavigator} />
      <Stack.Screen name="PontosStack" component={PontosStackNavigator} />
      <Stack.Screen name="NegociosStack" component={NegociosStackNavigator} />
      <Stack.Screen name="CuponsStack" component={CuponsStackNavigator} />
    </Stack.Navigator>
  );
}
