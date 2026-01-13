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
import missoesService, { MissaoFormData } from '../services/missoesService';
import { errorService } from '../services/errorService';

type MissaoFormScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { missaoId?: string } }, 'params'>;
};

const ICONES_DISPONIVEIS = [
  'checkmark-circle', 'star', 'trophy', 'flame', 'flash', 'heart',
  'gift', 'ribbon', 'medal', 'bookmark', 'flag', 'thumbs-up'
];

export default function MissaoFormScreen({ navigation, route }: MissaoFormScreenProps) {
  const { missaoId } = route.params || {};
  const isEdit = !!missaoId;

  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Dados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('diaria');
  const [categoria, setCategoria] = useState('checkins');
  const [icone, setIcone] = useState('checkmark-circle');
  const [cor, setCor] = useState('#4CAF50');
  const [acaoTipo, setAcaoTipo] = useState('checkin');
  const [acaoMeta, setAcaoMeta] = useState('');
  const [recompensaPontos, setRecompensaPontos] = useState('');
  const [recompensaExtra, setRecompensaExtra] = useState('');
  const [validadeInicio, setValidadeInicio] = useState('');
  const [validadeFim, setValidadeFim] = useState('');
  const [repeticao, setRepeticao] = useState<string>('unica');
  const [ativo, setAtivo] = useState(true);
  const [destaque, setDestaque] = useState(false);

  useEffect(() => {
    if (isEdit) {
      carregarMissao();
    }
  }, [missaoId]);

  const carregarMissao = async () => {
    try {
      setLoading(true);
      const missao = await missoesService.buscarPorId(missaoId!);
      
      setTitulo(missao.titulo);
      setDescricao(missao.descricao);
      setTipo(missao.tipo);
      setCategoria(missao.categoria);
      setIcone(missao.icone || 'checkmark-circle');
      setCor(missao.cor || '#4CAF50');
      setAcaoTipo(missao.acao.tipo);
      setAcaoMeta(missao.acao.meta.toString());
      setRecompensaPontos(missao.recompensa.pontos.toString());
      setRecompensaExtra(missao.recompensa.extra || '');
      
      if (missao.validade) {
        setValidadeInicio(missao.validade.inicio ? new Date(missao.validade.inicio).toISOString().split('T')[0] : '');
        setValidadeFim(missao.validade.fim ? new Date(missao.validade.fim).toISOString().split('T')[0] : '');
      }
      
      setRepeticao(missao.repeticao || 'unica');
      setAtivo(missao.ativo);
      setDestaque(missao.destaque || false);
    } catch (error) {
      errorService.showError(error);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const validarCampos = (): boolean => {
    if (!titulo.trim()) {
      errorService.showWarning('Título é obrigatório');
      return false;
    }
    if (!descricao.trim()) {
      errorService.showWarning('Descrição é obrigatória');
      return false;
    }
    if (!acaoMeta || parseInt(acaoMeta) <= 0) {
      errorService.showWarning('Meta deve ser maior que 0');
      return false;
    }
    if (!recompensaPontos || parseInt(recompensaPontos) < 0) {
      errorService.showWarning('Pontos de recompensa devem ser maior ou igual a 0');
      return false;
    }
    if (validadeInicio && validadeFim && new Date(validadeInicio) >= new Date(validadeFim)) {
      errorService.showWarning('Data de fim deve ser posterior à data de início');
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    try {
      setSalvando(true);

      const dados: MissaoFormData = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        tipo,
        categoria,
        icone,
        cor,
        acao: {
          tipo: acaoTipo,
          meta: parseInt(acaoMeta),
          parametros: {}
        },
        recompensa: {
          pontos: parseInt(recompensaPontos),
          extra: recompensaExtra.trim() || undefined
        },
        validade: {
          inicio: validadeInicio || new Date().toISOString().split('T')[0],
          fim: validadeFim || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        repeticao,
        ativo,
        destaque
      };

      if (isEdit) {
        await missoesService.atualizar(missaoId!, dados);
        errorService.showSuccess('Missão atualizada com sucesso!');
      } else {
        await missoesService.criar(dados);
        errorService.showSuccess('Missão criada com sucesso!');
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
          {isEdit ? 'Editar Missão' : 'Nova Missão'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>

          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex: Complete 5 check-ins"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva a missão..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <Text style={styles.label}>Tipo *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipo}
              onValueChange={setTipo}
              style={styles.picker}
            >
              <Picker.Item label="Diária" value="diaria" />
              <Picker.Item label="Semanal" value="semanal" />
              <Picker.Item label="Mensal" value="mensal" />
              <Picker.Item label="Especial" value="especial" />
            </Picker>
          </View>

          <Text style={styles.label}>Categoria *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoria}
              onValueChange={setCategoria}
              style={styles.picker}
            >
              <Picker.Item label="Check-ins" value="checkins" />
              <Picker.Item label="Avaliações" value="avaliacoes" />
              <Picker.Item label="Cupons" value="cupons" />
              <Picker.Item label="Álbum" value="album" />
              <Picker.Item label="Social" value="social" />
              <Picker.Item label="Especial" value="especial" />
            </Picker>
          </View>
        </View>

        {/* Ícone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ícone</Text>
          <View style={styles.iconGrid}>
            {ICONES_DISPONIVEIS.map((iconeItem) => (
              <TouchableOpacity
                key={iconeItem}
                style={[
                  styles.iconButton,
                  icone === iconeItem && styles.iconButtonSelected
                ]}
                onPress={() => setIcone(iconeItem)}
              >
                <Ionicons 
                  name={iconeItem as any} 
                  size={24} 
                  color={icone === iconeItem ? theme.colors.white : theme.colors.text} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ação</Text>

          <Text style={styles.label}>Tipo de Ação *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={acaoTipo}
              onValueChange={setAcaoTipo}
              style={styles.picker}
            >
              <Picker.Item label="Check-in" value="checkin" />
              <Picker.Item label="Avaliação" value="avaliacao" />
              <Picker.Item label="Resgatar Cupom" value="resgateCupom" />
              <Picker.Item label="Compartilhamento" value="compartilhamento" />
              <Picker.Item label="Visita" value="visita" />
              <Picker.Item label="Coleção" value="colecao" />
            </Picker>
          </View>

          <Text style={styles.label}>Meta *</Text>
          <TextInput
            style={styles.input}
            value={acaoMeta}
            onChangeText={setAcaoMeta}
            placeholder="Ex: 5"
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        {/* Recompensa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recompensa</Text>

          <Text style={styles.label}>Pontos *</Text>
          <TextInput
            style={styles.input}
            value={recompensaPontos}
            onChangeText={setRecompensaPontos}
            placeholder="Ex: 100"
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <Text style={styles.label}>Bônus Extra (opcional)</Text>
          <TextInput
            style={styles.input}
            value={recompensaExtra}
            onChangeText={setRecompensaExtra}
            placeholder="Ex: Cupom de desconto"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        {/* Validade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Validade (opcional)</Text>

          <Text style={styles.label}>Data Início</Text>
          <TextInput
            style={styles.input}
            value={validadeInicio}
            onChangeText={setValidadeInicio}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <Text style={styles.label}>Data Fim</Text>
          <TextInput
            style={styles.input}
            value={validadeFim}
            onChangeText={setValidadeFim}
            placeholder="AAAA-MM-DD"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        {/* Configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Missão Ativa</Text>
            <Switch
              value={ativo}
              onValueChange={setAtivo}
              trackColor={{ false: '#ccc', true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Destaque</Text>
            <Switch
              value={destaque}
              onValueChange={setDestaque}
              trackColor={{ false: '#ccc', true: '#FFD700' }}
              thumbColor={theme.colors.white}
            />
          </View>

          <Text style={styles.label}>Tipo de Repetição</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={repeticao}
              onValueChange={setRepeticao}
              style={styles.picker}
            >
              <Picker.Item label="Única (não repete)" value="unica" />
              <Picker.Item label="Diária" value="diaria" />
              <Picker.Item label="Semanal" value="semanal" />
              <Picker.Item label="Mensal" value="mensal" />
            </Picker>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer com botões */}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
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
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
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
