import React, { useState } from 'react';
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
  Alert,
} from 'react-native';
import { registerStyles } from '../../styles/registerStyles';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { apiService } from '../../services/apiService';

type RegisterScreenProps = {
  navigation?: any;
};

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const theme = useTheme();
  const styles = useThemedStyles(registerStyles);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  // Kayıt formundaki alanların doluluğunu, şifre uzunluğunu ve şifre
  // eşleşmesini kontrol eder
  const validateForm = (): boolean => {
    if (!fullName.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Tüm alanları doldurmanız gerekmektedir.');
      return false;
    }
    if (password.length < 8) {
      setErrorMessage('Şifre en az 8 karakter olmalıdır.');
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Şifreler eşleşmiyor.');
      return false;
    }
    return true;
  };

  // Kayıt Ol butonuna basıldığında çalışır: formu doğrular, backend'e kayıt
  // isteği atar ve başarılı olursa kullanıcıyı giriş ekranına yönlendirir.
  const handleRegister = async () => {
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await apiService.register(fullName.trim(), username.trim(), password);

      Alert.alert(
        'Başarılı',
        'Hesabınız başarıyla oluşturuldu. Giriş yapabilirsiniz.',
        [
          {
            text: 'Giriş Yap',
            onPress: () => {
              if (navigation) {
                navigation.navigate('Login');
              } else {
                console.log('Registered successfully! No navigation provided.');
              }
            },
          },
        ]
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Kayıt işlemi başarısız. Lütfen tekrar deneyin.',
      );
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

            <Text style={styles.title}>Kayıt Ol</Text>
            <Text style={styles.subtitle}>Yeni bir hesap oluşturun</Text>

            {/* Ad Soyad Giriş Alanı */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ad Soyad</Text>
              <TextInput
                style={[
                  styles.input,
                  isNameFocused && styles.inputFocused,
                ]}
                placeholder="Adınızı ve soyadınızı girin"
                placeholderTextColor={theme.colors.placeholder}
                value={fullName}
                onChangeText={setFullName}
                editable={!loading}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
              />
            </View>

            {/* Kullanıcı Adı Giriş Alanı */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Kullanıcı Adı</Text>
              <TextInput
                style={[
                  styles.input,
                  isUsernameFocused && styles.inputFocused,
                ]}
                placeholder="Bir kullanıcı adı belirleyin"
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
                placeholder="En az 8 karakter şifre girin"
                placeholderTextColor={theme.colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
            </View>

            {/* Şifre Tekrar Giriş Alanı */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Şifre Tekrar</Text>
              <TextInput
                style={[
                  styles.input,
                  isConfirmPasswordFocused && styles.inputFocused,
                ]}
                placeholder="Şifrenizi tekrar girin"
                placeholderTextColor={theme.colors.placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}
              />
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {/* Kayıt Olma Butonu */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Kayıt Ol</Text>
              )}
            </TouchableOpacity>

            {/* Giriş Ekranına Dönüş Linki */}
            <TouchableOpacity
              style={styles.backLink}
              onPress={() => navigation && navigation.navigate('Login')}
              disabled={loading}
            >
              <Text style={styles.backLinkText}>
                Zaten bir hesabınız var mı? <Text style={styles.backLinkHighlight}>Giriş Yap</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default RegisterScreen;
