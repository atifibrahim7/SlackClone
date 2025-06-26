import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import simpleAuthService from '../services/simpleAuthService';
import { AuthStorage } from '../utils/AsyncStore';

export const SimpleLoginScreen = ({ onAuthenticated }) => {
  const { colors } = useTheme();
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  // Test backend connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        await simpleAuthService.checkHealth();
        console.log('✅ Backend connection successful');
      } catch (error) {
        console.log('❌ Backend connection failed:', error.message);
        Alert.alert(
          'Connection Error',
          'Cannot connect to backend server. Please check if the server is running.',
        );
      }
    };

    testConnection();
  }, []);

  const testBackend = async () => {
    try {
      // Test health
      const health = await simpleAuthService.checkHealth();
      console.log('Backend health:', health);

      // Test login
      const loginResult = await simpleAuthService.login('testuser');
      console.log('Login result:', loginResult);
    } catch (error) {
      console.error('Backend test error:', error);
    }
  };
  const handleLogin = async () => {
    if (!userId.trim()) {
      Alert.alert('Error', 'Please enter a User ID');
      return;
    }

    setLoading(true);
    try {
      // Call login API
      const result = await simpleAuthService.login(userId.trim());

      // Save auth data to AsyncStorage
      await AuthStorage.saveAuthData(result);

      // Pass authentication data to parent component
      onAuthenticated({
        userId: result.userId,
        token: result.token,
        userData: result.user,
        apiKey: result.apiKey,
      });

      Alert.alert('Success', 'Login successful!');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: colors.text }]}>
          Welcome to Slack Clone
        </Text>
        <TouchableOpacity onPress={testBackend} style={styles.testButton}>
          <Text>Test Backend Connection</Text>
        </TouchableOpacity>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Enter your User ID to continue
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder='Enter User ID (e.g., john_doe)'
          placeholderTextColor={colors.text + '80'}
          value={userId}
          onChangeText={setUserId}
          autoCapitalize='none'
          autoCorrect={false}
          returnKeyType='done'
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text style={styles.loginButtonText}>Login / Create Account</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.infoText, { color: colors.text }]}>
          If you don't have an account, one will be created automatically
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 20,
  },
});
