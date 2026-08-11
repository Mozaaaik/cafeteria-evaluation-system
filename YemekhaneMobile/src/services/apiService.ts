import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';

/*
 * Android emülatöründeki 127.0.0.1 emülatörün kendisini gösterir.
 * Bilgisayarda 8082 portunda çalışan Spring Boot backend'e Android
 * emülatöründen ulaşmak için özel 10.0.2.2 adresini kullanıyoruz.
 */
export const API_BASE_URL = 'http://10.0.2.2:8082';

/*
 * Axios instance oluşturuyoruz.
 *
 * Böylece her istekte tekrar tekrar şunları yazmak zorunda kalmayız:
 * - Backend'in temel adresi
 * - JSON Content-Type başlığı
 * - İstek zaman aşımı
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/*
 * REQUEST INTERCEPTOR (İstek Araya Giricisi)
 *
 * apiClient ile backend'e gönderilen HER istekten hemen önce çalışır.
 * Login işleminde AsyncStorage'a kaydettiğimiz JWT token'ı okur ve varsa
 * isteğin Authorization başlığına ekler.
 *
 * Backend şu başlığı görür:
 * Authorization: Bearer eyJhbGciOiJIUzI1Ni...
 *
 * Spring Security bu token'ı doğrular. Kullanıcı ADMIN rolündeyse
 * /api/admin/menus endpoint'ine geçmesine izin verir.
 */
apiClient.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('authToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* Backend hatasının HTTP durum kodunu da ekranlara taşıyan hata sınıfı. */
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/*
 * Backend'in farklı şekillerde dönebilen hata gövdesinden kullanıcıya
 * gösterilebilecek metni seçer.
 */
const getErrorMessage = (error: AxiosError<any>, fallback: string): string => {
  const responseData = error.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  return fallback;
};

/* Axios hatasını uygulamanın ortak ApiError tipine dönüştürür. */
const toApiError = (error: unknown, fallback: string): ApiError => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      const codeInfo = error.code ? ` [Code: ${error.code}]` : '';
      return new ApiError(0, `[Network Error] ${error.message}${codeInfo}`);
    }
    const status = error.response.status;
    const msg = getErrorMessage(error, fallback);
    return new ApiError(status, `[HTTP ${status}] ${msg}`);
  }

  const genericMsg = error instanceof Error ? error.message : fallback;
  return new ApiError(0, genericMsg);
};

/*
 * Bir istek 401 dönerse token geçersizdir veya süresi dolmuştur.
 * Yerel oturum verilerini temizleyip kullanıcıyı Login ekranına gönderir.
 */
export const handleAuthError = async (
  error: unknown,
  navigation?: any,
): Promise<boolean> => {
  if (!(error instanceof ApiError) || error.status !== 401) {
    return false;
  }

  await Promise.all(
    ['authToken', 'userRole', 'userFullName', 'keepLoggedIn'].map(key =>
      AsyncStorage.removeItem(key),
    ),
  );

  navigation?.replace('Login');
  return true;
};

/* Backend'in login endpoint'inden döndürdüğü JSON yapısı. */
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

/*
 * Backend'deki CreateMenuRequest record'u bu alanları bekliyor:
 * menuDate, soup, mainCourse, sideDish, dessertOrFruit.
 */
export type CreateMenuRequest = {
  menuDate: string;
  soup: string;
  mainCourse: string;
  sideDish: string;
  dessertOrFruit: string;
};

/* Backend'deki MenuItemResponse record'unun TypeScript karşılığı. */
type MenuItemResponse = {
  id: number;
  category: string;
  name: string;
  displayOrder: number;
};

/* Backend'deki MenuResponse record'unun TypeScript karşılığı. */
export type MenuResponse = {
  id: number;
  menuDate: string;
  items: MenuItemResponse[];
};

export type WeeklyMenuDayResponse = { date: string; menu: MenuResponse | null };
export type UserProfileResponse = { id: number; fullName: string; username: string; role: 'ADMIN' | 'USER' };

