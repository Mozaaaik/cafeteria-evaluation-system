import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginStyles } from '../../styles/loginStyles';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { apiService } from '../../services/apiService';

type LoginScreenProps = {
  navigation?: any; // Projede React Navigation kullanılıyorsa buraya doğru tipi bağlayacağız
};

type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    fullName: string;
    username: string;
    role: 'ADMIN' | 'USER';
  };
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const theme = useTheme();
  const styles = useThemedStyles(loginStyles);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Odaklanılan (focus) alana göre input stilini değiştirmek için kullanılır
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  // kullanıcı daha önce oturumu açık tut'u seçtiyse login ekranını atlaması için;
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const keepLoggedIn = await AsyncStorage.getItem('keepLoggedIn');
        if (keepLoggedIn !== 'true') {
          return;
        }
        const token = await AsyncStorage.getItem('authToken');
        const role = await AsyncStorage.getItem('userRole');
        if (token && role && navigation) {
          if (role === 'ADMIN') {
            navigation.replace('AdminHome');
          } else {
            navigation.replace('UserHome');
          }
        }
      } catch (e) {
        console.log('Error checking login status:', e);
      }
    };
    checkLoginStatus();
  }, [navigation]);

  // Kullanıcı adı ve şifre alanını kontrol et;
  const validateForm = (): boolean => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Kullanıcı adı ve şifre boş bırakılamaz.');
      return false;
    }
    return true;
  };

  // giirş yap ekranında backende istek atar, doğruysa kullanıcı ilgili ekrana yönlendirilir.
  const handleLogin = async () => {
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // HTTP isteği apiService üzerinden gider. Böylece login isteği, token
      // saklama işlemi ve apiService içindeki console.log tek yerde çalışır.
      const data: LoginResponse = await apiService.login(username, password);

      // Token ve kullanıcı bilgileri apiService.login içinde kaydediliyor.
      // Bu ekrana özel olan "oturumu açık tut" tercihini burada saklıyoruz.
      await AsyncStorage.setItem('keepLoggedIn', rememberMe ? 'true' : 'false');

      if (navigation) {
        const role = String(data?.user?.role || '').toUpperCase();
        if (role.includes('ADMIN')) {
          navigation.replace('AdminHome');
        } else {
          navigation.replace('UserHome');
        }
      } else {
        console.log('Logged in successfully:', data?.user?.role);
      }
    } catch (error: any) {
      console.log('[LoginScreen Catch]', error);
      const rawMsg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
      setErrorMessage(rawMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/arkaplan.jpg')}
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ objectPosition: 'left' } as any}
    >
      <SafeAreaView style={styles.overlay}>
        <StatusBar barStyle={theme.colors.statusBar} backgroundColor="transparent" translucent />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <View style={styles.card}>
            {/* Logo Bölümü */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/botas_logo.png')}
                style={styles.logo as any}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Yemekhane Sistemi</Text>
            <Text style={styles.subtitle}>Devam etmek için giriş yapın</Text>

            {/* Kullanıcı Adı Giriş Alanı */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Kullanıcı Adı</Text>
              <TextInput
                style={[
                  styles.input,
                  isUsernameFocused && styles.inputFocused,
                ]}
                placeholder="Kullanıcı adınızı girin"
                placeholderTextColor={theme.colors.placeholder}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!loading}
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
              />
            </View>

            {/* Şifre Giriş Alanı */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Şifre</Text>
              <TextInput
                style={[
                  styles.input,
                  isPasswordFocused && styles.inputFocused,
                ]}
                placeholder="Şifrenizi girin"
                placeholderTextColor={theme.colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
            </View>

            {/* Oturumu Açık Tut Seçeneği */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.8}
              disabled={loading}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkboxCheckmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Oturumu açık tut</Text>
            </TouchableOpacity>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {/* Giriş Yapma Butonu */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Giriş Yap</Text>
              )}
            </TouchableOpacity>

            {/* Kayıt Olma Ekranına Yönlendirme Linki */}
            <TouchableOpacity
              style={styles.registerLink}
              onPress={() => navigation && navigation.navigate('Register')}
              disabled={loading}
            >
              <Text style={styles.registerLinkText}>
                Hesabınız yok mu? <Text style={styles.registerLinkHighlight}>Kayıt Olun</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LoginScreen;

