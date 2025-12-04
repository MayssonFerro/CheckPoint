import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Text, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { registerUser } from '../api/auth';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await registerUser(username, email, password);
      Alert.alert(
        'Sucesso',
        'Usuário cadastrado com sucesso!',
        [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Falha ao cadastrar usuário.';
      Alert.alert('Erro', errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
          </View>
          <Text style={styles.title}>CheckPoint</Text>
          <Text style={styles.subtitle}>Avalie seus jogos favoritos</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome de usuário"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Cadastrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginButtonText}>Já tem uma conta? Faça Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Ubuntu_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Ubuntu_400Regular',
  },
  input: {
    height: 40,
    borderColor: '#444',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#202020',
    borderRadius: 5,
    fontFamily: 'Ubuntu_400Regular',
    color: '#fff',
  },
  registerButton: {
    backgroundColor: '#fa801f',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 16,
  },
  loginButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#888',
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 14,
  },
});

export default RegisterScreen;
