import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../styles/theme';
import configPontosService, { ConfiguracaoPontos } from '../services/configPontosService';
import { errorService } from '../services/errorService';


interface ConfigPontosScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export default function ConfigPontosScreen({ navigation }: ConfigPontosScreenProps) {


  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [config, setConfig] = useState<ConfiguracaoPontos | null>(null);

  useEffect(() => {
    carregarConfig();
  }, []);

  const carregarConfig = async () => {
    try {
      setLoading(true);
      const dados = await configPontosService.buscarAtiva();
      setConfig(dados);
    } catch (error) {
      errorService.showError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    if (!config) return;
    try {
      setSalvando(true);
      await configPontosService.atualizar(config);
      errorService.showSuccess('Configuração salva com sucesso!');
      navigation.goBack();
    } catch (error) {
      errorService.showError(error);
    } finally {
      setSalvando(false);
    }
  };

  // Exemplo de alteração de campo aninhado:
  const handleChange = (path: string, valor: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const keys = path.split('.');
      const newConfig: any = { ...prev };
      let obj = newConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = isNaN(Number(valor)) ? valor : Number(valor);
      return newConfig;
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Exemplo de campos editáveis (pode ser expandido conforme necessidade):
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurar Pontuação</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {config && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pontos por Check-in</Text>
              <TextInput
                style={styles.input}
                value={String(config.acoes.checkin.pontos)}
                onChangeText={(valor) => handleChange('acoes.checkin.pontos', valor)}
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Limite Diário Check-in</Text>
              <TextInput
                style={styles.input}
                value={String(config.acoes.checkin.limiteDiario)}
                onChangeText={(valor) => handleChange('acoes.checkin.limiteDiario', valor)}
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pontos por Avaliação</Text>
              <TextInput
                style={styles.input}
                value={String(config.acoes.avaliacao.pontos)}
                onChangeText={(valor) => handleChange('acoes.avaliacao.pontos', valor)}
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Limite Diário Avaliação</Text>
              <TextInput
                style={styles.input}
                value={String(config.acoes.avaliacao.limiteDiario)}
                onChangeText={(valor) => handleChange('acoes.avaliacao.limiteDiario', valor)}
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            {/* Adicione mais campos conforme necessário */}
            <View style={{ height: 100 }} />
          </>
        )}
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
            <Text style={styles.buttonSaveText}>Salvar</Text>
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 8,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  buttonCancel: {
    backgroundColor: theme.colors.border,
  },
  buttonCancelText: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  buttonSave: {
    backgroundColor: theme.colors.primary,
  },
  buttonSaveText: {
    color: theme.colors.white,
    fontWeight: 'bold',
  },
});
