import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConquistasListScreen from '../screens/ConquistasListScreen';
import ConquistaFormScreen from '../screens/ConquistaFormScreen';

export type ConquistasStackParamList = {
  ConquistasList: undefined;
  ConquistaForm: { conquistaId?: string };
};

const Stack = createNativeStackNavigator<ConquistasStackParamList>();

export default function ConquistasStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ConquistasList" component={ConquistasListScreen} />
      <Stack.Screen name="ConquistaForm" component={ConquistaFormScreen} />
    </Stack.Navigator>
  );
}
