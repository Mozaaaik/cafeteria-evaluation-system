import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';

/*
 * Android emülatöründeki 127.0.0.1 emülatörün kendisini gösterir.
 * Bilgisayarda 8080 portunda çalışan Spring Boot backend'e Android
 * emülatöründen ulaşmak için özel 10.0.2.2 adresini kullanıyoruz.
 */
export const API_BASE_URL = 'http://10.0.2.2:8080';

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
    // Backend'e ulaşılamadıysa HTTP response olmadığı için status 0 kullanılır.
    const status = error.response?.status ?? 0;
    return new ApiError(status, getErrorMessage(error, fallback));
  }

  return new ApiError(0, fallback);
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

export const apiService = {
  /*
   * POST /api/auth/login
   *
   * Axios JavaScript nesnesini otomatik olarak JSON'a çevirir. Bu nedenle
   * fetch'teki gibi JSON.stringify(...) yazmamız gerekmez.
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/api/auth/login', {
        username,
        password,
      });

      // Axios'ta backend'in JSON cevabı response.data içerisindedir.
      const data = response.data;
      // console.log(
      //   'Backend cevabı:\n',
      //   JSON.stringify(data, null, 2)
      // );

      await AsyncStorage.setItem('authToken', data.accessToken);
      await AsyncStorage.setItem('userRole', data.user.role);
      await AsyncStorage.setItem('userFullName', data.user.fullName);

      return data;
    } catch (error) {
      throw toApiError(error, 'Giriş başarısız.');
    }
  },

  /* POST /api/auth/register ile yeni USER kaydı oluşturur. */
  register: async (
    fullName: string,
    username: string,
    password: string,
  ): Promise<string> => {
    try {
      const response = await apiClient.post<string>('/api/auth/register', {
        // Alan adı backend'deki RegisterRequest.fullName ile aynı olmalıdır.
        fullName,
        username,
        password,
      });

      return response.data;
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

  getMenusByRange: async (startDate: string, endDate: string): Promise<any[]> => {
    try {
      const response = await apiClient.get<MenuResponse[]>('/api/menus', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw toApiError(error, 'Haftalık menü yüklenemedi.');
    }
  },

  submitEvaluation: async (menuItemId: number, score: number, comment?: string) => {
    try {
      const response = await apiClient.post('/api/evaluations', {
        menuItemId,
        score,
        comment,
      });
      return response.data;
    } catch (error) {
      throw toApiError(error, 'Değerlendirme gönderilemedi.');
    }
  },

  getReports: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get<any[]>('/api/reports/menu-items');
      return response.data;
    } catch (error) {
      throw toApiError(error, 'Raporlar yüklenemedi.');
    }
  },

  getCommentReports: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get<any[]>('/api/reports/comments');
      return response.data;
    } catch (error) {
      throw toApiError(error, 'Yorumlar yüklenemedi.');
    }
  },
};
