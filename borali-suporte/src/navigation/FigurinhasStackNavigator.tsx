import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FigurinhasListScreen from '../screens/FigurinhasListScreen';
import FigurinhaFormScreen from '../screens/FigurinhaFormScreen';

const Stack = createNativeStackNavigator();

export default function FigurinhasStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FigurinhasList" component={FigurinhasListScreen} />
      <Stack.Screen name="FigurinhaForm" component={FigurinhaFormScreen} />
    </Stack.Navigator>
  );
}
