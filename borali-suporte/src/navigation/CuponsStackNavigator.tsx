import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CuponsListScreen from '../screens/CuponsListScreen';
import CupomFormScreen from '../screens/CupomFormScreen';
import { theme } from '../styles/theme';

export type CuponsStackParamList = {
  CuponsList: undefined;
  CupomForm: { cupomId?: string } | undefined;
};

const Stack = createNativeStackNavigator<CuponsStackParamList>();

export default function CuponsStackNavigator() {
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
        name="CuponsList"
        component={CuponsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CupomForm"
        component={CupomFormScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
