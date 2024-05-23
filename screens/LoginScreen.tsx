import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  ImageBackground,
  Alert,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log('Zalogowano pomyślnie');
      navigation.navigate('Ekran domowy', { refresh: true });
    } catch (error) {
      console.error(error);
      Alert.alert('Błąd logowania', 'Wystąpił błąd podczas logowania. Spróbuj ponownie.');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Registration');
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.screenContainer}>
        <ImageBackground
          source={require('../assets/white.jpg')}
          style={styles.backgroundImage}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Logowanie</Text>
            <Text style={styles.bottomtext}>Zaloguj się aby kontynuować</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              onChangeText={setEmail}
              value={email}
            />
            <TextInput
              style={styles.input}
              placeholder="Hasło"
              secureTextEntry
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Zaloguj się</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Nie masz jeszcze konta?</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    height:850,
    resizeMode: 'cover',
  },
  formContainer: {
    paddingHorizontal: 50,
    marginTop: 150,
  },
  title: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 1,
    color: '#800000',
  },
  bottomtext:{
    fontSize: 19,
    paddingLeft: 20,
    fontWeight:"bold",
    marginBottom: 45,
    
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 25,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    color: 'black', 
  },
  button: {
    backgroundColor: '#800000',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize:20,
    color: 'white',
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
