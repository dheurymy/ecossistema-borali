import { StyleSheet } from 'react-native';
import { colors, fontSize, spacing, borderRadius, fontWeight } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxlarge,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSize.medium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: colors.primary,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: fontSize.large,
    fontWeight: fontWeight.semiBold,
  },
  registerButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  registerButtonText: {
    color: colors.primary,
    fontSize: fontSize.large,
    fontWeight: fontWeight.semiBold,
  },
});
