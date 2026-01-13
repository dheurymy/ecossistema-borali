import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../styles/theme';
import conquistasService, { Conquista } from '../services/conquistasService';
import { errorService } from '../services/errorService';

type ConquistasListScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function ConquistasListScreen({ navigation }: ConquistasListScreenProps) {
  const [conquistas, setConquistas] = useState<Conquista[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');

  const carregarConquistas = useCallback(async (pagina: number = 1, append: boolean = false) => {
    try {
      if (pagina === 1) setLoading(true);
      
      const resultado = await conquistasService.listar({
        tipo: filtroTipo || undefined,
        categoria: filtroCategoria || undefined,
        page: pagina,
        limit: 20
      });
      
      if (append) {
        setConquistas(prev => [...prev, ...resultado.conquistas]);
      } else {
        setConquistas(resultado.conquistas);
      }
      
      setHasMore(pagina < resultado.totalPaginas);
      setPage(pagina);
    } catch (error) {
      errorService.showError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filtroTipo, filtroCategoria]);

  useEffect(() => {
    carregarConquistas();
  }, [filtroTipo, filtroCategoria]);

  const handleRefresh = () => {
    setRefreshing(true);
    carregarConquistas(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      carregarConquistas(page + 1, true);
    }
  };

  const handleAlternarStatus = async (id: string) => {
    try {
      await conquistasService.alternarStatus(id);
      carregarConquistas(1);
    } catch (error) {
      errorService.showError(error);
    }
  };

  const handleDeletar = async (id: string) => {
    errorService.showConfirmation(
      'Confirmar exclusão',
      'Tem certeza que deseja deletar esta conquista?',
      async () => {
        try {
          await conquistasService.deletar(id);
          carregarConquistas(1);
        } catch (error) {
          errorService.showError(error);
        }
      }
    );
  };

  const getTipoCor = (tipo: string) => {
    const cores = {
      bronze: '#CD7F32',
      prata: '#C0C0C0',
      ouro: '#FFD700',
      platina: '#E5E4E2',
      diamante: '#B9F2FF'
    };
    return cores[tipo as keyof typeof cores] || theme.colors.primary;
  };

  const renderConquista = ({ item }: { item: Conquista }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ConquistaForm', { conquistaId: item._id })}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.tipoTag, { backgroundColor: getTipoCor(item.tipo) }]}>
          <Text style={styles.tipoText}>{item.tipo.toUpperCase()}</Text>
        </View>
        <Ionicons name={item.icone as any} size={40} color={getTipoCor(item.tipo)} />
      </View>

      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.descricao} numberOfLines={2}>{item.descricao}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="trophy" size={16} color={theme.colors.primary} />
          <Text style={styles.infoText}>{item.recompensa.pontos} pts</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="folder-open" size={16} color="#666" />
          <Text style={styles.infoText}>{item.categoria}</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.statusBadge, { backgroundColor: item.ativo ? '#4CAF50' : '#9E9E9E' }]}
          onPress={() => handleAlternarStatus(item._id)}
        >
          <Text style={styles.statusText}>{item.ativo ? 'Ativo' : 'Inativo'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletar(item._id)}
        >
          <Ionicons name="trash" size={20} color="#F44336" />
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
        <Text style={styles.headerTitle}>Conquistas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ConquistaForm')}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={[styles.filterChip, filtroTipo === '' && styles.filterChipActive]}
          onPress={() => setFiltroTipo('')}
        >
          <Text style={styles.filterText}>Todos</Text>
        </TouchableOpacity>
        {['bronze', 'prata', 'ouro'].map((tipo) => (
          <TouchableOpacity
            key={tipo}
            style={[styles.filterChip, filtroTipo === tipo && styles.filterChipActive]}
            onPress={() => setFiltroTipo(tipo)}
          >
            <Text style={styles.filterText}>{tipo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={conquistas}
        renderItem={renderConquista}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color="#CCC" />
            <Text style={styles.emptyText}>Nenhuma conquista encontrada</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersRow: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: '#FFF',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFF',
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
  tipoTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});
