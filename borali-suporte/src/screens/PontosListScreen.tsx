import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { pontosListStyles as styles } from '../styles/pontosListStyles';
import { pontosService } from '../services/pontosService';
import { errorService } from '../services/errorService';
import { PontoInteresse, CategoriaPonto, StatusPonto } from '../types/pontoInteresse';
import { theme } from '../styles/theme';

type PontosListScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const CATEGORIAS: CategoriaPonto[] = [
  'Restaurante', 'Museu', 'Parque', 'Praia', 'Monumento', 
  'Hotel', 'Aventura', 'Cultura', 'Natureza', 'Compras', 
  'Vida Noturna', 'Outro'
];

export default function PontosListScreen({ navigation }: PontosListScreenProps) {
  const [pontos, setPontos] = useState<PontoInteresse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inputBusca, setInputBusca] = useState('');
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaPonto | undefined>();
  const [statusFiltro, setStatusFiltro] = useState<StatusPonto | undefined>();
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);

  const carregarPontos = async (novaPagina: number = 1, refresh: boolean = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const filtros = {
        busca: busca || undefined,
        categoria: categoriaFiltro,
        status: statusFiltro,
        page: novaPagina,
        limit: 10,
        ordenar: '-createdAt',
      };

      const response = await pontosService.listar(filtros);
      setPontos(response.pontos);
      setPagina(response.paginacao.pagina);
      setTotalPaginas(response.paginacao.totalPaginas);
      setTotal(response.paginacao.total);
    } catch (error: any) {
      errorService.showError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarPontos(1);
    }, [busca, categoriaFiltro, statusFiltro])
  );

  const handleRefresh = () => {
    carregarPontos(1, true);
  };

  const handleBuscar = () => {
    setBusca(inputBusca);
  };

  const handleLimparBusca = () => {
    setInputBusca('');
    setBusca('');
  };

  const handleDeletar = (id: string, nome: string) => {
    errorService.showConfirmation(
      'Confirmar Exclusão',
      `Deseja realmente excluir "${nome}"?`,
      async () => {
        try {
          await pontosService.deletar(id);
          errorService.showSuccess('Ponto de interesse excluído com sucesso!');
          carregarPontos(pagina);
        } catch (error: any) {
          errorService.showError(error);
        }
      }
    );
  };

  const getStatusColor = (status?: StatusPonto) => {
    switch (status) {
      case 'ativo': return styles.statusBadgeAtivo;
      case 'inativo': return styles.statusBadgeInativo;
      case 'rascunho': return styles.statusBadgeRascunho;
      default: return styles.statusBadgeRascunho;
    }
  };

  const renderPontoCard = ({ item }: { item: PontoInteresse }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PontoForm', { pontoId: item._id })}
    >
      {item.fotoCapa ? (
        <Image source={{ uri: item.fotoCapa }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={styles.cardImagePlaceholder}>
          <Ionicons name="image-outline" size={48} color={theme.colors.border} />
        </View>
      )}

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.nome}
          </Text>
          <View style={[styles.statusBadge, getStatusColor(item.status)]}>
            <Text style={styles.statusBadgeText}>
              {item.status || 'rascunho'}
            </Text>
          </View>
        </View>

        <Text style={styles.categoryTag}>{item.categoria}</Text>

        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.descricaoCurta}
        </Text>

        <View style={styles.cardLocation}>
          <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.cardLocationText}>
            {item.localizacao.cidade}, {item.localizacao.pais}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.cardStats}>
            <View style={styles.cardStat}>
              <Ionicons name="eye-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.cardStatText}>{item.visualizacoes || 0}</Text>
            </View>
            {item.avaliacaoMedia !== undefined && item.avaliacaoMedia > 0 && (
              <View style={styles.cardStat}>
                <Ionicons name="star" size={16} color="#FFB800" />
                <Text style={styles.cardStatText}>{item.avaliacaoMedia.toFixed(1)}</Text>
              </View>
            )}
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.cardButton}
              onPress={() => navigation.navigate('PontoForm', { pontoId: item._id })}
            >
              <Ionicons name="create-outline" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cardButton}
              onPress={() => handleDeletar(item._id!, item.nome)}
            >
              <Ionicons name="trash-outline" size={20} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pontos de Interesse</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, cidade..."
            value={inputBusca}
            onChangeText={setInputBusca}
            placeholderTextColor={theme.colors.textSecondary}
            onSubmitEditing={handleBuscar}
            returnKeyType="search"
          />
          {inputBusca.length > 0 ? (
            <TouchableOpacity onPress={handleLimparBusca} style={styles.filterButton}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={handleBuscar} style={styles.searchButton}>
            <Ionicons name="search" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.filtersContainer}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={categoriaFiltro || 'todas'}
              onValueChange={(value) => setCategoriaFiltro(value === 'todas' ? undefined : value as CategoriaPonto)}
              style={styles.pickerFilter}
            >
              <Picker.Item label="Categorias" value="todas" />
              {CATEGORIAS.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={statusFiltro || 'todos'}
              onValueChange={(value) => setStatusFiltro(value === 'todos' ? undefined : value as StatusPonto)}
              style={styles.pickerFilter}
            >
              <Picker.Item label="Status" value="todos" />
              <Picker.Item label="Ativo" value="ativo" />
              <Picker.Item label="Inativo" value="inativo" />
              <Picker.Item label="Rascunho" value="rascunho" />
            </Picker>
          </View>
        </View>
      </View>

      <FlatList
        data={pontos}
        renderItem={renderPontoCard}
        keyExtractor={(item) => item._id!}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>
              Nenhum ponto de interesse encontrado{'\n'}
              Toque no + para criar o primeiro!
            </Text>
          </View>
        }
        ListFooterComponent={
          totalPaginas > 1 ? (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[styles.paginationButton, pagina === 1 && styles.paginationButtonDisabled]}
                onPress={() => pagina > 1 && carregarPontos(pagina - 1)}
                disabled={pagina === 1}
              >
                <Ionicons name="chevron-back" size={20} color={theme.colors.white} />
              </TouchableOpacity>

              <Text style={styles.paginationText}>
                Página {pagina} de {totalPaginas}
              </Text>

              <TouchableOpacity
                style={[styles.paginationButton, pagina === totalPaginas && styles.paginationButtonDisabled]}
                onPress={() => pagina < totalPaginas && carregarPontos(pagina + 1)}
                disabled={pagina === totalPaginas}
              >
                <Ionicons name="chevron-forward" size={20} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('PontoForm')}
      >
        <Ionicons name="add" size={32} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );
}