export const apiService = {
  /*
   * POST /api/auth/login
   *
   * Axios JavaScript nesnesini otomatik olarak JSON'a çevirir. Bu nedenle
   * fetch'teki gibi JSON.stringify(...) yazmamız gerekmez.
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      console.log(`[LOGIN TRY] POST -> ${apiClient.defaults.baseURL}/api/auth/login with username: "${username}"`);
      const response = await apiClient.post<LoginResponse>('/api/auth/login', {
        username,
        password,
      });

      let data: any = response.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          // data stays string if fail
        }
      }

      console.log('[LOGIN SUCCESS DATA]', JSON.stringify(data));

      const accessToken = data.accessToken || data.token || '';
      const userObj = data.user || data;

      // Rol tespiti:
      // 1. data.user.role veya data.role (örn: 'ADMIN', 'ROLE_ADMIN')
      // 2. username 'admin' ise
      // 3. accessToken içerisinde 'ADMIN' geçiyorsa
      let role: 'ADMIN' | 'USER' = 'USER';
      const rawRole = String(userObj?.role || data?.role || '').toUpperCase();
      if (rawRole.includes('ADMIN') || username.trim().toLowerCase() === 'admin' || accessToken.includes('ADMIN')) {
        role = 'ADMIN';
      }

      const fullName = userObj.fullName || (role === 'ADMIN' ? 'Sistem Yöneticisi' : username);

      await AsyncStorage.setItem('authToken', accessToken);
      await AsyncStorage.setItem('userRole', role);
      await AsyncStorage.setItem('userFullName', fullName);

      return {
        accessToken,
        tokenType: data.tokenType || 'Bearer',
        expiresIn: data.expiresIn || 3600,
        user: {
          id: userObj.id || 1,
          fullName,
          username: userObj.username || username,
          role,
        },
      };
    } catch (error: any) {
      console.log('[LOGIN ERROR DETAILS]:', {
        isAxiosError: axios.isAxiosError(error),
        message: error?.message,
        code: error?.code,
        status: error?.response?.status,
        responseData: error?.response?.data,
      });
      throw toApiError(error, 'Giriş başarısız.');
    }
  },

  /* POST /api/auth/register ile yeni USER kaydı oluşturur. */
  register: async (
    fullName: string,
    username: string,
    password: string,
  ): Promise<void> => {
    try {
      await apiClient.post('/api/auth/register', {
        // Alan adı backend'deki RegisterRequest.fullName ile aynı olmalıdır.
        fullName,
        username,
        password,
      });

    } catch (error) {
      throw toApiError(error, 'Kayıt işlemi başarısız.');
    }
  },

  /*
   * POST /api/admin/menus
   *
   * Kullanıcı "Menüyü Kaydet" düğmesine bastığında AdminHomeScreen bu
   * metodu çağırır. Request interceptor JWT'yi otomatik olarak ekler.
   *
   * Backend akışı:
   * AdminMenuController -> MenuService -> DailyMenuRepository -> MySQL
   *
   * Başarılı olursa backend HTTP 201 ve kaydedilen MenuResponse'u döndürür.
   * 
   * Menüyü Kaydet
          ↓
    handleSaveMenu()
          ↓
    apiService.saveMenu()
          ↓
    Axios POST /api/admin/menus
          ↓
    JWT kontrolü
          ↓
    AdminMenuController
          ↓
    MenuService
          ↓
    DailyMenuRepository
          ↓
    MySQL

   */
  saveMenu: async (menu: CreateMenuRequest): Promise<MenuResponse> => {
    try {
      const response = await apiClient.post<MenuResponse>(
        '/api/admin/menus',
        menu,
      );

      console.log(
        'Kaydedilen menü:\n',
        JSON.stringify(response.data, null, 2),
      );

      

      return response.data;
    } catch (error) {
      throw toApiError(error, 'Menü kaydedilemedi.');
    }
  },

  updateMenu: async (menuId: number, menu: CreateMenuRequest): Promise<MenuResponse> => {
    try { return (await apiClient.put<MenuResponse>(`/api/admin/menus/${menuId}`, menu)).data; }
    catch (error) { throw toApiError(error, 'Menü güncellenemedi.'); }
  },

  deleteMenu: async (menuId: number): Promise<void> => {
    try { await apiClient.delete(`/api/admin/menus/${menuId}`); }
    catch (error) { throw toApiError(error, 'Menü silinemedi.'); }
  },



  /*
   * Aşağıdaki endpoint'ler ekranlar tarafından kullanılıyor ancak mevcut
   * backend branch'inde controller'ları henüz tamamlanmış değil. Metotlar
   * frontend tip bütünlüğünü korur; controller eklenene kadar 404 dönebilir.
   */
  getMenuByDate: async (date: string): Promise<any> => {
    try {
      const response = await apiClient.get<MenuResponse>(`/api/menus/date/${date}`);
      return response.data;
    } catch (error) {
      throw toApiError(error, 'Menü yüklenemedi.');
    }
  },

  getTodayMenu: async (): Promise<any> => {
    try {
      const response = await apiClient.get<MenuResponse>('/api/menus/today');
      return response.data;
    } catch (error) {
      throw toApiError(error, 'Bugünkü menü yüklenemedi.');
    }
  },

  getMenusByRange: async (startDate: string, endDate: string): Promise<MenuResponse[]> => {
    try {
      const response = await apiClient.get<MenuResponse[]>('/api/menus', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw toApiError(error, 'Haftalık menü yüklenemedi.');
    }
  },

  submitEvaluation: async (menuId: number, ratings: Array<{menuItemId: number; score: number}>, generalComment?: string) => {
    try {
      const response = await apiClient.put(`/api/evaluations/menus/${menuId}`, {
        ratings,
        generalComment,
      });
      return response.data;
    } catch (error) {
      throw toApiError(error, 'Değerlendirme gönderilemedi.');
    }
  },

  getMyProfile: async (): Promise<UserProfileResponse> => {
    try { return (await apiClient.get<UserProfileResponse>('/api/users/me')).data; }
    catch (error) { throw toApiError(error, 'Profil yüklenemedi.'); }
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    try { await apiClient.patch('/api/users/me/password', {currentPassword, newPassword}); }
    catch (error) { throw toApiError(error, 'Şifre değiştirilemedi.'); }
  },

  getReports: async (menuId: number): Promise<any[]> => {
    try {
      const response = await apiClient.get<{meals: any[]}>(`/api/admin/reports/menus/${menuId}/summary`);
      return response.data.meals;
    } catch (error) {
      throw toApiError(error, 'Raporlar yüklenemedi.');
    }
  },

  getCommentReports: async (menuId: number): Promise<any[]> => {
    try {
      const response = await apiClient.get<any[]>(`/api/admin/reports/menus/${menuId}/comments`);
      return response.data;
    } catch (error) {
      throw toApiError(error, 'Yorumlar yüklenemedi.');
    }
  },
};
