import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { negociosService, Negocio } from '../services/negociosService';
import { errorService } from '../services/errorService';
import { theme } from '../styles/theme';

type NegocioFormScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { negocioId?: string } }, 'params'>;
};

const CATEGORIAS = [
  'Restaurante',
  'Hotel',
  'Pousada',
  'Guia Turístico',
  'Agência de Turismo',
  'Transporte',
  'Artesanato',
  'Loja',
  'Serviços',
  'Entretenimento',
  'Outro',
];

const PLANOS = [
  { value: 'basico', label: 'Básico - R$ 49,99/mês' },
  { value: 'plus', label: 'Plus - R$ 99,99/mês' },
  { value: 'premium', label: 'Premium - R$ 199,99/mês' },
];

const ESTADOS_MARANHAO = ['MA'];
const CIDADES_MARANHAO = [
  'São Luís',
  'Alcântara',
  'Barreirinhas',
  'Carolina',
  'Imperatriz',
  'Caxias',
  'Timon',
  'Codó',
  'Paço do Lumiar',
  'São José de Ribamar',
  'Raposa',
  'Tutóia',
  'Parnaíba',
  'Santo Amaro do Maranhão',
  'Primeira Cruz',
  'Humberto de Campos',
  'Outra',
];

export default function NegocioFormScreen({ navigation, route }: NegocioFormScreenProps) {
  const negocioId = route.params?.negocioId;
  const isEdit = !!negocioId;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [logo, setLogo] = useState<string>('');

  // Dados básicos
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Restaurante');
  const [descricao, setDescricao] = useState('');

  // Localização
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('São Luís');
  const [estado, setEstado] = useState('MA');
  const [cep, setCep] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Contato
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [site, setSite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');

  // Horários
  const [horarioFuncionamento, setHorarioFuncionamento] = useState('');

  // Plano
  const [plano, setPlano] = useState('basico');

  useEffect(() => {
    if (isEdit) {
      carregarNegocio();
    }
  }, [negocioId]);

  const carregarNegocio = async () => {
    try {
      setLoading(true);
      const negocio = await negociosService.buscarPorId(negocioId!);

      setNome(negocio.nome);
      setCategoria(negocio.categoria);
      setDescricao(negocio.descricao || '');
      setLogo(negocio.logo || '');

      if (negocio.localizacao) {
        setEndereco(negocio.localizacao.endereco || '');
        setNumero(negocio.localizacao.numero || '');
        setComplemento(negocio.localizacao.complemento || '');
        setBairro(negocio.localizacao.bairro || '');
        setCidade(negocio.localizacao.cidade || 'São Luís');
        setEstado(negocio.localizacao.estado || 'MA');
        setCep(negocio.localizacao.cep || '');
        if (negocio.localizacao.latitude && negocio.localizacao.longitude) {
          setLatitude(negocio.localizacao.latitude.toString());
          setLongitude(negocio.localizacao.longitude.toString());
        }
      }

      if (negocio.contato) {
        setTelefone(negocio.contato.telefone || '');
        setWhatsapp(negocio.contato.whatsapp || '');
        setEmail(negocio.contato.email || '');
        setSite(negocio.contato.site || '');
        setInstagram(negocio.contato.instagram || '');
        setFacebook(negocio.contato.facebook || '');
      }

      setHorarioFuncionamento(negocio.horarioFuncionamento || '');
      setPlano(negocio.plano || 'basico');
    } catch (error) {
      errorService.showError(error);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarLogo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão Negada', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        
        // Verificar tamanho
        const response = await fetch(uri);
        const blob = await response.blob();
        const sizeInMB = blob.size / (1024 * 1024);

        if (sizeInMB > 1) {
          Alert.alert('Arquivo muito grande', 'A imagem deve ter no máximo 1MB.');
          return;
        }

        // Converter para base64
        const base64 = await fetch(uri)
          .then(res => res.blob())
          .then(blob => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          });

        setLogo(base64);
      }
    } catch (error) {
      errorService.showError(error);
    }
  };

  const validarCampos = (): boolean => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do negócio.');
      return false;
    }

    if (!categoria) {
      Alert.alert('Erro', 'Por favor, selecione uma categoria.');
      return false;
    }

    if (!endereco.trim() || !cidade.trim()) {
      Alert.alert('Erro', 'Por favor, informe o endereço e a cidade.');
      return false;
    }

    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        Alert.alert('Erro', 'Coordenadas inválidas. Latitude deve estar entre -90 e 90, longitude entre -180 e 180.');
        return false;
      }
    }

    if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      Alert.alert('Erro', 'E-mail inválido.');
      return false;
    }

    return true;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    try {
      setSaving(true);

      const dados: any = {
        nome: nome.trim(),
        categoria,
        descricao: descricao.trim(),
        logo: logo || undefined,
        localizacao: {
          endereco: endereco.trim(),
          numero: numero.trim(),
          complemento: complemento.trim(),
          bairro: bairro.trim(),
          cidade: cidade.trim(),
          estado: estado.trim(),
          cep: cep.trim(),
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
        },
        contato: {
          telefone: telefone.trim(),
          whatsapp: whatsapp.trim(),
          email: email.trim(),
          site: site.trim(),
          instagram: instagram.trim(),
          facebook: facebook.trim(),
        },
        horarioFuncionamento: horarioFuncionamento.trim(),
        plano,
      };

      if (isEdit) {
        await negociosService.atualizar(negocioId!, dados);
        Alert.alert('Sucesso', 'Negócio atualizado com sucesso!');
      } else {
        await negociosService.criar(dados);
        Alert.alert('Sucesso', 'Negócio cadastrado com sucesso! Aguarde aprovação.');
      }

      navigation.goBack();
    } catch (error) {
      errorService.showError(error);
    } finally {
      setSaving(false);
    }
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
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{isEdit ? 'Editar Negócio' : 'Novo Negócio'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logo</Text>
          <TouchableOpacity style={styles.logoContainer} onPress={handleSelecionarLogo}>
            {logo ? (
              <Image source={{ uri: logo }} style={styles.logoImage} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Ionicons name="image-outline" size={48} color={theme.colors.textSecondary} />
                <Text style={styles.logoPlaceholderText}>Toque para selecionar</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Dados Básicos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Básicos</Text>
          
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Restaurante Sabor Regional"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <Text style={styles.label}>Categoria *</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={categoria}
              onValueChange={setCategoria}
              style={styles.picker}
            >
              {CATEGORIAS.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o negócio, seus diferenciais..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Localização */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>
          
          <Text style={styles.label}>Endereço *</Text>
          <TextInput
            style={styles.input}
            value={endereco}
            onChangeText={setEndereco}
            placeholder="Rua, Avenida..."
            placeholderTextColor={theme.colors.textSecondary}
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Número</Text>
              <TextInput
                style={styles.input}
                value={numero}
                onChangeText={setNumero}
                placeholder="123"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.rowItem}>
              <Text style={styles.label}>Complemento</Text>
              <TextInput
                style={styles.input}
                value={complemento}
                onChangeText={setComplemento}
                placeholder="Apto, Sala..."
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
          </View>

          <Text style={styles.label}>Bairro</Text>
          <TextInput
            style={styles.input}
            value={bairro}
            onChangeText={setBairro}
            placeholder="Centro, Jardim..."
            placeholderTextColor={theme.colors.textSecondary}
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Cidade *</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={cidade}
                  onValueChange={setCidade}
                  style={styles.picker}
                >
                  {CIDADES_MARANHAO.map((cid) => (
                    <Picker.Item key={cid} label={cid} value={cid} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={[styles.rowItem, { flex: 0.3 }]}>
              <Text style={styles.label}>Estado</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={estado}
                editable={false}
              />
            </View>
          </View>

          <Text style={styles.label}>CEP</Text>
          <TextInput
            style={styles.input}
            value={cep}
            onChangeText={setCep}
            placeholder="00000-000"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
            maxLength={9}
          />

          <Text style={styles.label}>Coordenadas (opcional)</Text>
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <TextInput
                style={styles.input}
                value={latitude}
                onChangeText={setLatitude}
                placeholder="Latitude"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.rowItem}>
              <TextInput
                style={styles.input}
                value={longitude}
                onChangeText={setLongitude}
                placeholder="Longitude"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
          <Text style={styles.hint}>Ex: -2.5307, -44.3068 (São Luís)</Text>
        </View>

        {/* Contato */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          
          <Text style={styles.label}>Telefone</Text>
          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="(98) 98888-8888"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>WhatsApp</Text>
          <TextInput
            style={styles.input}
            value={whatsapp}
            onChangeText={setWhatsapp}
            placeholder="(98) 98888-8888"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="contato@negocio.com"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Site</Text>
          <TextInput
            style={styles.input}
            value={site}
            onChangeText={setSite}
            placeholder="https://www.meunegocio.com"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="url"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Instagram</Text>
          <TextInput
            style={styles.input}
            value={instagram}
            onChangeText={setInstagram}
            placeholder="@meunegocio"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Facebook</Text>
          <TextInput
            style={styles.input}
            value={facebook}
            onChangeText={setFacebook}
            placeholder="meunegocio"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="none"
          />
        </View>

        {/* Horários */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horários</Text>
          
          <Text style={styles.label}>Horário de Funcionamento</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={horarioFuncionamento}
            onChangeText={setHorarioFuncionamento}
            placeholder="Ex: Seg-Sex: 8h-18h, Sáb: 8h-12h"
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Plano */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plano de Assinatura</Text>
          
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={plano}
              onValueChange={setPlano}
              style={styles.picker}
            >
              {PLANOS.map((p) => (
                <Picker.Item key={p.value} label={p.label} value={p.value} />
              ))}
            </Picker>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botão Salvar */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSalvar}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.white} />
              <Text style={styles.saveButtonText}>Salvar Negócio</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
  backButton: {
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSize.xxlarge,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.medium,
    color: theme.colors.text,
  },
  inputDisabled: {
    backgroundColor: theme.colors.inputBackground,
    color: theme.colors.textSecondary,
  },
  textArea: {
    height: 100,
    paddingTop: theme.spacing.md,
  },
  pickerWrapper: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    marginTop: theme.spacing.xs,
  },
  picker: {
    height: 50,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  hint: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  logoContainer: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    borderRadius: theme.borderRadius.large,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    fontSize: theme.fontSize.small,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  footer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    gap: theme.spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.semiBold,
  },
});
