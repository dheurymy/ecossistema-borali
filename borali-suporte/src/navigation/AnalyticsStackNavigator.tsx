import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import MapScreen from '../screens/MapScreen';
import PontoFormScreen from '../screens/PontoFormScreen';
import { theme } from '../styles/theme';

export type AnalyticsStackParamList = {
  AnalyticsList: undefined;
  Map: undefined;
  PontoForm: { pontoId?: string } | undefined;
};

const Stack = createNativeStackNavigator<AnalyticsStackParamList>();

export default function AnalyticsStackNavigator() {
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
        name="AnalyticsList"
        component={AnalyticsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
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
