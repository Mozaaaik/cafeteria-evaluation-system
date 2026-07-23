import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { apiService, handleAuthError } from '../../services/apiService';
import { weeklyStyles as styles } from '../../styles/weeklyStyles';

type MenuItem = {
  id: number;
  name: string;
  category: 'Çorba' | 'Ana Yemek' | 'Yardımcı Yemek' | 'Tatlı/Meyve';
};

type Menu = {
  id: number;
  menuDate: string;
  items: MenuItem[];
};

type WeeklyMenuScreenProps = {
  navigation?: any;
};

// Tarihi YYYY-MM-DD formatına çeviren yardımcı fonksiyondur
const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Verilen tarihin ait olduğu haftanın Pazartesi gününü bulur
const getMonday = (d: Date): Date => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Pazartesi gününü bul
  return new Date(date.setDate(diff));
};

const WeeklyMenuScreen = ({ navigation }: WeeklyMenuScreenProps) => {
  const [currentWeekMonday, setCurrentWeekMonday] = useState<Date>(getMonday(new Date()));
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // currentWeekMonday state'inden başlayarak haftanın günlerini hesaplar (Pazartesi - Cuma)
  const getWeekDays = () => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      const day = new Date(currentWeekMonday);
      day.setDate(currentWeekMonday.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const startDateStr = formatDateString(weekDays[0]);
  const endDateStr = formatDateString(weekDays[4]);

  // Seçili hafta değiştiğinde (ileri/geri gidildiğinde) o haftanın
  // Pazartesi-Cuma menülerini backend'den çeker
  useEffect(() => {
    const fetchWeeklyMenu = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiService.getMenusByRange(startDateStr, endDateStr);
        setMenus(data);
      } catch (err: any) {
        if (await handleAuthError(err, navigation)) return;
        setError('Haftalık menü yüklenirken hata oluştu.');
        console.log('Error fetching weekly menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyMenu();
  }, [currentWeekMonday, startDateStr, endDateStr, navigation]);

  // Bir önceki haftaya geçer
  const handlePrevWeek = () => {
    const prevMonday = new Date(currentWeekMonday);
    prevMonday.setDate(currentWeekMonday.getDate() - 7);
    setCurrentWeekMonday(prevMonday);
  };

  // Bir sonraki haftaya geçer
  const handleNextWeek = () => {
    const nextMonday = new Date(currentWeekMonday);
    nextMonday.setDate(currentWeekMonday.getDate() + 7);
    setCurrentWeekMonday(nextMonday);
  };

  // Önceki ekrana geri döner
  const handleGoBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  // Yemek kategorisine göre rozet (badge) rengini döner
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'SOUP':
      case 'Çorba': return '#38BDF8';
      case 'MAIN_COURSE':
      case 'MAIN_DISH':
      case 'Ana Yemek': return '#F59E0B';
      case 'SIDE_DISH':
      case 'Yardımcı Yemek': return '#10B981';
      case 'DESSERT_OR_FRUIT':
      case 'DESSERT':
      case 'Tatlı/Meyve': return '#EC4899';
      default: return '#94A3B8';
    }
  };

  // Backend'den gelen İngilizce kategori kodunu ekranda gösterilecek
  // Türkçe kategori adına çevirir
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'SOUP': return 'Çorba';
      case 'MAIN_COURSE': return 'Ana Yemek';
      case 'MAIN_DISH': return 'Ana Yemek';
      case 'SIDE_DISH': return 'Yardımcı Yemek';
      case 'DESSERT_OR_FRUIT': return 'Tatlı veya Meyve';
      case 'DESSERT': return 'Tatlı veya Meyve';
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

  // Belirli bir tarihin menüsünü arar
  const getMenuForDay = (dateStr: string): Menu | undefined => {
    return menus.find(m => m.menuDate === dateStr);
  };

  // Ekran başlığında gösterilecek "başlangıç - bitiş" tarih aralığı metnini oluşturur
  const formatHeaderDateRange = () => {
    const start = weekDays[0].toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    const end = weekDays[4].toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${start} - ${end}`;
  };

  return (
    <ImageBackground
      source={require('../../assets/images/arkaplan.jpg')}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.overlay}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

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
          <Text style={styles.headerTitle}>Haftalık Yemek Listesi</Text>
          <View style={styles.emptyView} />
        </View>

        {/* Haftalık Tarih Gezgini (Calendar Navigator) */}
        <View style={styles.weekNavigator}>
          <TouchableOpacity style={styles.navButton} onPress={handlePrevWeek} activeOpacity={0.7}>
            <Text style={styles.navButtonText}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.weekText}>{formatHeaderDateRange()}</Text>
          <TouchableOpacity style={styles.navButton} onPress={handleNextWeek} activeOpacity={0.7}>
            <Text style={styles.navButtonText}>▶</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0D9488" />
            <Text style={styles.loaderText}>Haftalık yemek listesi yükleniyor...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={() => setCurrentWeekMonday(getMonday(currentWeekMonday))}
            >
              <Text style={styles.retryText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={weekDays}
            keyExtractor={(item) => formatDateString(item)}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const dateStr = formatDateString(item);
              const dayMenu = getMenuForDay(dateStr);
              const isToday = formatDateString(new Date()) === dateStr;

              return (
                <View style={[styles.dayCard, isToday && styles.todayCard]}>
                  {/* Gün Başlığı */}
                  <View style={styles.dayHeader}>
                    <Text style={[styles.dayName, isToday && styles.todayText]}>
                      {item.toLocaleDateString('tr-TR', { weekday: 'long' })}
                    </Text>
                    <Text style={styles.dayDate}>
                      {item.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                    </Text>
                  </View>

                  {/* Günün Yemekleri */}
                  {dayMenu && dayMenu.items && dayMenu.items.length > 0 ? (
                    <View style={styles.foodList}>
                      {dayMenu.items.map((food) => (
                        <View key={food.id} style={styles.foodRow}>
                          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(food.category) }]}>
                            <Text style={styles.categoryBadgeText}>{getCategoryDisplayName(food.category)}</Text>
                          </View>
                          <Text style={styles.foodName}>{capitalizeFoodName(food.name)}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.noMenuContainer}>
                      <Text style={styles.noMenuText}>Bu gün için menü girilmemiştir.</Text>
                    </View>
                  )}
                </View>
              );
            }}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WeeklyMenuScreen;

