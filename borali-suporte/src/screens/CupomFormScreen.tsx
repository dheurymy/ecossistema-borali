import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { cuponsService, Cupom } from '../services/cuponsService';
import { negociosService } from '../services/negociosService';
import { errorService } from '../services/errorService';
import { theme } from '../styles/theme';

type CupomFormScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { cupomId?: string } }, 'params'>;
};

export default function CupomFormScreen({ navigation, route }: CupomFormScreenProps) {
  const cupomId = route.params?.cupomId;
  const isEdit = !!cupomId;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [negocios, setNegocios] = useState<any[]>([]);

  // Dados do cupom
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [negocioId, setNegocioId] = useState('');
  const [tipo, setTipo] = useState<'percentual' | 'valor_fixo' | 'brinde' | 'outro'>('percentual');
  const [valorDesconto, setValorDesconto] = useState('');
  const [percentualDesconto, setPercentualDesconto] = useState('');
  const [codigo, setCodigo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [limiteResgates, setLimiteResgates] = useState('');
  const [ilimitado, setIlimitado] = useState(true);
  const [regras, setRegras] = useState('');

  // Restrições
  const [valorMinimo, setValorMinimo] = useState('');
  const [primeiraCompra, setPrimeiraCompra] = useState(false);

  useEffect(() => {
    carregarNegocios();
    if (isEdit) {
      carregarCupom();
    } else {
      // Sugerir datas padrão
      const hoje = new Date();
      const daquiUmMes = new Date(hoje);
      daquiUmMes.setMonth(daquiUmMes.getMonth() + 1);
      
      setDataInicio(hoje.toISOString().split('T')[0]);
      setDataFim(daquiUmMes.toISOString().split('T')[0]);
      gerarCodigoAutomatico();
    }
  }, [cupomId]);

  const carregarNegocios = async () => {
    try {
      const resultado = await negociosService.listar({
        statusAprovacao: 'aprovado',
        limit: 100,
      });
      setNegocios(resultado.negocios);
      
      if (resultado.negocios.length > 0 && !negocioId) {
        setNegocioId(resultado.negocios[0]._id!);
      }
    } catch (error) {
      errorService.showError(error);
    }
  };

  const carregarCupom = async () => {
    try {
      setLoading(true);
      const cupom = await cuponsService.buscarPorId(cupomId!);

      setTitulo(cupom.titulo);
      setDescricao(cupom.descricao);
      setNegocioId(typeof cupom.negocio === 'string' ? cupom.negocio : cupom.negocio._id);
      setTipo(cupom.tipo);
      setValorDesconto(cupom.valorDesconto?.toString() || '');
      setPercentualDesconto(cupom.percentualDesconto?.toString() || '');
      setCodigo(cupom.codigo);
      setDataInicio(new Date(cupom.dataInicio).toISOString().split('T')[0]);
      setDataFim(new Date(cupom.dataFim).toISOString().split('T')[0]);
      
      if (cupom.limiteResgates) {
        setLimiteResgates(cupom.limiteResgates.toString());
        setIlimitado(false);
      }
      
      setRegras(cupom.regras || '');
      setValorMinimo(cupom.restricoes?.valorMinimo?.toString() || '');
      setPrimeiraCompra(cupom.restricoes?.primeiraCompra || false);
    } catch (error) {
      errorService.showError(error);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const gerarCodigoAutomatico = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';
    for (let i = 0; i < 8; i++) {
      codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCodigo(codigo);
  };

  const validarCampos = (): boolean => {
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Por favor, informe o título do cupom.');
      return false;
    }

    if (!descricao.trim()) {
      Alert.alert('Erro', 'Por favor, informe a descrição.');
      return false;
    }

    if (!negocioId) {
      Alert.alert('Erro', 'Por favor, selecione um negócio.');
      return false;
    }

    if (!codigo.trim() || codigo.length < 6) {
      Alert.alert('Erro', 'Código deve ter no mínimo 6 caracteres.');
      return false;
    }

    if (!dataInicio || !dataFim) {
      Alert.alert('Erro', 'Por favor, informe as datas de início e fim.');
      return false;
    }

    if (new Date(dataInicio) >= new Date(dataFim)) {
      Alert.alert('Erro', 'Data de início deve ser anterior à data de fim.');
      return false;
    }

    if (tipo === 'percentual') {
      const perc = parseFloat(percentualDesconto);
      if (!percentualDesconto || isNaN(perc) || perc <= 0 || perc > 100) {
        Alert.alert('Erro', 'Percentual deve estar entre 1 e 100.');
        return false;
      }
    }

    if (tipo === 'valor_fixo') {
      const valor = parseFloat(valorDesconto);
      if (!valorDesconto || isNaN(valor) || valor <= 0) {
        Alert.alert('Erro', 'Valor do desconto deve ser maior que zero.');
        return false;
      }
    }

    if (!ilimitado) {
      const limite = parseInt(limiteResgates);
      if (!limiteResgates || isNaN(limite) || limite <= 0) {
        Alert.alert('Erro', 'Limite de resgates deve ser maior que zero.');
        return false;
      }
    }

    return true;
  };

  const handleSalvar = async () => {
    if (!validarCampos()) return;

    try {
      setSaving(true);

      const dados: any = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        negocio: negocioId,
        tipo,
        codigo: codigo.trim().toUpperCase(),
        dataInicio,
        dataFim,
        regras: regras.trim(),
      };

      if (tipo === 'percentual') {
        dados.percentualDesconto = parseFloat(percentualDesconto);
      } else if (tipo === 'valor_fixo') {
        dados.valorDesconto = parseFloat(valorDesconto);
      }

      if (!ilimitado) {
        dados.limiteResgates = parseInt(limiteResgates);
      } else {
        dados.limiteResgates = null;
      }

      dados.restricoes = {};
      if (valorMinimo) {
        dados.restricoes.valorMinimo = parseFloat(valorMinimo);
      }
      dados.restricoes.primeiraCompra = primeiraCompra;

      if (isEdit) {
        await cuponsService.atualizar(cupomId!, dados);
        Alert.alert('Sucesso', 'Cupom atualizado com sucesso!');
      } else {
        await cuponsService.criar(dados);
        Alert.alert('Sucesso', 'Cupom criado com sucesso!');
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
        <Text style={styles.title}>{isEdit ? 'Editar Cupom' : 'Novo Cupom'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Dados Básicos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Básicos</Text>

          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ex: 20% de desconto na próxima visita"
            placeholderTextColor={theme.colors.textSecondary}
            maxLength={100}
          />

          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva os detalhes da oferta..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />

          <Text style={styles.label}>Negócio *</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={negocioId} onValueChange={setNegocioId} style={styles.picker}>
              {negocios.map((neg) => (
                <Picker.Item key={neg._id} label={neg.nome} value={neg._id} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Tipo e Valor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tipo de Desconto</Text>

          <Text style={styles.label}>Tipo *</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={tipo} onValueChange={(value) => setTipo(value as any)} style={styles.picker}>
              <Picker.Item label="Percentual (%)" value="percentual" />
              <Picker.Item label="Valor Fixo (R$)" value="valor_fixo" />
              <Picker.Item label="Brinde" value="brinde" />
              <Picker.Item label="Outro" value="outro" />
            </Picker>
          </View>

          {tipo === 'percentual' && (
            <>
              <Text style={styles.label}>Percentual de Desconto * (%)</Text>
              <TextInput
                style={styles.input}
                value={percentualDesconto}
                onChangeText={setPercentualDesconto}
                placeholder="Ex: 20"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </>
          )}

          {tipo === 'valor_fixo' && (
            <>
              <Text style={styles.label}>Valor do Desconto * (R$)</Text>
              <TextInput
                style={styles.input}
                value={valorDesconto}
                onChangeText={setValorDesconto}
                placeholder="Ex: 50.00"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="decimal-pad"
              />
            </>
          )}
        </View>

        {/* Código e Validade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Código e Validade</Text>

          <Text style={styles.label}>Código *</Text>
          <View style={styles.codigoContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={codigo}
              onChangeText={(text) => setCodigo(text.toUpperCase())}
              placeholder="CUPOM2026"
              placeholderTextColor={theme.colors.textSecondary}
              maxLength={20}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.gerarButton} onPress={gerarCodigoAutomatico}>
              <Ionicons name="refresh" size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Data Início *</Text>
          <TextInput
            style={styles.input}
            value={dataInicio}
            onChangeText={setDataInicio}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.textSecondary}
          />

          <Text style={styles.label}>Data Fim *</Text>
          <TextInput
            style={styles.input}
            value={dataFim}
            onChangeText={setDataFim}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>

        {/* Limite de Resgates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limite de Resgates</Text>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Resgates ilimitados</Text>
            <Switch
              value={ilimitado}
              onValueChange={setIlimitado}
              trackColor={{ false: '#ccc', true: theme.colors.primary }}
              thumbColor="#fff"
            />
          </View>

          {!ilimitado && (
            <>
              <Text style={styles.label}>Limite *</Text>
              <TextInput
                style={styles.input}
                value={limiteResgates}
                onChangeText={setLimiteResgates}
                placeholder="Ex: 100"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </>
          )}
        </View>

        {/* Regras e Restrições */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Regras e Restrições</Text>

          <Text style={styles.label}>Regras de Uso</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={regras}
            onChangeText={setRegras}
            placeholder="Ex: Válido apenas para consumo no local, não cumulativo com outras promoções..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={1000}
          />

          <Text style={styles.label}>Valor Mínimo (R$)</Text>
          <TextInput
            style={styles.input}
            value={valorMinimo}
            onChangeText={setValorMinimo}
            placeholder="Ex: 50.00"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="decimal-pad"
          />

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Válido apenas para primeira compra</Text>
            <Switch
              value={primeiraCompra}
              onValueChange={setPrimeiraCompra}
              trackColor={{ false: '#ccc', true: theme.colors.primary }}
              thumbColor="#fff"
            />
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
              <Text style={styles.saveButtonText}>Salvar Cupom</Text>
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
  codigoContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  gerarButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.sm,
  },
  switchLabel: {
    fontSize: theme.fontSize.medium,
    color: theme.colors.text,
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
