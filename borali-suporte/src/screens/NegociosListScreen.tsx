import React, { useState, useEffect, useCallback } from 'react';
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
import { negociosService, Negocio } from '../services/negociosService';
import { errorService } from '../services/errorService';
import { theme } from '../styles/theme';

type NegociosListScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function NegociosListScreen({ navigation }: NegociosListScreenProps) {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const carregarNegocios = async (pageNum = 1, refresh = false) => {
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

      if (searchText) filtros.nome = searchText;
      if (filtroStatus) filtros.statusAssinatura = filtroStatus;
      if (filtroCategoria) filtros.categoria = filtroCategoria;

      const resultado = await negociosService.listar(filtros);

      if (pageNum === 1) {
        setNegocios(resultado.negocios);
      } else {
        setNegocios(prev => [...prev, ...resultado.negocios]);
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
      carregarNegocios(1);
    }, [searchText, filtroStatus, filtroCategoria])
  );

  const handleRefresh = () => {
    carregarNegocios(1, true);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      carregarNegocios(page + 1);
    }
  };

  const handleAprovar = async (id: string) => {
    try {
      await negociosService.aprovar(id);
      errorService.showSuccess('Negócio aprovado com sucesso!');
      carregarNegocios(1);
    } catch (error) {
      errorService.showError(error);
    }
  };

  const handleRejeitar = async (id: string) => {
    Alert.prompt(
      'Rejeitar Negócio',
      'Digite o motivo da rejeição:',
      async (motivo?: string) => {
        if (!motivo?.trim()) {
          errorService.showWarning('Motivo é obrigatório');
          return;
        }
        try {
          await negociosService.rejeitar(id, motivo);
          errorService.showSuccess('Negócio rejeitado');
          carregarNegocios(1);
        } catch (error) {
          errorService.showError(error);
        }
      },
      'plain-text'
    );
  };

  const handleDelete = (id: string) => {
    errorService.showConfirmation(
      'Deletar Negócio',
      'Tem certeza que deseja deletar este negócio? Esta ação não pode ser desfeita.',
      async () => {
        try {
          await negociosService.deletar(id);
          errorService.showSuccess('Negócio deletado com sucesso!');
          carregarNegocios(1);
        } catch (error) {
          errorService.showError(error);
        }
      }
    );
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ativo': return '#4CAF50';
      case 'trial': return '#2196F3';
      case 'inadimplente': return '#FF9800';
      case 'cancelado': return '#F44336';
      case 'pausado': return '#9E9E9E';
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusCadastroColor = (status?: string) => {
    switch (status) {
      case 'aprovado': return '#4CAF50';
      case 'pendente': return '#FF9800';
      case 'rejeitado': return '#F44336';
      default: return theme.colors.textSecondary;
    }
  };

  const renderNegocio = ({ item }: { item: Negocio }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('NegocioForm', { negocioId: item._id })}
    >
      <View style={styles.cardHeader}>
        {item.logo ? (
          <Image source={{ uri: item.logo }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, styles.logoPlaceholder]}>
            <Ionicons name="business" size={24} color={theme.colors.textSecondary} />
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.cardCategory}>{item.categoria}</Text>
          <Text style={styles.cardLocation} numberOfLines={1}>
            <Ionicons name="location-outline" size={12} />
            {' '}{item.localizacao.cidade}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.statusAssinatura) }]}>
            <Text style={styles.statusText}>{item.statusAssinatura}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusCadastroColor(item.statusCadastro) }]}>
            <Text style={styles.statusText}>{item.statusCadastro}</Text>
          </View>
          <View style={styles.planoBadge}>
            <Text style={styles.planoText}>{item.plano}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="eye-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{item.visualizacoes || 0}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="ticket-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{item.cuponsResgatados || 0}</Text>
          </View>
          {item.avaliacaoMedia ? (
            <View style={styles.stat}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Text style={styles.statText}>{item.avaliacaoMedia.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {item.statusCadastro === 'pendente' && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleAprovar(item._id!)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Aprovar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleRejeitar(item._id!)}
          >
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Rejeitar</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item._id!)}
      >
        <Ionicons name="trash-outline" size={20} color="#F44336" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Negócios Parceiros</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('NegocioForm')}
        >
          <Ionicons name="add" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar negócio..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={theme.colors.textSecondary}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filtroStatus === 'ativo' && styles.filterButtonActive]}
          onPress={() => setFiltroStatus(filtroStatus === 'ativo' ? '' : 'ativo')}
        >
          <Text style={[styles.filterButtonText, filtroStatus === 'ativo' && styles.filterButtonTextActive]}>
            Ativos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filtroStatus === 'trial' && styles.filterButtonActive]}
          onPress={() => setFiltroStatus(filtroStatus === 'trial' ? '' : 'trial')}
        >
          <Text style={[styles.filterButtonText, filtroStatus === 'trial' && styles.filterButtonTextActive]}>
            Trial
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filtroStatus === 'inadimplente' && styles.filterButtonActive]}
          onPress={() => setFiltroStatus(filtroStatus === 'inadimplente' ? '' : 'inadimplente')}
        >
          <Text style={[styles.filterButtonText, filtroStatus === 'inadimplente' && styles.filterButtonTextActive]}>
            Inadimplentes
          </Text>
        </TouchableOpacity>
      </View>

      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={negocios}
          renderItem={renderNegocio}
          keyExtractor={(item) => item._id!}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={64} color={theme.colors.textSecondary} />
              <Text style={styles.emptyText}>Nenhum negócio encontrado</Text>
            </View>
          }
          ListFooterComponent={
            loading && page > 1 ? (
              <ActivityIndicator size="small" color={theme.colors.primary} style={styles.footerLoader} />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xxxl,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.fontSize.xxlarge,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    fontSize: theme.fontSize.medium,
    color: theme.colors.text,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  filterButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.medium,
  },
  filterButtonTextActive: {
    color: theme.colors.white,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: 100,
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
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.medium,
    marginRight: theme.spacing.md,
  },
  logoPlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardCategory: {
    fontSize: theme.fontSize.small,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  cardLocation: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
  },
  cardDetails: {
    marginBottom: theme.spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.small,
  },
  statusText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.medium,
  },
  planoBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.small,
    backgroundColor: '#E3F2FD',
  },
  planoText: {
    color: '#1976D2',
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.medium,
  },
  stats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    gap: theme.spacing.xs,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semiBold,
  },
  deleteButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.medium,
    color: theme.colors.textSecondary,
  },
  footerLoader: {
    marginVertical: theme.spacing.md,
  },
});
