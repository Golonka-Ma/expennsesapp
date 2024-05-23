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
  ImageBackground,
  View,
  Alert,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { FIREBASE_APP } from '../FirebaseConfig';
import { getFirestore, doc, setDoc } from "firebase/firestore";

const Section: React.FC<SectionProps> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const RegistrationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const firestore = getFirestore(FIREBASE_APP);

  const handleRegister = async () => {
    try {
      // Utwórz użytkownika w systemie uwierzytelniania Firebase
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      // Pobierz UID nowego użytkownika
      const uid = userCredential.user.uid;
      
      // Ustaw nazwę dokumentu jako UID nowego użytkownika
      const userDocRef = doc(firestore, "users", uid);
      
      // Zapisz dane użytkownika do Firestore
      await setDoc(userDocRef, {
        uid: uid,
        username: username,
        email: email,
      });
  
      console.log('Rejestracja pomyślna');
      navigation.navigate('Login'); // Przenieś użytkownika do ekranu logowania
    } catch (error) {
      console.error(error);
      Alert.alert('Błąd rejestracji', 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.');
    }
  };
  
  

  return (
    <SafeAreaView style={styles.screenContainer}>
     <StatusBar translucent backgroundColor="transparent" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.screenContainer}>
        <ImageBackground
          source={require('../assets/white.jpg')} // Ścieżka do twojego obrazu tła
          style={styles.backgroundImage}
        >
        <View style={styles.formContainer}>
        <Text style={styles.titletext}>Rejestracja</Text>  
        <Text style={styles.bottomtext}>Zaloguj się aby kontynuować</Text>
          <Section title="">
            <TextInput
              style={styles.input}
              placeholder="Nazwa"
              autoCapitalize="none"
              onChangeText={setUsername}
              value={username}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
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
            <TouchableOpacity onPress={handleRegister} style={styles.button}>
              <Text style={styles.buttonText}>Zarejestruj się</Text>
            </TouchableOpacity>
          </Section>
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
  sectionContainer: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 45,
    fontWeight: 'bold',
  },
  titletext: {
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 1,
    color: '#800000',
  },
  bottomtext:{
    fontSize: 19,
    paddingLeft: 20,
    fontWeight:"bold",
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
    marginTop:45,
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
});

export default RegistrationScreen;
