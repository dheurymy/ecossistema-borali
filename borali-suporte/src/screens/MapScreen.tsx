import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { pontosService } from '../services/pontosService';
import { errorService } from '../services/errorService';
import { PontoInteresse } from '../types/pontoInteresse';
import { theme } from '../styles/theme';

type MapScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export default function MapScreen({ navigation }: MapScreenProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [pontos, setPontos] = useState<PontoInteresse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPonto, setSelectedPonto] = useState<PontoInteresse | null>(null);
  const mapRef = useRef<MapView>(null);

  const calculateRegion = (pontos: PontoInteresse[], userLocation: Location.LocationObject): Region => {
    if (pontos.length === 0) {
      return {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
    }

    // Incluir localização do usuário nos cálculos
    const allLatitudes = [
      userLocation.coords.latitude,
      ...pontos.map(p => p.localizacao.latitude)
    ];
    const allLongitudes = [
      userLocation.coords.longitude,
      ...pontos.map(p => p.localizacao.longitude)
    ];

    const minLat = Math.min(...allLatitudes);
    const maxLat = Math.max(...allLatitudes);
    const minLng = Math.min(...allLongitudes);
    const maxLng = Math.max(...allLongitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    // Adicionar margem de 20% para não ficar muito colado nas bordas
    const latDelta = (maxLat - minLat) * 1.2;
    const lngDelta = (maxLng - minLng) * 1.2;

    // Garantir um zoom mínimo
    const minDelta = 0.05;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, minDelta),
      longitudeDelta: Math.max(lngDelta, minDelta),
    };
  };

  useEffect(() => {
    (async () => {
      try {
        // Solicitar permissão de localização
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          errorService.showWarning('Permissão de localização necessária para exibir pontos próximos');
          navigation.goBack();
          return;
        }

        // Obter localização atual
        setLoading(true);
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(currentLocation);

        // Buscar pontos próximos (50km)
        const resultado = await pontosService.buscarProximos(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          50000 // 50km em metros
        );

        setPontos(resultado.pontos);
        
        if (resultado.pontos.length === 0) {
          Alert.alert(
            'Nenhum ponto encontrado',
            'Não há pontos de interesse ativos em um raio de 50km da sua localização.'
          );
        }
      } catch (error) {
        errorService.showError(error);
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleMarkerPress = (ponto: PontoInteresse) => {
    setSelectedPonto(ponto);
  };

  const handleViewDetails = () => {
    if (selectedPonto) {
      navigation.navigate('PontoForm', { pontoId: selectedPonto._id });
    }
  };

  if (loading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={calculateRegion(pontos, location)}
          showsUserLocation
          showsMyLocationButton
        >
          {pontos.map((ponto) => (
            <Marker
              key={ponto._id}
              coordinate={{
                latitude: ponto.localizacao.latitude,
                longitude: ponto.localizacao.longitude,
              }}
              title={ponto.nome}
              description={ponto.descricaoCurta}
              onPress={() => handleMarkerPress(ponto)}
            >
              <View style={styles.markerContainer}>
                <Ionicons name="location" size={32} color={theme.colors.primary} />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>

      {selectedPonto && (
        <View style={styles.infoCard}>
          {selectedPonto.fotoCapa && (
            <Image 
              source={{ uri: selectedPonto.fotoCapa }} 
              style={styles.pontoImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.infoHeader}>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{selectedPonto.nome}</Text>
              <Text style={styles.infoCategory}>{selectedPonto.categoria}</Text>
              
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.locationText}>
                  {selectedPonto.localizacao.cidade}
                  {selectedPonto.localizacao.estado && `, ${selectedPonto.localizacao.estado}`}
                  {selectedPonto.localizacao.pais && ` - ${selectedPonto.localizacao.pais}`}
                </Text>
              </View>

              <Text style={styles.infoDescription} numberOfLines={3}>
                {selectedPonto.descricaoCurta}
              </Text>
              
              <View style={styles.infoStats}>
                <View style={styles.stat}>
                  <Ionicons name="eye-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={styles.statText}>{selectedPonto.visualizacoes || 0}</Text>
                </View>
                {typeof selectedPonto.avaliacaoMedia === 'number' && selectedPonto.avaliacaoMedia > 0 && (
                  <View style={styles.stat}>
                    <Ionicons name="star" size={16} color="#FFB800" />
                    <Text style={styles.statText}>{selectedPonto.avaliacaoMedia.toFixed(1)}</Text>
                  </View>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedPonto(null)}
            >
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.detailsButton} onPress={handleViewDetails}>
            <Ionicons name="create-outline" size={20} color={theme.colors.white} />
            <Text style={styles.detailsButtonText}>Editar Ponto</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Pontos Próximos</Text>
          <Text style={styles.headerSubtitle}>{pontos.length} pontos em 50km</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mapContainer: {
    flex: 1,
    margin: 15,
    marginTop: 130,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 2,
    borderColor: '#FF8C00',
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.medium,
    color: theme.colors.textSecondary,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xxl + 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pontoImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  infoCategory: {
    fontSize: theme.fontSize.small,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.semiBold,
    marginBottom: theme.spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: theme.spacing.sm,
  },
  locationText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  infoDescription: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  infoStats: {
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
  closeButton: {
    padding: theme.spacing.sm,
  },
  detailsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    margin: theme.spacing.lg,
    marginTop: 0,
    gap: theme.spacing.sm,
  },
  detailsButtonText: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.white,
  },
});
