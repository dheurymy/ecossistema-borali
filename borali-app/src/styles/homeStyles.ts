import { StyleSheet } from 'react-native';
import { colors, fontSize, spacing, borderRadius, fontWeight } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    fontSize: fontSize.xlarge,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  text: {
    fontSize: fontSize.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  logoutButton: {
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: fontSize.large,
    fontWeight: fontWeight.semiBold,
  },
});
