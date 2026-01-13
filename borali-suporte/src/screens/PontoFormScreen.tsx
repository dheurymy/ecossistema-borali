import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { pontoFormStyles as styles } from '../styles/pontoFormStyles';
import { pontosService } from '../services/pontosService';
import { errorService } from '../services/errorService';
import { CategoriaPonto, StatusPonto, CriarPontoData } from '../types/pontoInteresse';
import { theme } from '../styles/theme';

type PontoFormScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any, any>;
};

const CATEGORIAS: CategoriaPonto[] = [
  'Restaurante', 'Museu', 'Parque', 'Praia', 'Monumento',
  'Hotel', 'Aventura', 'Cultura', 'Natureza', 'Compras',
  'Vida Noturna', 'Outro'
];

const FAIXAS_PRECO = ['Gratuito', '$', '$$', '$$$', '$$$$'];

export default function PontoFormScreen({ navigation, route }: PontoFormScreenProps) {
  const pontoId = route.params?.pontoId;
  const isEdit = !!pontoId;

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  // Campos básicos
  const [nome, setNome] = useState('');
  const [descricaoCurta, setDescricaoCurta] = useState('');
  const [descricaoLonga, setDescricaoLonga] = useState('');
  const [categoria, setCategoria] = useState<CategoriaPonto>('Outro');
  const [status, setStatus] = useState<StatusPonto>('rascunho');
  const [tags, setTags] = useState<string[]>([]);
  const [novaTag, setNovaTag] = useState('');

  // Localização
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [pais, setPais] = useState('');

  // Foto
  const [fotoCapa, setFotoCapa] = useState('');

  // Informações práticas
  const [horarioFuncionamento, setHorarioFuncionamento] = useState('');
  const [faixaPreco, setFaixaPreco] = useState<string>('');
  const [tempoMedioVisita, setTempoMedioVisita] = useState('');

  // Contato
  const [telefone, setTelefone] = useState('');
  const [site, setSite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');

  // Acessibilidade
  const [rampa, setRampa] = useState(false);
  const [banheiroAdaptado, setBanheiroAdaptado] = useState(false);
  const [estacionamento, setEstacionamento] = useState(false);
  const [audioGuia, setAudioGuia] = useState(false);

  useEffect(() => {
    if (isEdit) {
      carregarPonto();
    }
  }, [pontoId]);

  const carregarPonto = async () => {
    try {
      setLoadingData(true);
      const ponto = await pontosService.buscarPorId(pontoId);

      setNome(ponto.nome);
      setDescricaoCurta(ponto.descricaoCurta);
      setDescricaoLonga(ponto.descricaoLonga);
      setCategoria(ponto.categoria);
      setStatus(ponto.status || 'rascunho');
      setTags(ponto.tags || []);

      setLatitude(ponto.localizacao.latitude.toString());
      setLongitude(ponto.localizacao.longitude.toString());
      setEndereco(ponto.localizacao.endereco || '');
      setCidade(ponto.localizacao.cidade);
      setEstado(ponto.localizacao.estado || '');
      setPais(ponto.localizacao.pais);

      setFotoCapa(ponto.fotoCapa || '');

      setHorarioFuncionamento(ponto.informacoesPraticas?.horarioFuncionamento || '');
      setFaixaPreco(ponto.informacoesPraticas?.faixaPreco || '');
      setTempoMedioVisita(ponto.informacoesPraticas?.tempoMedioVisita || '');

      setTelefone(ponto.contato?.telefone || '');
      setSite(ponto.contato?.site || '');
      setInstagram(ponto.contato?.redesSociais?.instagram || '');
      setFacebook(ponto.contato?.redesSociais?.facebook || '');

      setRampa(ponto.acessibilidade?.rampa || false);
      setBanheiroAdaptado(ponto.acessibilidade?.banheiroAdaptado || false);
      setEstacionamento(ponto.acessibilidade?.estacionamento || false);
      setAudioGuia(ponto.acessibilidade?.audioGuia || false);
    } catch (error: any) {
      errorService.showError(error);
      navigation.goBack();
    } finally {
      setLoadingData(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      errorService.showWarning('Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        if (manipResult.base64) {
          // Calcular tamanho da imagem em bytes (base64)
          const base64String = manipResult.base64;
          const sizeInBytes = (base64String.length * 3) / 4;
          const sizeInMB = sizeInBytes / (1024 * 1024);

          // Verificar se excede 1MB
          if (sizeInMB > 1) {
            errorService.showWarning(
              `Imagem muito grande (${sizeInMB.toFixed(2)}MB). Por favor, escolha uma imagem menor que 1MB.`
            );
            return;
          }

          setFotoCapa(`data:image/jpeg;base64,${manipResult.base64}`);
        }
      } catch (error) {
        errorService.showError(error, 'Erro ao processar imagem');
      }
    }
  };

  const adicionarTag = () => {
    if (novaTag.trim() && !tags.includes(novaTag.trim())) {
      setTags([...tags, novaTag.trim()]);
      setNovaTag('');
    }
  };

  const removerTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const validarCampos = (): boolean => {
    if (!nome.trim()) {
      errorService.showWarning('Nome é obrigatório');
      return false;
    }
    if (!descricaoCurta.trim()) {
      errorService.showWarning('Descrição curta é obrigatória');
      return false;
    }
    if (descricaoCurta.length > 200) {
      errorService.showWarning('Descrição curta deve ter no máximo 200 caracteres');
      return false;
    }
    if (!descricaoLonga.trim()) {
      errorService.showWarning('Descrição longa é obrigatória');
      return false;
    }
    if (!latitude || !longitude) {
      errorService.showWarning('Latitude e longitude são obrigatórias');
      return false;
    }
    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      errorService.showWarning('Latitude e longitude devem ser números válidos');
      return false;
    }
    if (!cidade.trim() || !pais.trim()) {
      errorService.showWarning('Cidade e país são obrigatórios');
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    setLoading(true);
    try {
      const data: CriarPontoData = {
        nome: nome.trim(),
        descricaoCurta: descricaoCurta.trim(),
        descricaoLonga: descricaoLonga.trim(),
        categoria,
        tags: tags.length > 0 ? tags : undefined,
        localizacao: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          endereco: endereco.trim() || undefined,
          cidade: cidade.trim(),
          estado: estado.trim() || undefined,
          pais: pais.trim(),
        },
        fotoCapa: fotoCapa || undefined,
        informacoesPraticas: (horarioFuncionamento || faixaPreco || tempoMedioVisita) ? {
          horarioFuncionamento: horarioFuncionamento.trim() || undefined,
          faixaPreco: faixaPreco as any || undefined,
          tempoMedioVisita: tempoMedioVisita.trim() || undefined,
        } : undefined,
        contato: (telefone || site || instagram || facebook) ? {
          telefone: telefone.trim() || undefined,
          site: site.trim() || undefined,
          redesSociais: (instagram || facebook) ? {
            instagram: instagram.trim() || undefined,
            facebook: facebook.trim() || undefined,
          } : undefined,
        } : undefined,
        acessibilidade: {
          rampa,
          banheiroAdaptado,
          estacionamento,
          audioGuia,
        },
        status,
      };

      if (isEdit) {
        await pontosService.atualizar(pontoId, data);
        errorService.showSuccess('Ponto de interesse atualizado com sucesso!');
      } else {
        await pontosService.criar(data);
        errorService.showSuccess('Ponto de interesse criado com sucesso!');
      }

      navigation.goBack();
    } catch (error: any) {
      errorService.showError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Nome <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Cristo Redentor"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Categoria <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={categoria}
                onValueChange={(value) => setCategoria(value as CategoriaPonto)}
              >
                {CATEGORIAS.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Descrição Curta <Text style={styles.required}>*</Text> (máx 200 caracteres)
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Breve descrição do local"
              value={descricaoCurta}
              onChangeText={setDescricaoCurta}
              multiline
              maxLength={200}
            />
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 4 }}>
              {descricaoCurta.length}/200
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Descrição Longa <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { minHeight: 120 }]}
              placeholder="Descrição detalhada do local"
              value={descricaoLonga}
              onChangeText={setDescricaoLonga}
              multiline
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={status}
                onValueChange={(value) => setStatus(value as StatusPonto)}
              >
                <Picker.Item label="Rascunho" value="rascunho" />
                <Picker.Item label="Ativo" value="ativo" />
                <Picker.Item label="Inativo" value="inativo" />
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tags</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Adicionar tag"
                value={novaTag}
                onChangeText={setNovaTag}
                onSubmitEditing={adicionarTag}
              />
              <TouchableOpacity
                onPress={adicionarTag}
                style={{ justifyContent: 'center', paddingHorizontal: 12, backgroundColor: theme.colors.primary, borderRadius: 8 }}
              >
                <Ionicons name="add" size={24} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <TouchableOpacity onPress={() => removerTag(tag)}>
                      <Ionicons name="close-circle" size={16} color={theme.colors.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Foto de Capa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foto de Capa</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            {fotoCapa ? (
              <>
                <Image source={{ uri: fotoCapa }} style={styles.imagePreview} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setFotoCapa('')}
                >
                  <Ionicons name="close" size={20} color={theme.colors.white} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Ionicons name="image-outline" size={48} color={theme.colors.border} />
                <Text style={styles.imagePickerText}>Toque para selecionar uma foto</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Localização */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Localização</Text>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>
                Latitude <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="-22.951916"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>
                Longitude <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="-43.210487"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={styles.input}
              placeholder="Rua, número, bairro"
              value={endereco}
              onChangeText={setEndereco}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>
                Cidade <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Rio de Janeiro"
                value={cidade}
                onChangeText={setCidade}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Estado</Text>
              <TextInput
                style={styles.input}
                placeholder="RJ"
                value={estado}
                onChangeText={setEstado}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              País <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Brasil"
              value={pais}
              onChangeText={setPais}
            />
          </View>
        </View>

        {/* Informações Práticas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Práticas</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Horário de Funcionamento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 8h - 19h (todos os dias)"
              value={horarioFuncionamento}
              onChangeText={setHorarioFuncionamento}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Faixa de Preço</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={faixaPreco}
                onValueChange={(value) => setFaixaPreco(value)}
              >
                <Picker.Item label="Selecione" value="" />
                {FAIXAS_PRECO.map((faixa) => (
                  <Picker.Item key={faixa} label={faixa} value={faixa} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tempo Médio de Visita</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2-3 horas"
              value={tempoMedioVisita}
              onChangeText={setTempoMedioVisita}
            />
          </View>
        </View>

        {/* Contato */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="+55 21 99999-9999"
              value={telefone}
              onChangeText={setTelefone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              placeholder="https://www.exemplo.com"
              value={site}
              onChangeText={setSite}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Instagram</Text>
            <TextInput
              style={styles.input}
              placeholder="@usuario"
              value={instagram}
              onChangeText={setInstagram}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Facebook</Text>
            <TextInput
              style={styles.input}
              placeholder="pagina"
              value={facebook}
              onChangeText={setFacebook}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Acessibilidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acessibilidade</Text>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRampa(!rampa)}
          >
            <View style={[styles.checkbox, rampa && styles.checkboxChecked]}>
              {rampa && <Ionicons name="checkmark" size={16} color={theme.colors.white} />}
            </View>
            <Text style={styles.checkboxLabel}>Rampa de acesso</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setBanheiroAdaptado(!banheiroAdaptado)}
          >
            <View style={[styles.checkbox, banheiroAdaptado && styles.checkboxChecked]}>
              {banheiroAdaptado && <Ionicons name="checkmark" size={16} color={theme.colors.white} />}
            </View>
            <Text style={styles.checkboxLabel}>Banheiro adaptado</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setEstacionamento(!estacionamento)}
          >
            <View style={[styles.checkbox, estacionamento && styles.checkboxChecked]}>
              {estacionamento && <Ionicons name="checkmark" size={16} color={theme.colors.white} />}
            </View>
            <Text style={styles.checkboxLabel}>Estacionamento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAudioGuia(!audioGuia)}
          >
            <View style={[styles.checkbox, audioGuia && styles.checkboxChecked]}>
              {audioGuia && <Ionicons name="checkmark" size={16} color={theme.colors.white} />}
            </View>
            <Text style={styles.checkboxLabel}>Áudio guia</Text>
          </TouchableOpacity>
        </View>

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSalvar}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Criar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
