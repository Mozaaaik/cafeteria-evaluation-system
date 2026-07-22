import { Platform, StyleSheet } from 'react-native';

// Kullanıcı anasayfası (HomeScreen) bileşeni için stil tanımlamaları
export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)', // Yarı saydam koyu arka plan kaplaması
  },

  flex: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 16 : 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },

  welcomeContainer: {
    flexDirection: 'column',
  },

  welcomeText: {
    color: '#94A3B8',
    fontSize: 13,
  },

  userNameText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
  },

  profileButton: {
    backgroundColor: 'rgba(13, 148, 136, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.3)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  profileButtonText: {
    color: '#0D9488',
    fontSize: 12,
    fontWeight: 'bold',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  titleCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  titleCol: {
    flex: 1,
  },

  weeklyButton: {
    backgroundColor: 'rgba(13, 148, 136, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.4)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  weeklyButtonText: {
    color: '#0D9488',
    fontSize: 12,
    fontWeight: 'bold',
  },

  menuDateText: {
    color: '#0D9488', // Turkuaz rengi
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 6,
  },

  menuTitleText: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: '800',
  },

  menuSubtitleText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },

  foodCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.92)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  categoryBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  statsText: {
    color: '#94A3B8',
    fontSize: 12,
  },

  foodName: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
    paddingTop: 12,
  },

  rateLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },

  starsContainer: {
    flexDirection: 'row',
  },

  starButton: {
    paddingHorizontal: 4,
  },

  starIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  starIconActive: {
    color: '#F59E0B', // Aktif altın sarısı yıldız rengi
  },

  starIconInactive: {
    color: '#334155', // Pasif koyu gri yıldız rengi
  },

  feedbackCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    marginTop: 8,
  },

  feedbackTitle: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  commentInput: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 14,
    color: '#F8FAFC',
    fontSize: 14,
    minHeight: 100,
    marginBottom: 16,
  },

  submitButton: {
    backgroundColor: '#0D9488', // Turkuaz rengi (Teal 600)
    padding: 16,
    borderRadius: 12,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
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
    letterSpacing: 0.5,
  },

  emptyContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    marginVertical: 10,
  },

  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },
});
