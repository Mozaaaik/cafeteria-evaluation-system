import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

const ThemedApp = () => {
  const { isDark, colors } = useTheme();
  return (
    <NavigationContainer theme={{
      dark: isDark,
      colors: {
        primary: colors.primary,
        background: isDark ? '#0F172A' : '#F8FAFC',
        card: isDark ? '#1E293B' : '#FFFFFF',
        text: colors.text,
        border: isDark ? '#334155' : '#CBD5E1',
        notification: '#EF4444',
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '800' },
      },
    }}>
      <AppNavigator />
    </NavigationContainer>
  );
};

// Uygulamanın kök (root) bileşeni.
function App() {
  return (
    // Çentikli (notch) ekranlarda güvenli alanları hesaplamak için gerekli sağlayıcı
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
