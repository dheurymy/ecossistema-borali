import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NegociosListScreen from '../screens/NegociosListScreen';
import NegocioFormScreen from '../screens/NegocioFormScreen';
import { theme } from '../styles/theme';

export type NegociosStackParamList = {
  NegociosList: undefined;
  NegocioForm: { negocioId?: string } | undefined;
};

const Stack = createNativeStackNavigator<NegociosStackParamList>();

export default function NegociosStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.white,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: theme.fontWeight.bold,
        },
      }}
    >
      <Stack.Screen
        name="NegociosList"
        component={NegociosListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NegocioForm"
        component={NegocioFormScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
