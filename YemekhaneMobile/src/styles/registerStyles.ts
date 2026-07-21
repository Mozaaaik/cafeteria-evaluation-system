import { StyleSheet } from 'react-native';

// Kayıt ekranı (RegisterScreen) bileşeni için stil tanımlamaları
export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
  },

  flex: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.92)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  logo: {
    width: 140,
    height: 50,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 2,
  },

  inputContainer: {
    marginBottom: 14,
  },

  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 12,
    color: '#F8FAFC',
    fontSize: 14,
  },

  inputFocused: {
    borderColor: '#0D9488',
  },

  errorText: {
    color: '#EF4444',
    marginBottom: 14,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
  },

  button: {
    backgroundColor: '#0D9488',
    padding: 14,
    borderRadius: 12,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
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
    fontSize: 15,
    letterSpacing: 0.5,
  },

  backLink: {
    marginTop: 16,
    alignItems: 'center',
  },

  backLinkText: {
    color: '#94A3B8',
    fontSize: 13,
  },

  backLinkHighlight: {
    color: '#0D9488',
    fontWeight: '700',
  },
});
