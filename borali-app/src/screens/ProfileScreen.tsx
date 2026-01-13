import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { styles } from '../styles/profileStyles';
import authService from '../services/authService';
import { getFirstName, formatDate } from '../utils/helpers';
import theme from '../styles/theme';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Dados do usuário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataDeNascimento, setDataDeNascimento] = useState<Date | null>(null);
  const [pais, setPais] = useState('');
  const [cidade, setCidade] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  // Dados originais para cancelar edição
  const [originalData, setOriginalData] = useState({
    nome: '',
    email: '',
    dataDeNascimento: null as Date | null,
    pais: '',
    cidade: '',
    fotoPerfil: null as string | null,
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await authService.getUser();
    if (user) {
      const userData = {
        nome: user.nome || '',
        email: user.email || '',
        dataDeNascimento: user.dataDeNascimento ? new Date(user.dataDeNascimento) : null,
        pais: user.pais || '',
        cidade: user.cidade || '',
        fotoPerfil: user.fotoPerfil || null,
      };
      
      setNome(userData.nome);
      setEmail(userData.email);
      setDataDeNascimento(userData.dataDeNascimento);
      setPais(userData.pais);
      setCidade(userData.cidade);
      setFotoPerfil(userData.fotoPerfil);
      setOriginalData(userData);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDataDeNascimento(selectedDate);
    }
  };

  const pickImage = async () => {
    try {
      // Solicita permissão
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      // Abre a galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        // Comprime e redimensiona a imagem
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 400, height: 400 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        if (manipulatedImage.base64) {
          const base64Image = `data:image/jpeg;base64,${manipulatedImage.base64}`;
          setFotoPerfil(base64Image);
        }
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const handleCancel = () => {
    setNome(originalData.nome);
    setEmail(originalData.email);
    setDataDeNascimento(originalData.dataDeNascimento);
    setPais(originalData.pais);
    setCidade(originalData.cidade);
    setFotoPerfil(originalData.fotoPerfil);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!nome || !email) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        nome,
        email,
        dataDeNascimento: dataDeNascimento ? dataDeNascimento.toISOString() : undefined,
        pais: pais || undefined,
        cidade: cidade || undefined,
        fotoPerfil: fotoPerfil || undefined,
      };

      await authService.updateUser(updateData);
      
      // Atualiza os dados originais
      setOriginalData({
        nome,
        email,
        dataDeNascimento,
        pais,
        cidade,
        fotoPerfil,
      });

      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error: any) {
      const mensagem = error.response?.data?.mensagem || 'Erro ao atualizar perfil';
      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            navigation.replace('Welcome');
          },
        },
      ]
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="auto" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={isEditing ? pickImage : undefined}
            disabled={!isEditing}
          >
            {fotoPerfil ? (
              <Image 
                source={{ uri: fotoPerfil }} 
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>{nome ? getInitials(nome) : '?'}</Text>
            )}
            {isEditing && (
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera" size={20} color={theme.colors.white} />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>{nome ? getFirstName(nome) : ''}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={nome}
              onChangeText={setNome}
              editable={isEditing}
              placeholder="Seu nome completo"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="seu@email.com"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data de Nascimento</Text>
            <TouchableOpacity
              style={[styles.input, !isEditing && styles.inputDisabled, { justifyContent: 'center' }]}
              onPress={() => isEditing && setShowDatePicker(true)}
              disabled={!isEditing}
            >
              <Text style={[{ fontSize: 16 }, !dataDeNascimento && { color: '#999' }]}>
                {dataDeNascimento ? formatDate(dataDeNascimento) : 'DD/MM/AAAA'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dataDeNascimento || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>País</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={pais}
              onChangeText={setPais}
              editable={isEditing}
              placeholder="Seu país"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={cidade}
              onChangeText={setCidade}
              editable={isEditing}
              placeholder="Sua cidade"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {!isEditing ? (
            <>
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Text style={styles.editButtonText}>Editar Perfil</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Sair</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.saveButtonText}>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancel}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
