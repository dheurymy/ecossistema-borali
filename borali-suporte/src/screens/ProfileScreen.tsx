import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { styles } from '../styles/profileStyles';
import { authService } from '../services/authService';
import { theme } from '../styles/theme';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Dados do administrador
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [dataDeNascimento, setDataDeNascimento] = useState<Date | null>(null);
  const [pais, setPais] = useState('');
  const [cidade, setCidade] = useState('');
  const [funcao, setFuncao] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  // Dados originais para cancelar edição
  const [originalData, setOriginalData] = useState({
    nome: '',
    email: '',
    dataDeNascimento: null as Date | null,
    pais: '',
    cidade: '',
    funcao: '',
    fotoPerfil: null as string | null,
  });

  useEffect(() => {
    loadAdmin();
  }, []);

  const loadAdmin = async () => {
    const admin = await authService.getUser();
    if (admin) {
      const adminData = {
        nome: admin.nome || '',
        email: admin.email || '',
        dataDeNascimento: admin.dataDeNascimento ? new Date(admin.dataDeNascimento) : null,
        pais: admin.pais || '',
        cidade: admin.cidade || '',
        funcao: admin.funcao || 'Administrador',
        fotoPerfil: admin.fotoPerfil || null,
      };
      
      setNome(adminData.nome);
      setEmail(adminData.email);
      setDataDeNascimento(adminData.dataDeNascimento);
      setPais(adminData.pais);
      setCidade(adminData.cidade);
      setFuncao(adminData.funcao);
      setFotoPerfil(adminData.fotoPerfil);
      setOriginalData(adminData);
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
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 400, height: 400 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        if (manipulatedImage.base64) {
          // Calcular tamanho da imagem em bytes (base64)
          const base64String = manipulatedImage.base64;
          const sizeInBytes = (base64String.length * 3) / 4;
          const sizeInMB = sizeInBytes / (1024 * 1024);

          // Verificar se excede 1MB
          if (sizeInMB > 1) {
            Alert.alert(
              'Imagem muito grande',
              `A imagem tem ${sizeInMB.toFixed(2)}MB. Por favor, escolha uma imagem menor que 1MB.`
            );
            return;
          }

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
    setFuncao(originalData.funcao);
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
        funcao: funcao || undefined,
        fotoPerfil: fotoPerfil || undefined,
      };

      await authService.updateAdmin(updateData);
      
      setOriginalData({
        nome,
        email,
        dataDeNascimento,
        pais,
        cidade,
        funcao,
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
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              })
            );
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

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
          <Text style={styles.userRole}>{funcao}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Administrador</Text>

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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Função</Text>
            <TextInput
              style={[styles.input, !isEditing && styles.inputDisabled]}
              value={funcao}
              onChangeText={setFuncao}
              editable={isEditing}
              placeholder="Administrador"
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
