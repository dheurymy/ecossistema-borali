import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usersService, User } from '../services/usersService';
import { errorService } from '../services/errorService';
import { theme } from '../styles/theme';

type UsersListScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function UsersListScreen({ navigation }: UsersListScreenProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inputBusca, setInputBusca] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const carregarUsers = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      const filtros: any = {
        page: pageNum,
        limit: 20,
      };

      if (busca) filtros.busca = busca;
      if (filtroStatus === 'banidos') filtros.banido = true;
      if (filtroStatus === 'ativos') filtros.ativo = true;

      const resultado = await usersService.listar(filtros);

      if (pageNum === 1) {
        setUsers(resultado.usuarios);
      } else {
        setUsers((prev) => [...prev, ...resultado.usuarios]);
      }

      setTotalPages(resultado.paginacao.totalPaginas);
      setPage(pageNum);
    } catch (error) {
      errorService.showError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarUsers(1);
    }, [busca, filtroStatus])
  );

  const handleRefresh = () => {
    carregarUsers(1, true);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      carregarUsers(page + 1);
    }
  };

  const handleBanir = (user: User) => {
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
              carregarUsers(1);
            } catch (error) {
              errorService.showError(error);
            }
          },
        },
      ]
    );
  };

  const handleDesbanir = async (user: User) => {
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
              carregarUsers(1);
            } catch (error) {
              errorService.showError(error);
            }
          },
        },
      ]
    );
  };

  const handleDelete = (user: User) => {
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
              carregarUsers(1);
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
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('UserDetails', { userId: item._id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          {item.fotoPerfil ? (
            <Image source={{ uri: item.fotoPerfil }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={32} color={theme.colors.textSecondary} />
            </View>
          )}
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.nome}
            </Text>
            <Text style={styles.cardEmail}>{item.email}</Text>
            {item.cidade && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
                <Text style={styles.locationText}>
                  {item.cidade}{item.pais && `, ${item.pais}`}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="star" size={16} color="#FFB800" />
          <Text style={styles.statText}>
            Nível {item.nivel} • {item.pontos} pts
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="ticket-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.statText}>{item.totalCuponsResgatados} cupons</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle-outline" size={16} color="#4CAF50" />
          <Text style={styles.statText}>{item.totalCheckIns} check-ins</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.banido ? '#F44336' : (item.ativo ?? true) ? '#4CAF50' : '#9E9E9E' },
          ]}
        >
          <Text style={styles.statusText}>
            {item.banido ? 'Banido' : (item.ativo ?? true) ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
        <Text style={styles.dateText}>
          Cadastro: {formatarData(item.createdAt)}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        {item.banido ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.unbanButton]}
            onPress={() => handleDesbanir(item)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Desbanir</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.banButton]}
            onPress={() => handleBanir(item)}
          >
            <Ionicons name="ban" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Banir</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Usuários</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou email..."
          value={inputBusca}
          onChangeText={setInputBusca}
          placeholderTextColor={theme.colors.textSecondary}
          onSubmitEditing={() => setBusca(inputBusca)}
          returnKeyType="search"
        />
        {inputBusca.length > 0 ? (
          <TouchableOpacity onPress={() => { setInputBusca(''); setBusca(''); }} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={() => setBusca(inputBusca)} style={styles.searchButton}>
          <Ionicons name="search" size={20} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filtroStatus === 'ativos' && styles.filterButtonActive]}
          onPress={() => setFiltroStatus(filtroStatus === 'ativos' ? '' : 'ativos')}
        >
          <Text style={[styles.filterButtonText, filtroStatus === 'ativos' && styles.filterButtonTextActive]}>
            Ativos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filtroStatus === 'banidos' && styles.filterButtonActive]}
          onPress={() => setFiltroStatus(filtroStatus === 'banidos' ? '' : 'banidos')}
        >
          <Text style={[styles.filterButtonText, filtroStatus === 'banidos' && styles.filterButtonTextActive]}>
            Banidos
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item._id!}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>
              Nenhum usuário encontrado
            </Text>
          </View>
        }
        ListFooterComponent={
          loading && page > 1 ? (
            <ActivityIndicator size="small" color={theme.colors.primary} style={{ padding: 20 }} />
          ) : null
        }
      />
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
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xxxl,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxlarge,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBackground,
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    padding: theme.spacing.sm,
    fontSize: theme.fontSize.medium,
    color: theme.colors.text,
  },
  searchButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    marginLeft: theme.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.text,
  },
  filterButtonTextActive: {
    color: theme.colors.white,
    fontWeight: theme.fontWeight.semiBold,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  cardLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: theme.spacing.md,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  cardEmail: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.small,
  },
  statusText: {
    fontSize: theme.fontSize.small,
    color: '#fff',
    fontWeight: theme.fontWeight.semiBold,
  },
  dateText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.small,
    gap: 4,
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
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semiBold,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  emptyText: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});
