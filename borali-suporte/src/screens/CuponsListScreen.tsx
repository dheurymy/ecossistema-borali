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
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { cuponsService, Cupom } from '../services/cuponsService';
import { errorService } from '../services/errorService';
import { theme } from '../styles/theme';

type CuponsListScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function CuponsListScreen({ navigation }: CuponsListScreenProps) {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [inputBusca, setInputBusca] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalRejeicaoVisible, setModalRejeicaoVisible] = useState(false);
  const [cupomRejeitarId, setCupomRejeitarId] = useState<string | null>(null);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');

  const carregarCupons = async (pageNum = 1, refresh = false) => {
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
      if (filtroStatus) filtros.statusCupom = filtroStatus;
      if (filtroTipo) filtros.tipo = filtroTipo;

      const resultado = await cuponsService.listar(filtros);

      if (pageNum === 1) {
        setCupons(resultado.cupons);
      } else {
        setCupons((prev) => [...prev, ...resultado.cupons]);
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
      carregarCupons(1);
    }, [busca, filtroStatus, filtroTipo])
  );

  const handleRefresh = () => {
    carregarCupons(1, true);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      carregarCupons(page + 1);
    }
  };

  const handleAprovar = async (id: string) => {
    try {
      await cuponsService.aprovar(id);
      errorService.showSuccess('Cupom aprovado com sucesso!');
      carregarCupons(1);
    } catch (error) {
      errorService.showError(error);
    }
  };

  const handleRejeitar = (id: string) => {
    setCupomRejeitarId(id);
    setMotivoRejeicao('');
    setModalRejeicaoVisible(true);
  };

  const confirmarRejeicao = async () => {
    if (!motivoRejeicao.trim()) {
      Alert.alert('Erro', 'Motivo da rejeição é obrigatório');
      return;
    }

    try {
      await cuponsService.rejeitar(cupomRejeitarId!, motivoRejeicao.trim());
      errorService.showSuccess('Cupom rejeitado');
      setModalRejeicaoVisible(false);
      setMotivoRejeicao('');
      setCupomRejeitarId(null);
      carregarCupons(1);
    } catch (error) {
      errorService.showError(error);
    }
  };

  const cancelarRejeicao = () => {
    setModalRejeicaoVisible(false);
    setMotivoRejeicao('');
    setCupomRejeitarId(null);
  };

  const handleAlternarStatus = async (id: string, statusAtual: string) => {
    const acao = statusAtual === 'pausado' ? 'reativar' : 'pausar';
    Alert.alert(
      `${acao === 'pausar' ? 'Pausar' : 'Reativar'} Cupom`,
      `Deseja realmente ${acao} este cupom?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await cuponsService.alternarStatus(id);
              errorService.showSuccess(`Cupom ${acao === 'pausar' ? 'pausado' : 'reativado'}!`);
              carregarCupons(1);
            } catch (error) {
              errorService.showError(error);
            }
          },
        },
      ]
    );
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Confirmar Exclusão', 'Deseja realmente excluir este cupom?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await cuponsService.deletar(id);
            errorService.showSuccess('Cupom excluído com sucesso!');
            carregarCupons(1);
          } catch (error) {
            errorService.showError(error);
          }
        },
      },
    ]);
  };

  const formatarData = (data: string | Date): string => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      ativo: '#4CAF50',
      pausado: '#9E9E9E',
      expirado: '#F44336',
      esgotado: '#FF9800',
    };
    return colors[status] || '#9E9E9E';
  };

  const getStatusAprovacaoColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      aprovado: '#4CAF50',
      pendente: '#FF9800',
      rejeitado: '#F44336',
    };
    return colors[status] || '#9E9E9E';
  };

  const getTipoIcon = (tipo: string): any => {
    const icons: { [key: string]: any } = {
      percentual: 'pricetag',
      valor_fixo: 'cash',
      brinde: 'gift',
      outro: 'ticket',
    };
    return icons[tipo] || 'ticket';
  };

  const renderCupom = ({ item }: { item: Cupom }) => {
    const negocio = typeof item.negocio === 'string' ? null : item.negocio;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('CupomForm', { cupomId: item._id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <Ionicons name={getTipoIcon(item.tipo)} size={24} color={theme.colors.primary} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.titulo}
              </Text>
              {negocio && <Text style={styles.cardNegocio}>{negocio.nome}</Text>}
            </View>
          </View>
          <Text style={styles.cardCodigo}>{item.codigo}</Text>
        </View>

        <Text style={styles.cardDescricao} numberOfLines={2}>
          {item.descricao}
        </Text>

        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              {formatarData(item.dataInicio)} - {formatarData(item.dataFim)}
            </Text>
          </View>

          {item.tipo === 'percentual' && item.percentualDesconto && (
            <View style={styles.detailItem}>
              <Ionicons name="pricetag-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>{item.percentualDesconto}% OFF</Text>
            </View>
          )}

          {item.tipo === 'valor_fixo' && item.valorDesconto && (
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>
                R$ {item.valorDesconto.toFixed(2)} OFF
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.statusCupom!) }]}>
            <Text style={styles.statusText}>{item.statusCupom}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusAprovacaoColor(item.statusAprovacao!) },
            ]}
          >
            <Text style={styles.statusText}>{item.statusAprovacao}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="eye-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{item.visualizacoes || 0}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="hand-left-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.statText}>{item.cliques || 0}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="ticket-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.statText, { color: theme.colors.primary, fontWeight: '600' }]}>
              {item.totalResgates || 0}
              {item.limiteResgates ? `/${item.limiteResgates}` : ''}
            </Text>
          </View>
        </View>

        {item.statusAprovacao === 'pendente' && (
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

        {item.statusAprovacao === 'aprovado' && (
          <View style={styles.actionsContainer}>
            {item.statusCupom && (item.statusCupom === 'ativo' || item.statusCupom === 'pausado') && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: item.statusCupom === 'pausado' ? '#4CAF50' : '#FF9800' }]}
                onPress={() => handleAlternarStatus(item._id!, item.statusCupom!)}
              >
                <Ionicons
                  name={item.statusCupom === 'pausado' ? 'play-circle' : 'pause-circle'}
                  size={20}
                  color="#fff"
                />
                <Text style={styles.actionButtonText}>
                  {item.statusCupom === 'pausado' ? 'Ativar' : 'Pausar'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]} 
              onPress={() => handleDelete(item._id!)}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.statusAprovacao === 'rejeitado' && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rejectButton]} 
              onPress={() => handleDelete(item._id!)}
            >
              <Ionicons name="trash-outline" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
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
        <Text style={styles.title}>Cupons e Ofertas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CupomForm')}
        >
          <Ionicons name="add" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar cupom..."
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
          style={[styles.filterButton, filtroStatus === 'ativo' && styles.filterButtonActive]}
          onPress={() => setFiltroStatus(filtroStatus === 'ativo' ? '' : 'ativo')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filtroStatus === 'ativo' && styles.filterButtonTextActive,
            ]}
          >
            Ativos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filtroStatus === 'pausado' && styles.filterButtonActive]}
          onPress={() => setFiltroStatus(filtroStatus === 'pausado' ? '' : 'pausado')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filtroStatus === 'pausado' && styles.filterButtonTextActive,
            ]}
          >
            Pausados
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filtroStatus === 'expirado' && styles.filterButtonActive]}
          onPress={() => setFiltroStatus(filtroStatus === 'expirado' ? '' : 'expirado')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filtroStatus === 'expirado' && styles.filterButtonTextActive,
            ]}
          >
            Expirados
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cupons}
        renderItem={renderCupom}
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
            <Ionicons name="ticket-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>
              Nenhum cupom encontrado{'\n'}
              Toque no + para criar o primeiro!
            </Text>
          </View>
        }
        ListFooterComponent={
          loading && page > 1 ? (
            <ActivityIndicator size="small" color={theme.colors.primary} style={{ padding: 20 }} />
          ) : null
        }
      />

      <Modal
        visible={modalRejeicaoVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelarRejeicao}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rejeitar Cupom</Text>
            <Text style={styles.modalDescription}>
              Digite o motivo da rejeição:
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ex: Descrição inadequada, valores incorretos..."
              value={motivoRejeicao}
              onChangeText={setMotivoRejeicao}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={cancelarRejeicao}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmarRejeicao}
              >
                <Text style={styles.modalButtonTextConfirm}>Rejeitar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: theme.spacing.sm,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.text,
  },
  cardNegocio: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  cardCodigo: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}15`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.small,
  },
  cardDescricao: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
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
    fontSize: theme.fontSize.small,
    color: '#fff',
    fontWeight: theme.fontWeight.semiBold,
    textTransform: 'capitalize',
  },
  stats: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
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
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  modalDescription: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.medium,
    color: theme.colors.text,
    minHeight: 100,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.inputBackground,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalButtonConfirm: {
    backgroundColor: '#F44336',
  },
  modalButtonTextCancel: {
    color: theme.colors.text,
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semiBold,
  },
  modalButtonTextConfirm: {
    color: theme.colors.white,
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semiBold,
  },
});
