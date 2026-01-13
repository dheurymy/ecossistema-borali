import { StyleSheet } from 'react-native';
import { colors, fontSize, spacing, borderRadius, fontWeight } from './theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: fontSize.xxlarge,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.medium,
    color: colors.textSecondary,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.medium,
    fontWeight: fontWeight.semiBold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    padding: 14,
    fontSize: fontSize.medium,
    backgroundColor: colors.inputBackground,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.medium,
    backgroundColor: colors.inputBackground,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: fontSize.medium,
  },
  eyeIcon: {
    padding: 14,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: fontSize.small,
    fontWeight: fontWeight.medium,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.medium,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize.large,
    fontWeight: fontWeight.semiBold,
  },
  linkContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  linkText: {
    color: colors.textSecondary,
    fontSize: fontSize.small,
  },
  linkBold: {
    color: colors.primary,
    fontWeight: fontWeight.semiBold,
  },
  linkButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
});
