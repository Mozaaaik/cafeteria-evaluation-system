import { Platform, StyleSheet } from 'react-native';

// Yönetici ekranı (AdminHomeScreen) bileşeni için stil tanımlamaları
export const adminStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
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

  welcomeText: {
    color: '#94A3B8',
    fontSize: 13,
  },

  userNameText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
  },

  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  logoutButtonText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },

  tabButtonActive: {
    backgroundColor: '#0D9488', // Turkuaz rengi (Teal 600)
  },

  tabText: {
    color: '#94A3B8',
    fontWeight: '700',
    fontSize: 14,
  },

  tabTextActive: {
    color: '#FFFFFF',
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  listContent: {
    padding: 20,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.92)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 24,
    textAlign: 'center',
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
    letterSpacing: 0.5,
  },

  input: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 14,
    color: '#F8FAFC',
    fontSize: 14,
  },

  inputFocused: {
    borderColor: '#0D9488',
  },

  submitButton: {
    backgroundColor: '#0D9488',
    padding: 16,
    borderRadius: 12,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
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

  reportCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.92)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  reportHeader: {
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
    fontSize: 10,
    fontWeight: 'bold',
  },

  reportDateText: {
    color: '#64748B',
    fontSize: 12,
  },

  reportFoodName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  ratingInfoContainer: {
    borderTopWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
    paddingTop: 12,
  },

  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  reportScoreText: {
    color: '#F59E0B',
    fontSize: 15,
    fontWeight: 'bold',
  },

  reportVotesText: {
    color: '#94A3B8',
    fontSize: 12,
  },

  ratingBarBg: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },

  ratingBarFill: {
    height: '100%',
    backgroundColor: '#0D9488',
    borderRadius: 4,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },

  emptyText: {
    color: '#64748B',
    fontSize: 14,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },

  loaderText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 14,
  },

  feedbackItemCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },

  feedbackItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  feedbackUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  feedbackAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0D9488', // Turkuaz (Teal) avatar
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  feedbackAvatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },

  feedbackUserName: {
    color: '#F8FAFC',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },

  feedbackDateText: {
    color: '#94A3B8',
    fontSize: 13,
  },

  avgScoreContainer: {
    alignItems: 'flex-end',
  },

  avgScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  starIconYellow: {
    color: '#F59E0B',
    fontSize: 16,
    marginRight: 4,
  },

  avgScoreText: {
    color: '#F59E0B',
    fontWeight: 'bold',
    fontSize: 16,
  },

  avgScoreLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },

  feedbackTableContainer: {
    backgroundColor: '#0F172A', // Slate 900
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },

  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)',
  },

  tableHeaderLeft: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },

  tableHeaderRight: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },

  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },

  tableRowBorder: {
    borderBottomWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.3)',
  },

  tableFoodName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },

  tableScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  starIconYellowSmall: {
    color: '#F59E0B',
    fontSize: 14,
    marginRight: 4,
  },

  tableScoreText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },

  commentCardBox: {
    backgroundColor: '#0F172A', // Slate 900
    borderRadius: 14,
    padding: 16,
  },

  commentCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  commentIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  commentTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: 'bold',
  },

  commentBodyText: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 20,
  },
});
