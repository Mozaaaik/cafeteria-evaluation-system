import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/user/HomeScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import WeeklyMenuScreen from '../screens/user/WeeklyMenuScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  UserHome: undefined;
  AdminHome: undefined;
  WeeklyMenu: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="UserHome" component={HomeScreen} />
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
      <Stack.Screen name="WeeklyMenu" component={WeeklyMenuScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
