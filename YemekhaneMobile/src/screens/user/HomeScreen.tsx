import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ImageBackground,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService, handleAuthError } from '../../services/apiService';
import { homeStyles as styles } from '../../styles/homeStyles';

type MenuItem = {
  id: number;
  name: string;
  category: string;
  averageRating: number;
  totalVotes: number;
  userRating: number | null;
};

type HomeScreenProps = {
  navigation?: any;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('BOTAŞ Personeli');
  const [submitting, setSubmitting] = useState(false);
  
  // Bugünün gerçek menü verileri
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Her yemek için verilen puanları tutan state: { [yemekId]: puan }
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [comment, setComment] = useState('');

  // Bugünün yemek menüsünü backend'den çeker; kullanıcı daha önce puan
  // verdiyse bu puanları forma önceden doldurur
  const fetchTodayMenu = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTodayMenu();
      if (data && data.items) {
        setMenuItems(data.items);

        // Kullanıcının varsa veritabanındaki eski puanlarını forma önceden doldur
        const initialRatings: { [key: number]: number } = {};
        data.items.forEach((item: any) => {
          if (item.userRating !== null && item.userRating !== undefined) {
            initialRatings[item.id] = item.userRating;
          }
        });
        setRatings(initialRatings);
      }
    } catch (err) {
      if (await handleAuthError(err, navigation)) return;
      console.log('Error loading today menu:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ekran ilk açıldığında: hafızadan kullanıcı adını okuyup ekranda gösterir
  // ve ardından bugünün menüsünü çeker
  useEffect(() => {
    const fetchUserDataAndMenu = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userFullName');
        if (storedName) {
          setFullName(capitalizeFoodName(storedName));
        }
      } catch {
        console.log('Error reading user data');
      }
      fetchTodayMenu();
    };
    fetchUserDataAndMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Kullanıcı bir yemeğe yıldız ile puan verdiğinde ilgili puanı state'e kaydeder
  const handleRatingSelect = (itemId: number, score: number) => {
    setRatings(prev => ({
      ...prev,
      [itemId]: score,
    }));
  };

  // "Değerlendirmeyi Gönder" butonuna basıldığında çalışır: verilen tüm
  // puanları backend'e gönderir ve menüyü güncel ortalamalarla yeniden çeker
  const handleSubmitEvaluations = async () => {
    // Validate that at least one item was rated
    const ratedCount = Object.keys(ratings).length;
    if (ratedCount === 0) {
      Alert.alert('Uyarı', 'Lütfen değerlendirme göndermek için en az bir yemeğe puan verin.');
      return;
    }

    setSubmitting(true);
    try {
      // Verilen puanları döngüyle API servislerine gönder
      const promises = Object.entries(ratings).map(([itemIdStr, score]) => {
        const itemId = parseInt(itemIdStr, 10);
        return apiService.submitEvaluation(itemId, score, comment || '');
      });

      await Promise.all(promises);

      Alert.alert(
        'Teşekkür Ederiz',
        'Bugünkü yemekhane değerlendirmeleriniz başarıyla kaydedildi.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              setComment('');
              // Ortalama puanları ve toplam oy sayılarını güncellemek için menüyü yeniden çek
              fetchTodayMenu();
            },
          },
        ]
      );
    } catch (err: any) {
      if (await handleAuthError(err, navigation)) {
        Alert.alert('Oturum Sona Erdi', 'Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.');
        return;
      }
      Alert.alert('Hata', err.message || 'Değerlendirme gönderilirken hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  // Belirtilen yemek için 1-5 arası tıklanabilir yıldız ikonlarını oluşturur
  const renderRatingStars = (itemId: number) => {
    const currentRating = ratings[itemId] || 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRatingSelect(itemId, i)}
          style={styles.starButton}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.starIcon,
            i <= currentRating ? styles.starIconActive : styles.starIconInactive
          ]}>
            ★
          </Text>
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  // Yemek kategorisine göre rozet (badge) rengini döner
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'SOUP':
      case 'Çorba': return '#38BDF8'; // Sky Blue
      case 'MAIN_DISH':
      case 'Ana Yemek': return '#F59E0B'; // Amber
      case 'SIDE_DISH':
      case 'Yardımcı Yemek': return '#10B981'; // Emerald
      case 'DESSERT':
      case 'Tatlı/Meyve': return '#EC4899'; // Pink
      default: return '#94A3B8';
    }
  };

  // Backend'den gelen İngilizce kategori kodunu ekranda gösterilecek
  // Türkçe kategori adına çevirir
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'SOUP': return 'Çorba';
      case 'MAIN_DISH': return 'Ana Yemek';
      case 'SIDE_DISH': return 'Yardımcı Yemek';
      case 'DESSERT': return 'Tatlı/Meyve';
      default: return category;
    }
  };

  // Yemek adındaki her kelimenin ilk harfini büyütür (Türkçe'ye özgü
  // "i/İ" ve "ı/I" dönüşümlerini de doğru şekilde uygular)
  const capitalizeFoodName = (name: string): string => {
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

  return (
    <ImageBackground
      source={require('../../assets/images/arkaplan.jpg')}
      style={styles.container}
      resizeMode="cover"
      imageStyle={{ objectPosition: 'left' } as any}
    >
      <SafeAreaView style={styles.overlay}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        
        {/* Karşılama ve Profil Başlığı Bölümü */}
        <View style={styles.header}>
          
          <View style={styles.headerLeft}>
            {/* Logo Bölümü */}
            <Image
              source={require('../../assets/images/botas_logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Hoş Geldiniz,</Text>
              <Text style={styles.userNameText}>{fullName}</Text>
            </View>
          </View>


          <TouchableOpacity 
            style={styles.profileButton} 
            onPress={() => navigation && navigation.navigate('Profile')} 
            activeOpacity={0.8}
          >
            <Text style={styles.profileButtonText}>Profilim 👤</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Günün Menüsü Başlık Kartı */}
            <View style={styles.titleCard}>
              <View style={styles.titleRow}>
                <View style={styles.titleCol}>
                  <Text style={styles.menuDateText}>
                    {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                  <Text style={styles.menuTitleText}>Günün Menüsü</Text>
                </View>
                <TouchableOpacity
                  style={styles.weeklyButton}
                  onPress={() => navigation && navigation.navigate('WeeklyMenu')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.weeklyButtonText}>Haftalık Menü 📅</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.menuSubtitleText}>Yemekleri değerlendirmek için yıldızlara dokunun</Text>
            </View>

            {/* Yemek Listesi ve Oylama Kartları */}
            {loading ? (
              <ActivityIndicator size="large" color="#0D9488" style={{ marginVertical: 30 }} />
            ) : menuItems.length > 0 ? (
              menuItems.map(item => (
                <View key={item.id} style={styles.foodCard}>
                  <View style={styles.foodHeader}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                      <Text style={styles.categoryBadgeText}>{getCategoryDisplayName(item.category)}</Text>
                    </View>
                    <Text style={styles.statsText}>
                      ⭐ {(item.averageRating || 0).toFixed(1)} ({item.totalVotes} oy)
                    </Text>
                  </View>
                  
                  <Text style={styles.foodName}>{capitalizeFoodName(item.name)}</Text>
                  
                  <View style={styles.ratingSection}>
                    <Text style={styles.rateLabel}>Senin Puanın:</Text>
                    {renderRatingStars(item.id)}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Bugün için yemekhane menüsü girilmemiştir.</Text>
              </View>
            )}

            {/* Genel Görüş ve Yorum Gönderme Alanı */}
            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>Genel Görüş ve Önerileriniz</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Yemek kalitesi, porsiyon, sıcaklık veya servis hakkındaki düşüncelerinizi yazın..."
                placeholderTextColor="#475569"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmitEvaluations}
                disabled={submitting}
                activeOpacity={0.85}
              >
                {submitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.submitButtonText}>Değerlendirmeyi Gönder</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default HomeScreen;


