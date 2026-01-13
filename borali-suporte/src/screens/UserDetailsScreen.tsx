import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { usersService, User } from '../services/usersService';
import { errorService } from '../services/errorService';
import { theme } from '../styles/theme';

type UserDetailsScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { userId: string } }, 'params'>;
};

export default function UserDetailsScreen({ navigation, route }: UserDetailsScreenProps) {
  const { userId } = route.params;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUser();
  }, [userId]);

  const carregarUser = async () => {
    try {
      setLoading(true);
      const resultado = await usersService.buscarPorId(userId);
      setUser(resultado.usuario);
    } catch (error) {
      errorService.showError(error);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBanir = () => {
    if (!user) return;

    Alert.prompt(
      'Banir Usuário',
      `Tem certeza que deseja banir ${user.nome}?\n\nDigite o motivo:`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Banir',
          style: 'destructive',
          onPress: async (motivo?: string) => {
            if (!motivo?.trim()) {
              Alert.alert('Erro', 'Motivo é obrigatório');
              return;
            }

            try {
              await usersService.banir(user._id!, motivo.trim());
              errorService.showSuccess('Usuário banido com sucesso!');
              carregarUser();
            } catch (error) {
              errorService.showError(error);
            }
          },
        },
      ]
    );
  };

  const handleDesbanir = async () => {
    if (!user) return;

    Alert.alert(
      'Desbanir Usuário',
      `Tem certeza que deseja desbanir ${user.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desbanir',
          onPress: async () => {
            try {
              await usersService.desbanir(user._id!);
              errorService.showSuccess('Usuário desbanido com sucesso!');
              carregarUser();
            } catch (error) {
              errorService.showError(error);
            }
          },
        },
      ]
    );
  };

  const handleDelete = () => {
    if (!user) return;

    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir ${user.nome}?\n\nEsta ação é PERMANENTE e não pode ser desfeita!`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await usersService.deletar(user._id!);
              errorService.showSuccess('Usuário excluído com sucesso!');
              navigation.goBack();
            } catch (error) {
              errorService.showError(error);
            }
          },
        },
      ]
    );
  };

  const formatarData = (data: string | Date | undefined): string => {
    if (!data) return 'N/A';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatarDataNascimento = (data: string | Date | undefined): string => {
    if (!data) return 'N/A';
    const birthDate = new Date(data);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return `${birthDate.toLocaleDateString('pt-BR')} (${age} anos)`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Usuário não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {user.nome}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Avatar e Info Principal */}
        <View style={styles.profileSection}>
          {user.fotoPerfil ? (
            <Image source={{ uri: user.fotoPerfil }} style={styles.avatarLarge} />
          ) : (
            <View style={[styles.avatarLarge, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={64} color={theme.colors.textSecondary} />
            </View>
          )}

          <Text style={styles.profileName}>{user.nome}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>

          {user.cidade && (
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.locationText}>
                {user.cidade}{user.pais && `, ${user.pais}`}
              </Text>
            </View>
          )}

          {user.dataDeNascimento && (
            <View style={styles.locationRow}>
              <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.locationText}>
                {formatarDataNascimento(user.dataDeNascimento)}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.statusBadgeLarge,
              { backgroundColor: user.banido ? '#F44336' : (user.ativo ?? true) ? '#4CAF50' : '#9E9E9E' },
            ]}
          >
            <Text style={styles.statusTextLarge}>
              {user.banido ? 'BANIDO' : (user.ativo ?? true) ? 'ATIVO' : 'INATIVO'}
            </Text>
          </View>
        </View>

        {/* Informações de Banimento */}
        {user.banido && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="ban" size={20} color="#F44336" />
              <Text style={styles.sectionTitle}>Informações de Banimento</Text>
            </View>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Motivo:</Text>
                <Text style={styles.infoValue}>{user.motivoBanimento || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Data do Banimento:</Text>
                <Text style={styles.infoValue}>{formatarData(user.dataBanimento)}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Estatísticas de Gamificação */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={20} color="#FFB800" />
            <Text style={styles.sectionTitle}>Gamificação</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="star" size={32} color="#FFB800" />
              <Text style={styles.statValue}>{user.pontos}</Text>
              <Text style={styles.statLabel}>Pontos</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="rocket" size={32} color={theme.colors.primary} />
              <Text style={styles.statValue}>{user.nivel}</Text>
              <Text style={styles.statLabel}>Nível</Text>
            </View>
          </View>
        </View>

        {/* Estatísticas de Atividade */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bar-chart" size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Estatísticas de Atividade</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
              <Text style={styles.statValue}>{user.totalCheckIns}</Text>
              <Text style={styles.statLabel}>Check-ins</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="ticket" size={32} color={theme.colors.secondary} />
              <Text style={styles.statValue}>{user.totalCuponsResgatados}</Text>
              <Text style={styles.statLabel}>Cupons</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="star-half" size={32} color="#FFB800" />
              <Text style={styles.statValue}>{user.totalAvaliacoes}</Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>
          </View>
        </View>

        {/* Informações da Conta */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.sectionTitle}>Informações da Conta</Text>
          </View>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ID:</Text>
              <Text style={[styles.infoValue, { fontSize: 10 }]} numberOfLines={1}>
                {user._id}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cadastro:</Text>
              <Text style={styles.infoValue}>{formatarData(user.createdAt)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Última Atualização:</Text>
              <Text style={styles.infoValue}>{formatarData(user.updatedAt)}</Text>
            </View>
            {user.ultimoAcesso && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Último Acesso:</Text>
                <Text style={styles.infoValue}>{formatarData(user.ultimoAcesso)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Ações */}
        <View style={styles.actionsSection}>
          {user.banido ? (
            <TouchableOpacity style={[styles.actionButton, styles.unbanButton]} onPress={handleDesbanir}>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Desbanir Usuário</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.actionButton, styles.banButton]} onPress={handleBanir}>
              <Ionicons name="ban" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Banir Usuário</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete}>
            <Ionicons name="trash" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Excluir Usuário</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.fontSize.large,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xxxl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: theme.fontSize.xlarge,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing.md,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: theme.fontSize.xxlarge,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginBottom: theme.spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
  },
  statusBadgeLarge: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
  },
  statusTextLarge: {
    fontSize: theme.fontSize.medium,
    color: '#fff',
    fontWeight: theme.fontWeight.bold,
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.text,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.semiBold,
    flex: 1,
  },
  infoValue: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.text,
    flex: 2,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: theme.fontSize.xxlarge,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  actionsSection: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    gap: theme.spacing.sm,
  },
  banButton: {
    backgroundColor: '#FF9800',
  },
  unbanButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.bold,
  },
});
