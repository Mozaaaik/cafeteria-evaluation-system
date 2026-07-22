import { StatusBar, StyleSheet } from 'react-native';

// Haftalık yemek menüsü ekranı (WeeklyMenuScreen) bileşeni için stil tanımlamaları
export const weeklyStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
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

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 32,
    height: 32,
    marginRight: 8,
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
    width: 100, // Logo + Back Button dengesi için
  },

  weekNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
  },

  navButton: {
    backgroundColor: 'rgba(13, 148, 136, 0.2)',
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(13, 148, 136, 0.4)',
  },

  navButtonText: {
    color: '#0D9488',
    fontSize: 14,
    fontWeight: 'bold',
  },

  weekText: {
    color: '#F8FAFC',
    fontWeight: 'bold',
    fontSize: 14,
  },

  listContent: {
    padding: 20,
    paddingBottom: 40,
  },

  dayCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    marginBottom: 16,
  },

  todayCard: {
    borderColor: '#0D9488',
    borderWidth: 1.5,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
  },

  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.3)',
    paddingBottom: 10,
    marginBottom: 12,
  },

  dayName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
  },

  todayText: {
    color: '#0D9488',
  },

  dayDate: {
    color: '#94A3B8',
    fontSize: 13,
  },

  foodList: {
    gap: 10,
  },

  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  categoryBadge: {
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    width: 100,
    alignItems: 'center',
    marginRight: 12,
  },

  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  foodName: {
    color: '#E2E8F0',
    fontSize: 14,
    flex: 1,
  },

  noMenuContainer: {
    paddingVertical: 8,
  },

  noMenuText: {
    color: '#64748B',
    fontSize: 13,
    fontStyle: 'italic',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderText: {
    color: '#94A3B8',
    marginTop: 12,
    fontSize: 14,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#0D9488',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
