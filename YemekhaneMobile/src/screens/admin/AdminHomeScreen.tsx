import React, { useState, useEffect } from 'react';
import { apiService, handleAuthError } from '../../services/apiService';
import {
  ActivityIndicator,
  FlatList,
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
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adminStyles } from '../../styles/adminStyles';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';

type AdminHomeScreenProps = {
  navigation?: any;
};

// Yemek kategorilerini varsayılan menü sırasına (Çorba -> Ana Yemek -> Yardımcı Yemek -> Tatlı/Meyve) göre sıralar
const CATEGORY_ORDER: { [key: string]: number } = {
  SOUP: 1,
  Çorba: 1,
  MAIN_DISH: 2,
  'Ana Yemek': 2,
  SIDE_DISH: 3,
  'Yardımcı Yemek': 3,
  DESSERT: 4,
  'Tatlı/Meyve': 4,
};

// Bir kategorinin sıralama numarasını döner; tanımsız kategoriler en sona konur
const getCategoryOrder = (cat: string) => CATEGORY_ORDER[cat] || 99;

const AdminHomeScreen = ({ navigation }: AdminHomeScreenProps) => {
  const theme = useTheme();
  const styles = useThemedStyles(adminStyles);
  const [activeTab, setActiveTab] = useState<'editor' | 'reports' | 'feedbacks'>('editor');
  const [loading, setLoading] = useState(false);

  // Form Giriş Alanları State'leri
  const [menuDate, setMenuDate] = useState(new Date().toISOString().split('T')[0]);
  const [soup, setSoup] = useState('');
  const [mainDish, setMainDish] = useState('');
  const [sideDish, setSideDish] = useState('');
  const [dessert, setDessert] = useState('');
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);

  // Form Odaklanma (Focus) State'i
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Gerçek Değerlendirme Raporları State'i
  const [reports, setReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  // Gerçek Geri Bildirim/Yorum State'i
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(false);

  // 1. Girilen tarih için daha önce kaydedilmiş bir menü varsa formu onunla
  //    doldurur (Düzenleme / Edit Desteği), yoksa alanları temizler
  useEffect(() => {
    const checkExistingMenu = async () => {
      if (!menuDate) return;
      try {
        const existingMenu = await apiService.getMenuByDate(menuDate);
        if (existingMenu && existingMenu.items) {
          setSelectedMenuId(existingMenu.id);
          // Önce alanları temizle, sonra doldur
          setSoup('');
          setMainDish('');
          setSideDish('');
          setDessert('');
          
          existingMenu.items.forEach((item: any) => {
            if (item.category === 'Çorba') setSoup(item.name);
            else if (item.category === 'Ana Yemek') setMainDish(item.name);
            else if (item.category === 'Yardımcı Yemek') setSideDish(item.name);
            else if (item.category === 'Tatlı/Meyve') setDessert(item.name);
          });
        }
      } catch (err) {
        if (await handleAuthError(err, navigation)) return;
        // O tarihte menü girilmemişse alanları temiz tut
        setSoup('');
        setMainDish('');
        setSideDish('');
        setDessert('');
        setSelectedMenuId(null);
        console.log('No existing menu for date:', menuDate);
      }
    };

    checkExistingMenu();
  }, [menuDate, navigation]);

  // 2. "Değerlendirmeler" sekmesi seçildiğinde yemek bazlı değerlendirme
  //    raporlarını backend'den çekip ekranda gösterilecek forma çevirir
  useEffect(() => {
    const fetchReports = async () => {
      if (activeTab !== 'reports') return;
      setReportsLoading(true);
      try {
        if (selectedMenuId === null) { setReports([]); return; }
        const data = await apiService.getReports(selectedMenuId);
        const mappedReports = data.map((item: any) => ({
          id: item.menuItemId,
          name: item.mealName,
          category: item.category,
          avgRating: item.averageStars,
          totalVotes: item.totalVotes,
          date: item.menuDate,
        }));
        setReports(mappedReports);
      } catch (err) {
        if (await handleAuthError(err, navigation)) return;
        console.log('Error loading reports:', err);
      } finally {
        setReportsLoading(false);
      }
    };

    fetchReports();
  }, [activeTab, navigation, selectedMenuId]);

  // 3. "Yorumlar" sekmesi seçildiğinde personelin yazdığı genel
  //    değerlendirme/yorumları backend'den çeker
  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (activeTab !== 'feedbacks') return;
      setFeedbacksLoading(true);
      try {
        if (selectedMenuId === null) { setFeedbacks([]); return; }
        const data = await apiService.getCommentReports(selectedMenuId);
        setFeedbacks(data.map((evaluation: any, index: number) => ({
          id: `${selectedMenuId}-${index}`,
          userName: evaluation.personnelName,
          date: menuDate,
          averageScore: evaluation.averageScore,
          comment: evaluation.generalComment,
          items: (evaluation.ratings || []).map((rating: any) => ({
            id: rating.menuItemId,
            name: rating.mealName,
            score: rating.score,
            category: rating.category || '',
          })),
        })));
      } catch (err) {
        if (await handleAuthError(err, navigation)) return;
        console.log('Error loading feedbacks:', err);
      } finally {
        setFeedbacksLoading(false);
      }
    };

    fetchFeedbacks();
  }, [activeTab, menuDate, navigation, selectedMenuId]);

  // Yönetici çıkışı için onay diyaloğu gösterir; onaylanırsa hafızadaki
  // tüm oturum verilerini temizleyip giriş ekranına yönlendirir
  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Yönetici panelinden çıkış yapmak istediğinize emin misiniz?',
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

  // "Menüyü Kaydet" butonuna basıldığında çalışır: form alanlarını doğrular,
  // seçilen tarih için menüyü (çorba, ana yemek, yardımcı yemek, tatlı)
  // backend'e kaydeder
  const handleSaveMenu = async () => {
    if (!menuDate.trim() || !soup.trim() || !mainDish.trim() || !sideDish.trim() || !dessert.trim()) {
      Alert.alert('Hata', 'Lütfen menü tarihini ve tüm yemek alanlarını doldurun.');
      return;
    }

    setLoading(true);
    try {
      /*
       * Backend'deki CreateMenuRequest record'u bir "items" listesi değil,
       * aşağıdaki beş alanı bekliyor. Alan adlarının Java DTO'sundaki adlarla
       * birebir aynı olması Spring'in JSON'u doğru nesneye çevirmesini sağlar.
       */
      const request = {
        menuDate: menuDate.trim(),
        soup: soup.trim(),
        mainCourse: mainDish.trim(),
        sideDish: sideDish.trim(),
        dessertOrFruit: dessert.trim(),
      };
      const savedMenu = selectedMenuId === null
        ? await apiService.saveMenu(request)
        : await apiService.updateMenu(selectedMenuId, request);
      setSelectedMenuId(savedMenu.id);

      // Backend HTTP 201 ile kaydettiği menüyü geri döndürür. Buradaki id,
      // kaydın gerçekten veritabanında oluştuğunu gösteren DailyMenu id'sidir.
      console.log('Veritabanına kaydedilen menü id:', savedMenu.id);
      Alert.alert(
        'Başarılı',
        `${menuDate} tarihli yemek menüsü sisteme başarıyla kaydedildi.`,
        [
          {
            text: 'Tamam',
            onPress: () => {
              // Kaydedilen bilgileri ekranda gösteriyoruz
            },
          },
        ]
      );
    } catch (err: any) {
      if (await handleAuthError(err, navigation)) {
        Alert.alert('Oturum Sona Erdi', 'Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.');
        return;
      }
      Alert.alert('Hata', err.message || 'Menü kaydedilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };
  // Yemek kategorisine göre rozet (badge) rengini döner
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'SOUP':
      case 'Çorba': return '#38BDF8';
      case 'MAIN_DISH':
      case 'MAIN_COURSE':
      case 'Ana Yemek': return '#F59E0B';
      case 'SIDE_DISH':
      case 'Yardımcı Yemek': return '#10B981';
      case 'DESSERT':
      case 'DESSERT_OR_FRUIT':
      case 'Tatlı/Meyve': return '#EC4899';
      default: return '#94A3B8';
    }
  };

  // Backend'den gelen İngilizce kategori kodunu ekranda gösterilecek
  // Türkçe kategori adına çevirir
  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'SOUP': return 'Çorba';
      case 'MAIN_DISH': return 'Ana Yemek';
      case 'MAIN_COURSE': return 'Ana Yemek';
      case 'SIDE_DISH': return 'Yardımcı Yemek';
      case 'DESSERT': return 'Tatlı/Meyve';
      case 'DESSERT_OR_FRUIT': return 'Tatlı/Meyve';
      default: return 'Kategori';
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
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Yönetici Paneli</Text>
              <Text style={styles.userNameText}>BOTAŞ Yemekhane Yetkilisi</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>

        {/* Sekme Kontrolleri */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'editor' && styles.tabButtonActive]}
            onPress={() => setActiveTab('editor')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'editor' && styles.tabTextActive]}>Menü Ekle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'reports' && styles.tabButtonActive]}
            onPress={() => setActiveTab('reports')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'reports' && styles.tabTextActive]}>Değerlendirmeler</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'feedbacks' && styles.tabButtonActive]}
            onPress={() => setActiveTab('feedbacks')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === 'feedbacks' && styles.tabTextActive]}>Yorumlar</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          {activeTab === 'editor' ? (
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.themeCard}>
                <View style={styles.themeCardHeader}>
                  <View>
                    <Text style={styles.themeCardTitle}>Görünüm</Text>
                    <Text style={styles.themeCardSubtitle}>Panel temasını seçin</Text>
                  </View>
                  <Text style={styles.themeCardIcon}>{theme.isDark ? '🌙' : '☀️'}</Text>
                </View>

                <View style={styles.themeOptions}>
                  <TouchableOpacity
                    style={[styles.themeOption, !theme.isDark && styles.themeOptionActive]}
                    onPress={() => theme.setMode('light')}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityState={{ selected: !theme.isDark }}
                  >
                    <Text style={styles.themeOptionIcon}>☀️</Text>
                    <Text style={[styles.themeOptionText, !theme.isDark && styles.themeOptionTextActive]}>
                      Aydınlık
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.themeOption, theme.isDark && styles.themeOptionActive]}
                    onPress={() => theme.setMode('dark')}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityState={{ selected: theme.isDark }}
                  >
                    <Text style={styles.themeOptionIcon}>🌙</Text>
                    <Text style={[styles.themeOptionText, theme.isDark && styles.themeOptionTextActive]}>
                      Karanlık
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Günün Menüsünü Belirleyin</Text>
                
                {/* Menü Tarihi Giriş Alanı */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Tarih (YYYY-MM-DD)</Text>
                  <TextInput
                    style={[styles.input, focusedField === 'date' && styles.inputFocused]}
                    placeholder="Tarih seçin veya yazın"
                    placeholderTextColor={theme.colors.placeholder}
                    value={menuDate}
                    onChangeText={setMenuDate}
                    onFocus={() => setFocusedField('date')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                {/* Çorba Giriş Alanı */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: '#38BDF8' }]}>Çorba</Text>
                  <TextInput
                    style={[styles.input, focusedField === 'soup' && styles.inputFocused]}
                    placeholder="Çorba adını girin"
                    placeholderTextColor={theme.colors.placeholder}
                    value={soup}
                    onChangeText={setSoup}
                    onFocus={() => setFocusedField('soup')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                {/* Ana Yemek Giriş Alanı */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: '#F59E0B' }]}>Ana Yemek</Text>
                  <TextInput
                    style={[styles.input, focusedField === 'main' && styles.inputFocused]}
                    placeholder="Ana yemek adını girin"
                    placeholderTextColor={theme.colors.placeholder}
                    value={mainDish}
                    onChangeText={setMainDish}
                    onFocus={() => setFocusedField('main')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                {/* Yardımcı Yemek Giriş Alanı */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: '#10B981' }]}>Yardımcı Yemek</Text>
                  <TextInput
                    style={[styles.input, focusedField === 'side' && styles.inputFocused]}
                    placeholder="Yardımcı yemek adını girin"
                    placeholderTextColor={theme.colors.placeholder}
                    value={sideDish}
                    onChangeText={setSideDish}
                    onFocus={() => setFocusedField('side')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                {/* Tatlı ve Meyve Giriş Alanı */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: '#EC4899' }]}>Tatlı / Meyve</Text>
                  <TextInput
                    style={[styles.input, focusedField === 'dessert' && styles.inputFocused]}
                    placeholder="Tatlı veya meyve adını girin"
                    placeholderTextColor={theme.colors.placeholder}
                    value={dessert}
                    onChangeText={setDessert}
                    onFocus={() => setFocusedField('dessert')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>

                {/* Menüyü Kaydetme Butonu */}
                <TouchableOpacity
                  style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                  onPress={handleSaveMenu}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Menüyü Kaydet</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : activeTab === 'reports' ? (
            reportsLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0D9488" />
                <Text style={styles.loaderText}>Değerlendirme raporları yükleniyor...</Text>
              </View>
            ) : (
              /* Raporlar Listesi Görünümü */
              <FlatList
                data={reports}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.reportCard}>
                    <View style={styles.reportHeader}>
                      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                        <Text style={styles.categoryBadgeText}>{getCategoryDisplayName(item.category)}</Text>
                      </View>
                      <Text style={styles.reportDateText}>{item.date}</Text>
                    </View>
                    
                    <Text style={styles.reportFoodName}>{capitalizeFoodName(item.name)}</Text>
                    
                    <View style={styles.ratingInfoContainer}>
                      <View style={styles.scoreRow}>
                        <Text style={styles.reportScoreText}>⭐ {item.avgRating.toFixed(1)}</Text>
                        <Text style={styles.reportVotesText}>{item.totalVotes} Değerlendirme</Text>
                      </View>
                      
                      {/* Görsel Memnuniyet Barı */}
                      <View style={styles.ratingBarBg}>
                        <View style={[
                          styles.ratingBarFill, 
                          { width: `${(item.avgRating / 5) * 100}%` }
                        ]} />
                      </View>
                    </View>
                  </View>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Henüz yapılmış bir değerlendirme bulunamadı.</Text>
                  </View>
                }
              />
            )
          ) : feedbacksLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#0D9488" />
              <Text style={styles.loaderText}>Yorumlar yükleniyor...</Text>
            </View>
          ) : (
            /* Yorumlar Listesi Görünümü */
            <FlatList
              data={feedbacks}
              keyExtractor={(item, index) => item.id?.toString() || `${item.userName || 'personel'}-${index}`}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.feedbackItemCard}>
                  {/* Üst Kısım: Personel Avatar, Adı, Tarihi ve Ortalama Puan */}
                  <View style={styles.feedbackItemHeader}>
                    <View style={styles.feedbackUserRow}>
                      <View style={styles.feedbackAvatar}>
                        <Text style={styles.feedbackAvatarText}>
                          {item.userName ? item.userName.charAt(0).toUpperCase() : 'S'}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.feedbackUserName}>{item.userName || 'Standart Personel'}</Text>
                        <Text style={styles.feedbackDateText}>{item.date}</Text>
                      </View>
                    </View>
                    <View style={styles.avgScoreContainer}>
                      <View style={styles.avgScoreRow}>
                        <Text style={styles.starIconYellow}>★</Text>
                        <Text style={styles.avgScoreText}>{(item.averageScore || 0).toFixed(1)} / 5</Text>
                      </View>
                      <Text style={styles.avgScoreLabel}>Ortalama Puan</Text>
                    </View>
                  </View>

                  {/* Orta Kısım: Yemek ve Puan Tablosu */}
                  {item.items && item.items.length > 0 && (
                    <View style={styles.feedbackTableContainer}>
                      {/* Tablo Başlıkları */}
                      <View style={styles.tableHeaderRow}>
                        <Text style={styles.tableHeaderLeft}>Yemek</Text>
                        <Text style={styles.tableHeaderRight}>Puan</Text>
                      </View>

                      {/* Yemek Satırları (Çorba, Ana Yemek, Yardımcı Yemek, Tatlı sırasıyla) */}
                      {[...item.items]
                        .sort((a: any, b: any) => getCategoryOrder(a.category) - getCategoryOrder(b.category))
                        .map((food: any, idx: number, arr: any[]) => (
                          <View
                            key={food.id || idx}
                            style={[
                              styles.tableRow,
                              idx < arr.length - 1 ? styles.tableRowBorder : null
                            ]}
                          >
                            <Text style={styles.tableFoodName}>{capitalizeFoodName(food.name)}</Text>
                            <View style={styles.tableScoreRow}>
                              <Text style={styles.starIconYellowSmall}>★</Text>
                              <Text style={styles.tableScoreText}>{food.score} / 5</Text>
                            </View>
                          </View>
                        ))}
                    </View>
                  )}

                  {/* Alt Kısım: Genel Değerlendirme / Yorum Metni */}
                  {item.comment ? (
                    <View style={styles.commentCardBox}>
                      <View style={styles.commentCardHeader}>
                        <Text style={styles.commentIcon}>💬</Text>
                        <Text style={styles.commentTitle}>Genel Değerlendirme</Text>
                      </View>
                      <Text style={styles.commentBodyText}>{item.comment}</Text>
                    </View>
                  ) : null}
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Henüz yapılmış bir yorum bulunamadı.</Text>
                </View>
              }
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default AdminHomeScreen;
