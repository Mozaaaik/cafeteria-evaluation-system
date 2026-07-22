import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';

// Uygulamanın kök (root) bileşeni.
function App() {
  return (
    // Çentikli (notch) ekranlarda güvenli alanları hesaplamak için gerekli sağlayıcı
    <SafeAreaProvider>
      {/* Ekranlar arası geçişleri (navigasyon) yöneten kapsayıcı */}
      <NavigationContainer>
        {/* Uygulamanın tüm ekranlarının tanımlı olduğu navigasyon yapısı */}
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;