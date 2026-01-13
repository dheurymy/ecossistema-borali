import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../styles/theme';
import figurinhasService, { FigurinhaFormData } from '../services/figurinhasService';
import { errorService } from '../services/errorService';

// TODO: importar pontosService para buscar pontos de interesse

// type para ponto de interesse
interface PontoInteresse {
  _id: string;
  nome: string;
}

type FigurinhaFormScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { figurinhaId?: string } }, 'params'>;
};

const CATEGORIAS = [
  { label: 'Comum', value: 'comum' },
  { label: 'Incomum', value: 'incomum' },
  { label: 'Rara', value: 'rara' },
  { label: 'Épica', value: 'epica' },
  { label: 'Lendária', value: 'lendaria' },
];

export default function FigurinhaFormScreen({ navigation, route }: FigurinhaFormScreenProps) {
  const { figurinhaId } = route.params || {};
  const isEdit = !!figurinhaId;

  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Dados do formulário
  const [numero, setNumero] = useState('');
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('comum');
  const [serie, setSerie] = useState('');
  const [pontoInteresse, setPontoInteresse] = useState('');
  const [pontos, setPontos] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [pontosInteresseList, setPontosInteresseList] = useState<PontoInteresse[]>([]);

  useEffect(() => {
    if (isEdit) {
      carregarFigurinha();
    }
    carregarPontosInteresse();
  }, [figurinhaId]);

  const carregarFigurinha = async () => {
    try {
      setLoading(true);
      const figurinha = await figurinhasService.buscarPorId(figurinhaId!);
      setNumero(figurinha.numero.toString());
      setNome(figurinha.nome);
      setDescricao(figurinha.descricao || '');
      setCategoria(figurinha.categoria);
      setSerie(figurinha.serie || '');
      setPontoInteresse((typeof figurinha.pontoInteresse === 'object' && figurinha.pontoInteresse && figurinha.pontoInteresse._id) ? figurinha.pontoInteresse._id : '');
      setPontos(figurinha.pontuacao?.toString() || '');
      setAtivo(figurinha.ativo);
    } catch (error) {
      errorService.showError(error);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const carregarPontosInteresse = async () => {
    try {
      // TODO: trocar por chamada real ao pontosService.listar()
      // Exemplo mock:
      setPontosInteresseList([
        { _id: '1', nome: 'Praça Central' },
        { _id: '2', nome: 'Museu Histórico' },
        { _id: '3', nome: 'Parque das Águas' },
      ]);
    } catch (error) {
      errorService.showError(error);
    }
  };

  const validarCampos = (): boolean => {
    if (!numero.trim()) {
      errorService.showWarning('Número é obrigatório');
      return false;
    }
    if (!nome.trim()) {
      errorService.showWarning('Nome é obrigatório');
      return false;
    }
    if (!pontos || parseInt(pontos) < 0) {
      errorService.showWarning('Pontuação deve ser maior ou igual a 0');
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;
    try {
      setSalvando(true);
      const dados: FigurinhaFormData = {
        numero: numero ? parseInt(numero) : 0,
        nome: nome || '',
        descricao: descricao || '',
        pontoInteresse: pontoInteresse || '',
        categoria: categoria || '',
        serie: serie || '',
        imagem: '', // valor padrão vazio
        condicaoObtencao: { tipo: 'checkin' }, // valor padrão válido
        lancamento: '', // valor padrão vazio
        pontuacao: pontos ? parseInt(pontos) : 0,
        ativo,
      };
      if (isEdit) {
        await figurinhasService.atualizar(figurinhaId!, dados);
        errorService.showSuccess('Figurinha atualizada com sucesso!');
      } else {
        await figurinhasService.criar(dados);
        errorService.showSuccess('Figurinha criada com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      errorService.showError(error);
    } finally {
      setSalvando(false);
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
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Editar Figurinha' : 'Nova Figurinha'}
        </Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.label}>Número *</Text>
          <TextInput
            style={styles.input}
            value={numero}
            onChangeText={setNumero}
            placeholder="Ex: 1"
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Nome da figurinha"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva a figurinha..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <Text style={styles.label}>Categoria *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoria}
              onValueChange={setCategoria}
              style={styles.picker}
            >
              {CATEGORIAS.map((cat) => (
                <Picker.Item key={cat.value} label={cat.label} value={cat.value} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Série</Text>
          <TextInput
            style={styles.input}
            value={serie}
            onChangeText={setSerie}
            placeholder="Ex: 2026"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <Text style={styles.label}>Ponto de Interesse</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={pontoInteresse}
              onValueChange={setPontoInteresse}
              style={styles.picker}
            >
              <Picker.Item label="Nenhum" value="" />
              {pontosInteresseList.map((p) => (
                <Picker.Item key={p._id} label={p.nome} value={p._id} />
              ))}
            </Picker>
          </View>
          <Text style={styles.label}>Pontuação *</Text>
          <TextInput
            style={styles.input}
            value={pontos}
            onChangeText={setPontos}
            placeholder="Ex: 100"
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Ativa</Text>
            <Switch
              value={ativo}
              onValueChange={setAtivo}
              trackColor={{ false: '#ccc', true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonCancel]}
          onPress={() => navigation.goBack()}
          disabled={salvando}
        >
          <Text style={styles.buttonCancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonSave]}
          onPress={handleSalvar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator size="small" color={theme.colors.white} />
          ) : (
            <Text style={styles.buttonSaveText}>
              {isEdit ? 'Atualizar' : 'Salvar'}
            </Text>
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
    padding: 16,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    elevation: 2,
    marginTop: 40,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: theme.colors.text,
  },
  textArea: {
    minHeight: 80,
  },
  pickerContainer: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  switchLabel: {
    fontSize: 14,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    elevation: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancel: {
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  buttonSave: {
    backgroundColor: theme.colors.primary,
  },
  buttonSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
  },
});
