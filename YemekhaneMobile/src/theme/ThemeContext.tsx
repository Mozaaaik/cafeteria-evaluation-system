import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

export type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'appTheme';

export const darkColors = {
  primary: '#0D9488',
  text: '#F8FAFC',
  secondaryText: '#94A3B8',
  placeholder: '#475569',
  statusBar: 'light-content' as const,
};

export const lightColors = {
  primary: '#0F766E',
  text: '#0F172A',
  secondaryText: '#475569',
  placeholder: '#64748B',
  statusBar: 'dark-content' as const,
};

type ThemeContextValue = {
  mode: ThemeMode;
  isDark: boolean;
  colors: Omit<typeof darkColors, 'statusBar'> & {
    statusBar: 'light-content' | 'dark-content';
  };
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const [mode, setModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then(savedMode => {
      if (savedMode === 'light' || savedMode === 'dark') setModeState(savedMode);
    });
  }, []);

  const setMode = async (nextMode: ThemeMode) => {
    setModeState(nextMode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
  };

  const value = useMemo<ThemeContextValue>(() => ({
    mode,
    isDark: mode === 'dark',
    colors: mode === 'dark' ? darkColors : lightColors,
    setMode,
    toggleTheme: () => setMode(mode === 'dark' ? 'light' : 'dark'),
  }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme, ThemeProvider içinde kullanılmalıdır.');
  return context;
};

const lightColorMap: Record<string, string> = {
  '#F8FAFC': '#0F172A',
  '#E2E8F0': '#1E293B',
  '#94A3B8': '#475569',
  '#64748B': '#64748B',
  '#475569': '#64748B',
  '#334155': '#CBD5E1',
  '#0F172A': '#FFFFFF',
  '#0D9488': '#0F766E',
  '#000': '#0F172A',
  'rgba(15, 23, 42, 0.65)': 'rgba(248, 250, 252, 0.88)',
  'rgba(15, 23, 42, 0.7)': 'rgba(248, 250, 252, 0.88)',
  'rgba(15, 23, 42, 0.75)': 'rgba(248, 250, 252, 0.9)',
  'rgba(30, 41, 59, 0.6)': 'rgba(241, 245, 249, 0.96)',
  'rgba(30, 41, 59, 0.85)': 'rgba(255, 255, 255, 0.94)',
  'rgba(30, 41, 59, 0.9)': 'rgba(255, 255, 255, 0.96)',
  'rgba(30, 41, 59, 0.92)': 'rgba(255, 255, 255, 0.97)',
  'rgba(30, 41, 59, 0.95)': '#FFFFFF',
  'rgba(51, 65, 85, 0.3)': 'rgba(148, 163, 184, 0.35)',
  'rgba(51, 65, 85, 0.4)': 'rgba(148, 163, 184, 0.45)',
  'rgba(51, 65, 85, 0.5)': 'rgba(148, 163, 184, 0.55)',
  'rgba(51, 65, 85, 0.6)': 'rgba(148, 163, 184, 0.65)',
  'rgba(51, 65, 85, 0.8)': 'rgba(148, 163, 184, 0.75)',
  'rgba(255, 255, 255, 0.1)': 'rgba(15, 23, 42, 0.06)',
  'rgba(255, 255, 255, 0.15)': 'rgba(15, 23, 42, 0.12)',
};

export const useThemedStyles = <T extends Record<string, any>>(baseStyles: T): T => {
  const { isDark } = useTheme();

  return useMemo(() => {
    if (isDark) return baseStyles;
    const themed: Record<string, any> = {};
    Object.entries(baseStyles).forEach(([key, style]) => {
      const flatStyle = StyleSheet.flatten(style) || {};
      const lightStyle: Record<string, any> = {};
      Object.entries(flatStyle).forEach(([property, value]) => {
        lightStyle[property] = typeof value === 'string' ? (lightColorMap[value] ?? value) : value;
      });
      themed[key] = lightStyle;
    });
    return themed as T;
  }, [baseStyles, isDark]);
};
