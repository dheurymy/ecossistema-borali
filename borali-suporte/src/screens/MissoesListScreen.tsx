import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../styles/theme';
import missoesService, { Missao } from '../services/missoesService';
import { errorService } from '../services/errorService';

type MissoesListScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function MissoesListScreen({ navigation }: MissoesListScreenProps) {
  const [missoes, setMissoes] = useState<Missao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('');

  const carregarMissoes = useCallback(async (pageNum: number = 1, refresh: boolean = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }
      
      const resultado = await missoesService.listar({
        tipo: filtroTipo || undefined,
        page: pageNum,
        limit: 20
      });
      
      if (pageNum === 1) {
        setMissoes(resultado.missoes);
      } else {
        setMissoes(prev => [...prev, ...resultado.missoes]);
      }
      
      setHasMore(pageNum < resultado.totalPaginas);
      setPage(pageNum);
    } catch (error) {
      errorService.showError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filtroTipo]);

  useFocusEffect(
    useCallback(() => {
      carregarMissoes(1);
    }, [filtroTipo])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    carregarMissoes(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && page > 0) {
      carregarMissoes(page + 1);
    }
  };

  const handleAlternarStatus = async (id: string) => {
    try {
      await missoesService.alternarStatus(id);
      carregarMissoes(1);
    } catch (error) {
      errorService.showError(error);
    }
  };

  const handleAlternarDestaque = async (id: string) => {
    try {
      await missoesService.alternarDestaque(id);
      carregarMissoes(1);
    } catch (error) {
      errorService.showError(error);
    }
  };

  const handleDeletar = async (id: string) => {
    errorService.showConfirmation(
      'Confirmar exclusão',
      'Tem certeza que deseja deletar esta missão?',
      async () => {
        try {
          await missoesService.deletar(id);
          carregarMissoes(1);
        } catch (error) {
          errorService.showError(error);
        }
      }
    );
  };

  const getTipoCor = (tipo: string) => {
    const cores = {
      diaria: '#4CAF50',
      semanal: '#2196F3',
      mensal: '#9C27B0',
      especial: '#FF9800'
    };
    return cores[tipo as keyof typeof cores] || theme.colors.primary;
  };

  const getTipoIcone = (tipo: string) => {
    const icones = {
      diaria: 'today',
      semanal: 'calendar',
      mensal: 'calendar-outline',
      especial: 'star'
    };
    return icones[tipo as keyof typeof icones] || 'checkmark-circle';
  };

  const formatarData = (data: string) => {
    if (!data) return '';
    const d = new Date(data);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderMissao = ({ item }: { item: Missao }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MissaoForm', { missaoId: item._id })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Ionicons 
            name={getTipoIcone(item.tipo) as any} 
            size={24} 
            color={getTipoCor(item.tipo)} 
          />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.titulo}
            </Text>
            <Text style={styles.cardCategoria}>{item.categoria}</Text>
          </View>
        </View>
        <View style={styles.badgesContainer}>
          <View style={[styles.tipoBadge, { backgroundColor: getTipoCor(item.tipo) }]}>
            <Text style={styles.tipoText}>{item.tipo.toUpperCase()}</Text>
          </View>
          {item.destaque && (
            <Ionicons name="star" size={20} color="#FFD700" style={{ marginLeft: 4 }} />
          )}
        </View>
      </View>

      <Text style={styles.cardDescricao} numberOfLines={2}>
        {item.descricao}
      </Text>

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="trophy-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.detailText}>{item.recompensa.pontos} pontos</Text>
        </View>
        {item.validade && (
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              {formatarData(item.validade.inicio)} - {formatarData(item.validade.fim)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: item.ativo ? '#4CAF50' : '#FF9800' }]}
          onPress={() => handleAlternarStatus(item._id)}
        >
          <Ionicons
            name={item.ativo ? 'checkmark-circle' : 'pause-circle'}
            size={20}
            color="#fff"
          />
          <Text style={styles.actionButtonText}>
            {item.ativo ? 'Ativo' : 'Inativo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: item.destaque ? '#FFD700' : '#9E9E9E' }]}
          onPress={() => handleAlternarDestaque(item._id)}
        >
          <Ionicons name="star" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>
            {item.destaque ? 'Destacado' : 'Destaque'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeletar(item._id)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
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
        <Text style={styles.title}>Missões</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('MissaoForm')}
        >
          <Ionicons name="add" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filtroTipo === '' && styles.filterButtonActive]}
          onPress={() => setFiltroTipo('')}
        >
          <Text style={[styles.filterButtonText, filtroTipo === '' && styles.filterButtonTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        {['diaria', 'semanal', 'mensal', 'especial'].map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[styles.filterButton, filtroTipo === tipo && styles.filterButtonActive]}
            onPress={() => setFiltroTipo(tipo)}
          >
            <Text style={[styles.filterButtonText, filtroTipo === tipo && styles.filterButtonTextActive]}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={missoes}
        renderItem={renderMissao}
        keyExtractor={(item) => item._id}
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
            <Ionicons name="calendar-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>
              Nenhuma missão encontrada{'\n'}
              Toque no + para criar a primeira!
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
    paddingTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardInfo: {
    marginLeft: 12,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  cardCategoria: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipoText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  cardDescricao: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    flex: 0,
    paddingHorizontal: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
