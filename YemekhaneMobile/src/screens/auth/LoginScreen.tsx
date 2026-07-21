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
import { loginStyles as styles } from '../../styles/loginStyles';

// TODO: Backend ekibiyle netleşince gerçek adresi buraya yaz.
const API_BASE_URL = 'http://10.0.2.2:8080';

type LoginScreenProps = {
  navigation?: any; // Projede React Navigation kullanılıyorsa buraya doğru tipi bağlayacağız
};

type LoginResponse = {
  token: string;
  role: 'ADMIN' | 'USER';
  fullName?: string;
};

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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

  const validateForm = (): boolean => {
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Kullanıcı adı ve şifre boş bırakılamaz.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setErrorMessage('Kullanıcı adı veya şifre hatalı.');
        return;
      }

      const data: LoginResponse = await response.json();

      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem('userRole', data.role);
      await AsyncStorage.setItem('userFullName', data.fullName || 'BOTAŞ Personeli');
      await AsyncStorage.setItem('keepLoggedIn', rememberMe ? 'true' : 'false');

      if (navigation) {
        if (data.role === 'ADMIN') {
          navigation.replace('AdminHome');
        } else {
          navigation.replace('UserHome');
        }
      } else {
        console.log('Logged in successfully (no navigation prop):', data.role);
      }
    } catch {
      setErrorMessage('Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
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
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
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
                placeholderTextColor="#475569"
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
                placeholderTextColor="#475569"
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



