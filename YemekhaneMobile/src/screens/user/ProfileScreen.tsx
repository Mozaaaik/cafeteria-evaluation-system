import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { profileStyles } from '../../styles/profileStyles';
import { apiService, handleAuthError } from '../../services/apiService';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';

type ProfileScreenProps = {
  navigation?: any;
};

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const theme = useTheme();
  const styles = useThemedStyles(profileStyles);
  const [fullName, setFullName] = useState('Yükleniyor...');
  const [username, setUsername] = useState('Yükleniyor...');
  const [role, setRole] = useState('USER');
  const [loading, setLoading] = useState(false);

  // Şifre Değiştirme Formu State'leri
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Ad soyaddaki her kelimenin ilk harfini büyütür (Türkçe'ye özgü
  // "i/İ" ve "ı/I" dönüşümlerini de doğru şekilde uygular)
  const capitalizeName = (name: string): string => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => {
        if (!word) return '';
        const firstChar = word.charAt(0);
        let upperFirst = firstChar.toUpperCase();
        if (firstChar === 'i') upperFirst = 'İ';
        else if (firstChar === 'ı') upperFirst = 'I';
        return upperFirst + word.slice(1);
      })
      .join(' ');
  };

  // Ekran açıldığında hafızada saklanan kullanıcı ad-soyad ve rol
  // bilgilerini okuyup ekranda gösterilecek şekilde hazırlar
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const profile = await apiService.getMyProfile();
        setFullName(capitalizeName(profile.fullName));
        setRole(profile.role);
        setUsername(profile.username);

      } catch (e) {
        console.log('Error reading profile data:', e);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Ad ve Soyadın baş harflerini alan fonksiyon (Avatar için)
  const getInitials = (name: string) => {
    if (!name || name === 'Yükleniyor...') return 'P';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Şifre değiştirme formunu doğrular ve (şimdilik simüle edilmiş) güncelleme
  // isteğini gerçekleştirir
  const handlePasswordChange = async () => {
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('Hata', 'Lütfen tüm şifre alanlarını doldurun.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Hata', 'Yeni şifre en az 8 karakter olmalıdır.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Hata', 'Girdiğiniz yeni şifreler uyuşmuyor.');
      return;
    }

    setPasswordLoading(true);

    try {
      await apiService.changePassword(oldPassword, newPassword);
      setPasswordLoading(false);
      Alert.alert('Başarılı', 'Şifreniz başarıyla güncellenmiştir.', [
        {
          text: 'Tamam',
          onPress: () => {
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
          },
        },
      ]);
    } catch (err: any) {
      setPasswordLoading(false);
      if (await handleAuthError(err, navigation)) return;
      Alert.alert('Hata', err.message || 'Şifre değiştirilemedi.');
    }
  };

  // Kullanıcı çıkışı için onay diyaloğu gösterir; onaylanırsa hafızadaki
  // tüm oturum verilerini temizleyip giriş ekranına yönlendirir
  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet, Çık',
          style: 'destructive',
          onPress: async () => {
            await Promise.all(
              ['authToken', 'userRole', 'userFullName', 'keepLoggedIn'].map(key =>
                AsyncStorage.removeItem(key),
              ),
            );
            if (navigation) {
              navigation.replace('Login');
            }
          },
        },
      ]
    );
  };

  // Önceki ekrana geri döner
  const handleGoBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/arkaplan.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <StatusBar barStyle={theme.colors.statusBar} backgroundColor="transparent" translucent />

        {/* Üst Başlık Bölümü */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Logo Bölümü */}
            <Image
              source={require('../../assets/images/botas_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.8}>
              <Text style={styles.backButtonText}>← Geri</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerTitle}>Profilim</Text>
          <View style={styles.emptyView} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {loading ? (
              <ActivityIndicator size="large" color="#0D9488" style={styles.loader} />
            ) : (
              <>
                {/* Profil Bilgi Kartı */}
                <View style={styles.profileCard}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{getInitials(fullName)}</Text>
                  </View>
                  <Text style={styles.fullNameText}>{fullName}</Text>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{role === 'ADMIN' ? 'YÖNETİCİ' : 'PERSONEL'}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Kullanıcı Adı:</Text>
                    <Text style={styles.infoValue}>@{username}</Text>
                  </View>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Görünüm</Text>
                  <View style={styles.themeRow}>
                    <View style={styles.themeTextContainer}>
                      <Text style={styles.themeTitle}>
                        {theme.isDark ? 'Karanlık Mod' : 'Aydınlık Mod'}
                      </Text>
                      <Text style={styles.themeDescription}>
                        Uygulamanın renk görünümünü değiştirir.
                      </Text>
                    </View>
                    <Switch
                      value={theme.isDark}
                      onValueChange={() => theme.toggleTheme()}
                      trackColor={{ false: '#CBD5E1', true: '#5EEAD4' }}
                      thumbColor={theme.isDark ? '#0D9488' : '#FFFFFF'}
                      accessibilityLabel="Karanlık modu aç veya kapat"
                    />
                  </View>
                </View>

                {/* Şifre Değiştirme Kartı */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Şifreyi Değiştir</Text>

                  {/* Mevcut Şifre Giriş Alanı */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Mevcut Şifre</Text>
                    <TextInput
                      style={[styles.input, focusedField === 'old' && styles.inputFocused]}
                      secureTextEntry
                      placeholder="Mevcut şifrenizi girin"
                      placeholderTextColor={theme.colors.placeholder}
                      value={oldPassword}
                      onChangeText={setOldPassword}
                      onFocus={() => setFocusedField('old')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>

                  {/* Yeni Şifre Giriş Alanı */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Yeni Şifre</Text>
                    <TextInput
                      style={[styles.input, focusedField === 'new' && styles.inputFocused]}
                      secureTextEntry
                      placeholder="Yeni şifre belirleyin (en az 8 karakter)"
                      placeholderTextColor={theme.colors.placeholder}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      onFocus={() => setFocusedField('new')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>

                  {/* Yeni Şifre Onay Giriş Alanı */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Yeni Şifre Tekrar</Text>
                    <TextInput
                      style={[styles.input, focusedField === 'confirm' && styles.inputFocused]}
                      secureTextEntry
                      placeholder="Yeni şifrenizi tekrar girin"
                      placeholderTextColor={theme.colors.placeholder}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      onFocus={() => setFocusedField('confirm')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.submitButton, passwordLoading && styles.submitButtonDisabled]}
                    onPress={handlePasswordChange}
                    disabled={passwordLoading}
                    activeOpacity={0.85}
                  >
                    {passwordLoading ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Şifreyi Güncelle</Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Uygulama Künye Kartı */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Uygulama Hakkında</Text>
                  <View style={styles.appInfoRow}>
                    <Text style={styles.appInfoLabel}>Versiyon:</Text>
                    <Text style={styles.appInfoValue}>1.0.0 (BETA)</Text>
                  </View>
                  <View style={styles.appInfoRow}>
                    <Text style={styles.appInfoLabel}>Geliştirici:</Text>
                    <Text style={styles.appInfoValue}>BOTAŞ Yazılım Ekipleri</Text>
                  </View>
                </View>

                {/* Güvenli Çıkış Yap Butonu */}
                <TouchableOpacity
                  style={[
                    styles.logoutButton,
                    theme.isDark ? styles.logoutButtonDark : styles.logoutButtonLight,
                  ]}
                  onPress={handleLogout}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.logoutButtonText,
                    theme.isDark ? styles.logoutButtonTextDark : styles.logoutButtonTextLight,
                  ]}>
                    Güvenli Çıkış Yap
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ProfileScreen;
