import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../styles/theme';
import figurinhasService, { Figurinha } from '../services/figurinhasService';
import { errorService } from '../services/errorService';

type FigurinhasListScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function FigurinhasListScreen({ navigation }: FigurinhasListScreenProps) {
  const [figurinhas, setFigurinhas] = useState<Figurinha[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');

  const carregarFigurinhas = useCallback(async (pageNum: number = 1, refresh: boolean = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }
      
      const resultado = await figurinhasService.listar({
        categoria: filtroCategoria || undefined,
        page: pageNum,
        limit: 20
      });
      
      if (pageNum === 1) {
        setFigurinhas(resultado.figurinhas);
      } else {
        setFigurinhas(prev => [...prev, ...resultado.figurinhas]);
      }
      
      setHasMore(pageNum < resultado.totalPaginas);
      setPage(pageNum);
    } catch (error) {
      errorService.showError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filtroCategoria]);

  useFocusEffect(
    useCallback(() => {
      carregarFigurinhas(1);
    }, [filtroCategoria])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    carregarFigurinhas(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && page > 0) {
      carregarFigurinhas(page + 1);
    }
  };

  const handleAlternarStatus = async (id: string) => {
    try {
      await figurinhasService.alternarStatus(id);
      carregarFigurinhas(1);
    } catch (error) {
      errorService.showError(error);
    }
  };

  const handleDeletar = async (id: string) => {
    errorService.showConfirmation(
      'Confirmar exclusão',
      'Tem certeza que deseja deletar esta figurinha?',
      async () => {
        try {
          await figurinhasService.deletar(id);
          carregarFigurinhas(1);
        } catch (error) {
          errorService.showError(error);
        }
      }
    );
  };

  const getCategoriaCor = (categoria: string) => {
    const cores = {
      comum: '#9E9E9E',
      incomum: '#4CAF50',
      rara: '#2196F3',
      epica: '#9C27B0',
      lendaria: '#FF9800'
    };
    return cores[categoria as keyof typeof cores] || theme.colors.primary;
  };

  const getCategoriaIcone = (categoria: string) => {
    const icones = {
      comum: 'document',
      incomum: 'star-outline',
      rara: 'star-half',
      epica: 'star',
      lendaria: 'sparkles'
    };
    return icones[categoria as keyof typeof icones] || 'image';
  };

  const renderFigurinha = ({ item }: { item: Figurinha }) => {
    const pontoNome = typeof item.pontoInteresse === 'object' && item.pontoInteresse 
      ? item.pontoInteresse.nome 
      : 'Sem ponto associado';

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('FigurinhaForm', { figurinhaId: item._id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <View style={[styles.numeroContainer, { backgroundColor: getCategoriaCor(item.categoria) }]}>
              <Text style={styles.numeroText}>#{item.numero}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.nome}
              </Text>
              <Text style={styles.cardPonto} numberOfLines={1}>
                {pontoNome}
              </Text>
            </View>
          </View>
          <View style={styles.badgesContainer}>
            <View style={[styles.categoriaBadge, { backgroundColor: getCategoriaCor(item.categoria) }]}>
              <Ionicons name={getCategoriaIcone(item.categoria) as any} size={12} color={theme.colors.white} />
              <Text style={styles.categoriaText}>{item.categoria.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.cardDescricao} numberOfLines={2}>
          {item.descricao}
        </Text>

        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="trophy-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{item.pontuacao} pontos</Text>
          </View>
          {item.serie && (
            <View style={styles.detailItem}>
              <Ionicons name="albums-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>Série: {item.serie}</Text>
            </View>
          )}
          {item.estatisticas && (
            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>{item.estatisticas.totalObtida || 0} obtidas</Text>
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
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeletar(item._id)}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.title}>Figurinhas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('FigurinhaForm')}
        >
          <Ionicons name="add" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filtroCategoria === '' && styles.filterButtonActive]}
          onPress={() => setFiltroCategoria('')}
        >
          <Text style={[styles.filterButtonText, filtroCategoria === '' && styles.filterButtonTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        {['comum', 'incomum', 'rara', 'epica', 'lendaria'].map((categoria) => (
          <TouchableOpacity
            key={categoria}
            style={[styles.filterButton, filtroCategoria === categoria && styles.filterButtonActive]}
            onPress={() => setFiltroCategoria(categoria)}
          >
            <Text style={[styles.filterButtonText, filtroCategoria === categoria && styles.filterButtonTextActive]}>
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={figurinhas}
        renderItem={renderFigurinha}
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
            <Ionicons name="images-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>
              Nenhuma figurinha encontrada{'\n'}
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
    paddingHorizontal: 12,
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
    fontSize: 12,
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
  numeroContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numeroText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  cardPonto: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoriaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoriaText: {
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
