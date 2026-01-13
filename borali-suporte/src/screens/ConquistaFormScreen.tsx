import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../styles/theme';
import conquistasService, { ConquistaFormData } from '../services/conquistasService';
import { errorService } from '../services/errorService';

type ConquistaFormScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { conquistaId?: string } }, 'params'>;
};

const ICONES_DISPONIVEIS = [
  'trophy', 'medal', 'ribbon', 'star', 'flame', 'heart', 'checkmark-circle',
  'thumbs-up', 'rocket', 'diamond', 'flag', 'gift', 'sparkles'
];

export default function ConquistaFormScreen({ navigation, route }: ConquistaFormScreenProps) {
  const { conquistaId } = route.params || {};
  const isEdit = !!conquistaId;

  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Dados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [icone, setIcone] = useState('trophy');
  const [tipo, setTipo] = useState('bronze');
  const [categoria, setCategoria] = useState('checkins');
  const [condicaoTipo, setCondicaoTipo] = useState('quantidade');
  const [condicaoMeta, setCondicaoMeta] = useState('');
  const [condicaoDescricao, setCondicaoDescricao] = useState('');
  const [recompensaPontos, setRecompensaPontos] = useState('');
  const [recompensaBonus, setRecompensaBonus] = useState('');
  const [ordem, setOrdem] = useState('0');
  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    if (isEdit) {
      carregarConquista();
    }
  }, [conquistaId]);

  const carregarConquista = async () => {
    try {
      setLoading(true);
      const conquista = await conquistasService.buscarPorId(conquistaId!);
      
      setTitulo(conquista.titulo);
      setDescricao(conquista.descricao);
      setIcone(conquista.icone);
      setTipo(conquista.tipo);
      setCategoria(conquista.categoria);
      setCondicaoTipo(conquista.condicao.tipo);
      setCondicaoMeta(conquista.condicao.meta?.toString() || '');
      setCondicaoDescricao(conquista.condicao.descricao || '');
      setRecompensaPontos(conquista.recompensa.pontos.toString());
      setRecompensaBonus(conquista.recompensa.bonus || '');
      setOrdem(conquista.ordem.toString());
      setAtivo(conquista.ativo);
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
    if (!recompensaPontos || parseInt(recompensaPontos) < 0) {
      errorService.showWarning('Pontos de recompensa devem ser maior ou igual a 0');
      return false;
    }
    if ((condicaoTipo === 'quantidade' || condicaoTipo === 'sequencia') && !condicaoMeta) {
      errorService.showWarning('Meta é obrigatória para este tipo de condição');
      return false;
    }
    return true;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    try {
      setSalvando(true);

      const dados: ConquistaFormData = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        icone,
        tipo,
        categoria,
        condicao: {
          tipo: condicaoTipo,
          meta: condicaoMeta ? parseInt(condicaoMeta) : undefined,
          descricao: condicaoDescricao.trim() || undefined,
        },
        recompensa: {
          pontos: parseInt(recompensaPontos),
          bonus: recompensaBonus.trim() || undefined,
        },
        ordem: parseInt(ordem) || 0,
        ativo,
      };

      if (isEdit) {
        await conquistasService.atualizar(conquistaId!, dados);
        errorService.showSuccess('Conquista atualizada com sucesso');
      } else {
        await conquistasService.criar(dados);
        errorService.showSuccess('Conquista criada com sucesso');
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Editar Conquista' : 'Nova Conquista'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Informações Básicas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Básicas</Text>

          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex: Primeiro Check-in"
            maxLength={100}
          />

          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva como conquistar este badge"
            multiline
            numberOfLines={3}
            maxLength={500}
          />

          <Text style={styles.label}>Tipo</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={tipo}
              onValueChange={setTipo}
              style={styles.picker}
            >
              <Picker.Item label="Bronze" value="bronze" />
              <Picker.Item label="Prata" value="prata" />
              <Picker.Item label="Ouro" value="ouro" />
              <Picker.Item label="Platina" value="platina" />
              <Picker.Item label="Diamante" value="diamante" />
            </Picker>
          </View>

          <Text style={styles.label}>Categoria</Text>
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

          <Text style={styles.label}>Ícone</Text>
          <View style={styles.iconGrid}>
            {ICONES_DISPONIVEIS.map((nomeIcone) => (
              <TouchableOpacity
                key={nomeIcone}
                style={[
                  styles.iconButton,
                  icone === nomeIcone && styles.iconButtonActive,
                ]}
                onPress={() => setIcone(nomeIcone)}
              >
                <Ionicons
                  name={nomeIcone as any}
                  size={24}
                  color={icone === nomeIcone ? theme.colors.primary : '#666'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Condição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condição para Conquistar</Text>

          <Text style={styles.label}>Tipo de Condição</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={condicaoTipo}
              onValueChange={setCondicaoTipo}
              style={styles.picker}
            >
              <Picker.Item label="Quantidade" value="quantidade" />
              <Picker.Item label="Sequência" value="sequencia" />
              <Picker.Item label="Primeiro" value="primeiro" />
              <Picker.Item label="Especial" value="especial" />
            </Picker>
          </View>

          {(condicaoTipo === 'quantidade' || condicaoTipo === 'sequencia') && (
            <>
              <Text style={styles.label}>Meta *</Text>
              <TextInput
                style={styles.input}
                value={condicaoMeta}
                onChangeText={setCondicaoMeta}
                placeholder="Ex: 10"
                keyboardType="numeric"
              />
            </>
          )}

          <Text style={styles.label}>Descrição da Condição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={condicaoDescricao}
            onChangeText={setCondicaoDescricao}
            placeholder="Ex: Faça 10 check-ins em locais diferentes"
            multiline
            numberOfLines={2}
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
          />

          <Text style={styles.label}>Bônus Extra (opcional)</Text>
          <TextInput
            style={styles.input}
            value={recompensaBonus}
            onChangeText={setRecompensaBonus}
            placeholder="Ex: Cupom exclusivo de 20% OFF"
            maxLength={200}
          />
        </View>

        {/* Configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>

          <Text style={styles.label}>Ordem de Exibição</Text>
          <TextInput
            style={styles.input}
            value={ordem}
            onChangeText={setOrdem}
            placeholder="0"
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => setAtivo(!ativo)}
          >
            <Text style={styles.label}>Conquista Ativa</Text>
            <View
              style={[
                styles.switch,
                { backgroundColor: ativo ? theme.colors.primary : '#CCC' },
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  { transform: [{ translateX: ativo ? 20 : 0 }] },
                ]}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => navigation.goBack()}
          disabled={salvando}
        >
          <Text style={styles.buttonSecondaryText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleSalvar}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonPrimaryText}>
              {isEdit ? 'Atualizar' : 'Criar'}
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#FFF5E6',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  buttonSecondary: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});
