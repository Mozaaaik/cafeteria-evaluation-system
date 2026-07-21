import { StyleSheet } from 'react-native';

// Giriş ekranı (LoginScreen) bileşeni için stil tanımlamaları
export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)', // Kontrastı sağlamak için yarı saydam koyu arka plan kaplaması
  },

  flex: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.92)', // Cam efekti (glassmorphism) görünümü için yarı saydam Slate 800
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.8)', // Yarı saydam Slate 700 çerçeve çizgisi
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  logo: {
    width: 140,
    height: 60,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC', // Açık gri Slate 50 rengi
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: 14,
    color: '#94A3B8', // Orta gri Slate 400 rengi
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 4,
  },

  inputContainer: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  input: {
    backgroundColor: '#0F172A', // Koyu gri Slate 900 rengi
    borderWidth: 1.5,
    borderColor: '#334155', // Slate 700 kenarlık rengi
    borderRadius: 12,
    padding: 16,
    color: '#F8FAFC',
    fontSize: 15,
  },

  inputFocused: {
    borderColor: '#0D9488', // Aktif odaklanma rengi turkuaz (Teal 600)
  },

  errorText: {
    color: '#EF4444', // Hata mesajı kırmızı rengi (Red 500)
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },

  button: {
    backgroundColor: '#0D9488', // Buton rengi turkuaz (Teal 600)
    padding: 16,
    borderRadius: 12,
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  registerLink: {
    marginTop: 16,
    alignItems: 'center',
  },

  registerLinkText: {
    color: '#94A3B8',
    fontSize: 14,
  },

  registerLinkHighlight: {
    color: '#0D9488',
    fontWeight: '700',
  },

  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#334155', // Slate 700 kenarlık rengi
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#0F172A', // Slate 900 rengi
  },

  checkboxChecked: {
    borderColor: '#0D9488', // Seçili kutu turkuaz rengi (Teal 600)
    backgroundColor: '#0D9488', // Seçili kutu arka planı turkuaz rengi (Teal 600)
  },

  checkboxCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

  checkboxLabel: {
    color: '#94A3B8', // Açıklama rengi Slate 400
    fontSize: 14,
  },
});
