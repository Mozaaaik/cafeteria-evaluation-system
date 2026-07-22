import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/user/HomeScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import WeeklyMenuScreen from '../screens/user/WeeklyMenuScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

// Uygulamadaki her ekranın adını ve varsa alacağı parametre tipini tanımlar.
// Bu sayede navigation.navigate() çağrıları TypeScript tarafından denetlenir.
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  UserHome: undefined;
  AdminHome: undefined;
  WeeklyMenu: undefined;
  Profile: undefined;
};

// Ekranlar arasında "yığın" (stack) mantığıyla geçiş yapan navigatör oluşturulur
const Stack = createNativeStackNavigator<RootStackParamList>();

// Uygulamanın tüm ekranlarını ve aralarındaki geçiş sırasını tanımlayan ana navigasyon bileşeni
export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login" // Uygulama açıldığında ilk gösterilecek ekran
      screenOptions={{
        headerShown: false, // Varsayılan üst başlık çubuğunu gizle (ekranlar kendi başlıklarını çiziyor)
      }}
    >
      {/* Kimlik doğrulama ekranları */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Personel (kullanıcı) ekranları */}
      <Stack.Screen name="UserHome" component={HomeScreen} />
      <Stack.Screen name="WeeklyMenu" component={WeeklyMenuScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />

      {/* Yönetici ekranı */}
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
    </Stack.Navigator>
  );
};
