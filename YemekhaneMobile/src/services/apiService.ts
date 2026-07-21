import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emülatörü için bilgisayarın localhost'una 10.0.2.2 üzerinden erişilir.
// Gerçek cihazlar veya iOS için kendi bilgisayarınızın yerel IP adresini yazabilirsiniz (örn: 'http://192.168.1.100:8080').
export const API_BASE_URL = 'http://10.0.2.2:8080';

// Backend'den 401 (oturum süresi dolmuş / geçersiz token) yanıtlarını ayırt
// edebilmek için status kodunu taşıyan özel hata sınıfı.
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Ekranların ortak kullanabileceği: hata 401 ise oturumu temizleyip
// kullanıcıyı giriş ekranına yönlendirir. Oturum sonlandırıldıysa true döner.
export const handleAuthError = async (err: unknown, navigation?: any): Promise<boolean> => {
  if (!(err instanceof ApiError) || err.status !== 401) {
    return false;
  }
  await Promise.all(
    ['authToken', 'userRole', 'userFullName', 'keepLoggedIn'].map(key => AsyncStorage.removeItem(key))
  );
  if (navigation) {
    navigation.replace('Login');
  }
  return true;
};

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('authToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  // Oturum Açma
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Giriş başarısız.');
    }
    
    return response.json(); // { token, role, fullName }
  },

  // Kayıt Olma
  register: async (fullName: string, username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, username, password }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(responseText || 'Kayıt başarısız.');
    }

    return responseText;
  },

  // Günlük Menü Getirme (Tarihe göre)
  getMenuByDate: async (dateStr: string) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/menus/date/${dateStr}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || 'Menü yüklenemedi.');
    }

    return response.json();
  },

  // Bugünün Menüsü
  getTodayMenu: async () => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/menus/today`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || 'Bugünkü menü yüklenemedi.');
    }

    return response.json();
  },

  // Haftalık / İki Tarih Arası Menüleri Getirme
  getMenusByRange: async (startDateStr: string, endDateStr: string) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/menus?startDate=${startDateStr}&endDate=${endDateStr}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || 'Haftalık menü yüklenemedi.');
    }

    return response.json(); // List<Menu>
  },

  // Yemek Değerlendirme / Puan Gönderme
  submitEvaluation: async (menuItemId: number, score: number, comment?: string) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/evaluations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ menuItemId, score, comment }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || 'Değerlendirme gönderilemedi.');
    }

    return response.json();
  },

  // Menü Ekleme / Güncelleme (Admin)
  saveMenu: async (dateStr: string, items: Array<{ name: string; category: string }>) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/menus`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ date: dateStr, items }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || 'Menü kaydedilemedi.');
    }

    return response.json();
  },

  // Değerlendirme Raporları (Admin)
  getReports: async () => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/reports/menu-items`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || 'Raporlar yüklenemedi.');
    }

    return response.json();
  },

  // Kullanıcı Yorumları Raporu (Admin)
  getCommentReports: async () => {
    const headers = await getHeaders();
    const response = await fetch(`${API_BASE_URL}/api/reports/comments`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ApiError(response.status, errorText || 'Yorumlar yüklenemedi.');
    }

    return response.json();
  },
};
