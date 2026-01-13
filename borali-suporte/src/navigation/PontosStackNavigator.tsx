import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PontosListScreen from '../screens/PontosListScreen';
import PontoFormScreen from '../screens/PontoFormScreen';
import { theme } from '../styles/theme';

export type PontosStackParamList = {
  PontosList: undefined;
  PontoForm: { pontoId?: string } | undefined;
};

const Stack = createNativeStackNavigator<PontosStackParamList>();

export default function PontosStackNavigator() {
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
        name="PontosList"
        component={PontosListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PontoForm"
        component={PontoFormScreen}
        options={({ route }) => ({
          title: route.params?.pontoId ? 'Editar Ponto' : 'Novo Ponto',
        })}
      />
    </Stack.Navigator>
  );
}
