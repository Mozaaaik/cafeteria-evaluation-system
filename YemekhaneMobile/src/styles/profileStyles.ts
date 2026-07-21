import { StatusBar, StyleSheet } from 'react-native';

// Kullanıcı profili ekranı (ProfileScreen) bileşeni için stil tanımlamaları
export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
  },

  flex: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
  },

  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },

  backButtonText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: 'bold',
  },

  headerTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
  },

  emptyView: {
    width: 80,
  },

  loader: {
    marginTop: 40,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  profileCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },

  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0D9488', // Turkuaz rengi (Teal 600)
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },

  fullNameText: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  roleBadge: {
    backgroundColor: 'rgba(13, 148, 136, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.3)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: 20,
  },

  roleText: {
    color: '#0D9488',
    fontSize: 11,
    fontWeight: 'bold',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
    paddingTop: 16,
  },

  infoLabel: {
    color: '#94A3B8',
    fontSize: 14,
  },

  infoValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.92)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 16,
  },

  inputContainer: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
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

  submitButton: {
    backgroundColor: '#0D9488',
    padding: 14,
    borderRadius: 12,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  submitButtonDisabled: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },

  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  appInfoLabel: {
    color: '#94A3B8',
    fontSize: 13,
  },

  appInfoValue: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },

  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  logoutButtonText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
