import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { negociosService, EstatisticasNegocios } from '../services/negociosService';
import { pontosService } from '../services/pontosService';
import { errorService } from '../services/errorService';
import { EstatisticasPontos } from '../types/pontoInteresse';
import { theme } from '../styles/theme';

type DashboardScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsNegocios, setStatsNegocios] = useState<EstatisticasNegocios | null>(null);
  const [statsPontos, setStatsPontos] = useState<EstatisticasPontos | null>(null);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      carregarEstatisticas();
    }, [])
  );

  const carregarEstatisticas = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [negocios, pontos] = await Promise.all([
        negociosService.obterEstatisticas(),
        pontosService.estatisticas(),
      ]);

      setStatsNegocios(negocios);
      setStatsPontos(pontos);
    } catch (error) {
      errorService.showError(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    carregarEstatisticas(true);
  };

  const formatarMoeda = (valor: string | number): string => {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Ionicons name="refresh" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Seção Negócios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="business" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Negócios Parceiros</Text>
          </View>

          <View style={styles.cardsRow}>
            <View style={[styles.card, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="storefront" size={28} color="#fff" />
              <Text style={styles.cardValue}>{statsNegocios?.resumo.total || 0}</Text>
              <Text style={styles.cardLabel}>Total</Text>
            </View>

            <View style={[styles.card, { backgroundColor: '#2196F3' }]}>
              <Ionicons name="cash" size={28} color="#fff" />
              <Text style={styles.cardValue}>
                {formatarMoeda(statsNegocios?.resumo.mrr || 0)}
              </Text>
              <Text style={styles.cardLabel}>MRR</Text>
            </View>
          </View>

          <View style={styles.cardsRow}>
            <View style={[styles.card, { backgroundColor: '#FF9800' }]}>
              <Ionicons name="trending-up" size={28} color="#fff" />
              <Text style={styles.cardValue}>
                {formatarMoeda(statsNegocios?.resumo.arr || 0)}
              </Text>
              <Text style={styles.cardLabel}>ARR</Text>
            </View>

            <View style={[styles.card, { backgroundColor: '#9C27B0' }]}>
              <Ionicons name="gift" size={28} color="#fff" />
              <Text style={styles.cardValue}>
                {statsNegocios?.porStatus.find((s) => s._id === 'trial')?.total || 0}
              </Text>
              <Text style={styles.cardLabel}>Trial</Text>
            </View>
          </View>

          {/* Status dos Negócios */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Por Status de Assinatura</Text>
            {statsNegocios?.porStatus.map((item, index) => (
              <View key={index} style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(item._id) },
                    ]}
                  />
                  <Text style={styles.detailLabel}>{item._id}</Text>
                </View>
                <Text style={styles.detailValue}>{item.total}</Text>
              </View>
            ))}
          </View>

          {/* Planos */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Por Plano</Text>
            {statsNegocios?.porPlano.map((item, index) => (
              <View key={index} style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Ionicons
                    name={getPlanoIcon(item._id)}
                    size={16}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.detailLabel}>{item._id}</Text>
                </View>
                <Text style={styles.detailValue}>{item.total}</Text>
              </View>
            ))}
          </View>

          {/* Categorias */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Por Categoria</Text>
            {statsNegocios?.porCategoria.slice(0, 5).map((item, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item._id}</Text>
                <Text style={styles.detailValue}>{item.total}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Negocios')}
          >
            <Text style={styles.actionButtonText}>Ver Todos os Negócios</Text>
            <Ionicons name="arrow-forward" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        {/* Seção Pontos de Interesse */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={24} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Pontos de Interesse</Text>
          </View>

          <View style={styles.cardsRow}>
            <View style={[styles.card, { backgroundColor: '#00BCD4' }]}>
              <Ionicons name="map" size={28} color="#fff" />
              <Text style={styles.cardValue}>{statsPontos?.resumo.total || 0}</Text>
              <Text style={styles.cardLabel}>Total</Text>
            </View>

            <View style={[styles.card, { backgroundColor: '#4CAF50' }]}>
              <Ionicons name="checkmark-circle" size={28} color="#fff" />
              <Text style={styles.cardValue}>{statsPontos?.resumo.ativos || 0}</Text>
              <Text style={styles.cardLabel}>Ativos</Text>
            </View>
          </View>

          <View style={styles.cardsRow}>
            <View style={[styles.card, { backgroundColor: '#FF5722' }]}>
              <Ionicons name="close-circle" size={28} color="#fff" />
              <Text style={styles.cardValue}>{statsPontos?.resumo.inativos || 0}</Text>
              <Text style={styles.cardLabel}>Inativos</Text>
            </View>

            <View style={[styles.card, { backgroundColor: '#9E9E9E' }]}>
              <Ionicons name="document-text" size={28} color="#fff" />
              <Text style={styles.cardValue}>{statsPontos?.resumo.rascunhos || 0}</Text>
              <Text style={styles.cardLabel}>Rascunhos</Text>
            </View>
          </View>

          {/* Categorias de Pontos */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Por Categoria</Text>
            {statsPontos?.porCategoria.slice(0, 5).map((item, index) => (
              <View key={index} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item._id}</Text>
                <Text style={styles.detailValue}>{item.total}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Pontos')}
          >
            <Text style={styles.actionButtonText}>Ver Todos os Pontos</Text>
            <Ionicons name="arrow-forward" size={20} color={theme.colors.white} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    ativo: '#4CAF50',
    trial: '#2196F3',
    inadimplente: '#FF9800',
    cancelado: '#F44336',
    pausado: '#9E9E9E',
  };
  return colors[status] || '#9E9E9E';
};

const getPlanoIcon = (plano: string): any => {
  const icons: { [key: string]: any } = {
    basico: 'star-outline',
    plus: 'star-half',
    premium: 'star',
  };
  return icons[plano] || 'star-outline';
};

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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.text,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  card: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardValue: {
    fontSize: theme.fontSize.xlarge,
    fontWeight: theme.fontWeight.bold,
    color: '#fff',
    marginTop: theme.spacing.sm,
  },
  cardLabel: {
    fontSize: theme.fontSize.small,
    color: '#fff',
    opacity: 0.9,
    marginTop: theme.spacing.xs,
  },
  detailsCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailsTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  detailLabel: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.text,
    textTransform: 'capitalize',
  },
  detailValue: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.primary,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  actionButtonText: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.white,
  },
});
